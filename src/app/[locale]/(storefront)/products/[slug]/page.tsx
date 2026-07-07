import type { Category } from "@spree/sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCachedProduct, PRODUCT_PAGE_EXPAND } from "@/lib/data/cached";
import { generateProductMetadata } from "@/lib/metadata/product";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildProductJsonLd,
} from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";
import { ProductDetails } from "./ProductDetails";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    category_id?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateProductMetadata({ locale, slug });
}

function findBreadcrumbCategory(
  categories: Category[],
  categoryId?: string,
): Category | undefined {
  if (categories.length === 0) return undefined;
  if (categoryId) {
    const match = categories.find((c) => c.id === categoryId);
    if (match) return match;
  }
  return categories[0];
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { locale, slug } = await params;
  const { category_id } = await searchParams;
  const basePath = buildBasePath(locale);

  // TEMP DEBUG: raw fetch bypassing the SDK entirely, to see the real
  // baseUrl/status/body Vercel's serverless function actually gets.
  try {
    const rawBase = (process.env.SPREE_API_URL || "").replace(/\/$/, "");
    const rawUrl = `${rawBase}/api/v3/store/products/${slug}`;
    const rawKey = process.env.SPREE_PUBLISHABLE_KEY || "";
    const rawRes = await fetch(rawUrl, {
      headers: { "x-spree-api-key": rawKey },
    });
    const rawText = await rawRes.text();
    console.error("[DEBUG raw fetch]", {
      rawUrl,
      keyPrefix: rawKey.slice(0, 6),
      keyLength: rawKey.length,
      status: rawRes.status,
      ok: rawRes.ok,
      bodySnippet: rawText.slice(0, 300),
    });
  } catch (rawErr) {
    console.error("[DEBUG raw fetch] threw", rawErr);
  }

  let product: Awaited<ReturnType<typeof getCachedProduct>>;
  try {
    product = await getCachedProduct(slug, PRODUCT_PAGE_EXPAND);
    // TEMP DEBUG: log what actually came back before anything touches it.
    console.error("[DEBUG product page]", {
      slug,
      productIsUndefined: product === undefined,
      productIsNull: product === null,
      productType: typeof product,
      productKeys:
        product && typeof product === "object" ? Object.keys(product) : null,
    });
  } catch (err) {
    console.error("[DEBUG product page] threw", err);
    notFound();
  }

  const storeUrl = getStoreUrl();
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, `${basePath}/products/${product!.slug}`)
    : undefined;

  const breadcrumbCategory = findBreadcrumbCategory(
    product!.categories || [],
    category_id,
  );

  return (
    <>
      {canonicalUrl && (
        <JsonLd data={buildProductJsonLd(product!, canonicalUrl)} />
      )}
      {breadcrumbCategory && storeUrl && (
        <JsonLd
          data={buildBreadcrumbJsonLd(breadcrumbCategory, basePath, storeUrl, {
            name: product!.name,
            slug: product!.slug,
          })}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {breadcrumbCategory && (
          <Breadcrumbs
            category={breadcrumbCategory}
            basePath={basePath}
            productName={product!.name}
            locale={locale}
          />
        )}
      </div>
      <ProductDetails product={product!} basePath={basePath} />
    </>
  );
}
