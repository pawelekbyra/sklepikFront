import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductListing } from "@/components/products/ProductListing";
import { resolveCurrency } from "@/lib/data/markets";
import { getProductFilters, getProducts } from "@/lib/data/products";
import { generateProductsMetadata } from "@/lib/metadata/products";
import { getDefaultCountry } from "@/lib/store";
import { parseListingSearchParams } from "@/lib/utils/listing-search-params";
import { buildBasePath } from "@/lib/utils/path";

interface ProductsPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateProductsMetadata({ locale });
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  const basePath = buildBasePath(locale);
  // Not awaited here — resolved inside ProductListing's Suspense boundary
  // so the page chrome (heading, breadcrumbs) can stream immediately
  // instead of blocking on the backend's markets round-trip.
  const currencyPromise = resolveCurrency(getDefaultCountry());

  const listingState = parseListingSearchParams(rawSearchParams);
  const query = listingState.query;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "products",
  });

  const listId = query ? "search-results" : "all-products";
  const listName = query ? "Search Results" : "All Products";

  return (
    <div className="bg-[#fff7df]">
      <section className="border-b border-[#3b2415]/10 bg-[radial-gradient(circle_at_10%_10%,#ffd166_0,transparent_26%),linear-gradient(135deg,#fff7df,#ffdca8)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d95d00]">
              sklep Serowego Michała
            </p>
            {query ? (
              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#26180f] sm:text-6xl">
                {t("searchResultsFor", { query })}
              </h1>
            ) : (
              <>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#26180f] sm:text-6xl">
                  HEJARTY i serowe rzeczy
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b4428]">
                  To nadal sklep z produktami ze Store API, ale potraktowany
                  jako część świata Serowego Michała: szybki zakup, mocna
                  narracja i zero generycznego katalogu.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 rounded-[2rem] border border-[#3b2415]/10 bg-[#26180f] p-6 text-white shadow-2xl shadow-[#3b2415]/15 md:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffd166]">
              01 / HEJARTY
            </p>
            <p className="mt-2 text-sm text-white/70">
              Produkt-bohater prowadzi do zakupu bez utraty klimatu strony.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffd166]">
              02 / Store API
            </p>
            <p className="mt-2 text-sm text-white/70">
              Ceny, warianty i dostępność zostają źródłowo w backendzie.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffd166]">
              03 / Serowy styl
            </p>
            <p className="mt-2 text-sm text-white/70">
              Karty, filtry i listing mają ten sam język wizualny co landing.
            </p>
          </div>
        </div>
        <ProductListing
          state={listingState}
          basePath={basePath}
          currencyPromise={currencyPromise}
          locale={locale as Locale}
          listId={listId}
          listName={listName}
          fetchProducts={getProducts}
          fetchFilters={getProductFilters}
          emptyMessage={
            query
              ? t("noMatchingProducts", { query })
              : t("tryAdjustingFilters")
          }
        />
      </div>
    </div>
  );
}
