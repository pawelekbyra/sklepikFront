import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/products/ProductListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategory, getCategoryProducts } from "@/lib/data/categories";
import { resolveCurrency } from "@/lib/data/markets";
import { getProductFilters } from "@/lib/data/products";
import { generateCategoryMetadata } from "@/lib/metadata/category";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getDefaultCountry, getStoreUrl } from "@/lib/store";
import { parseListingSearchParams } from "@/lib/utils/listing-search-params";
import { buildBasePath } from "@/lib/utils/path";
import { CategoryBanner } from "./CategoryBanner";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    permalink: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, permalink } = await params;
  return generateCategoryMetadata({ locale, permalink });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { locale, permalink } = await params;
  const rawSearchParams = await searchParams;
  const fullPermalink = permalink.join("/");
  const basePath = buildBasePath(locale);
  // Kicked off before the category fetch (not awaited) so it resolves in
  // parallel instead of adding a sequential round-trip on top of it; the
  // actual await happens inside ProductListing's Suspense boundary.
  const currencyPromise = resolveCurrency(getDefaultCountry());

  let category;
  try {
    category = await getCategory(fullPermalink, {
      expand: ["ancestors", "children"],
    });
  } catch (error) {
    console.error("Failed to fetch category:", error);
    notFound();
  }

  if (!category) {
    notFound();
  }

  const storeUrl = getStoreUrl();
  const listingState = parseListingSearchParams(rawSearchParams);

  // Pre-bind categoryId onto the server action so the client-side
  // InfiniteProductList island gets a single-arg (params) fetcher it can
  // call directly. Inline arrow closures don't serialize across the
  // server→client boundary; `.bind()` on a server action reference does.
  const fetchCategoryProducts = getCategoryProducts.bind(null, category.id);

  return (
    <div>
      {storeUrl && (
        <JsonLd data={buildBreadcrumbJsonLd(category, basePath, storeUrl)} />
      )}

      <CategoryBanner category={category} basePath={basePath} locale={locale} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ProductListing
          state={listingState}
          basePath={basePath}
          currencyPromise={currencyPromise}
          locale={locale as Locale}
          listId={`category-${category.id}`}
          listName={`Category: ${category.name}`}
          categoryId={category.id}
          baseParams={{ in_category: category.id }}
          fetchProducts={fetchCategoryProducts}
          fetchFilters={getProductFilters}
        />
      </div>
    </div>
  );
}
