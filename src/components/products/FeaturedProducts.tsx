import type { Product } from "@spree/sdk";
import dynamic from "next/dynamic";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { PRODUCT_CARD_FIELDS } from "@/lib/data/cached";
import { cachedListProducts } from "@/lib/data/products";
import { getAccessToken } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

const LazyProductCarousel = dynamic(
  () =>
    import("@/components/products/ProductCarousel").then((mod) => ({
      default: mod.ProductCarousel,
    })),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    ),
  },
);

interface FeaturedProductsProps {
  basePath: string;
  locale: string;
  country: string;
  currencyPromise: Promise<string | undefined>;
  limit?: number;
  categoryId?: string;
}

export async function FeaturedProducts({
  basePath,
  locale,
  country,
  currencyPromise,
  limit = 8,
  categoryId,
}: FeaturedProductsProps) {
  let products: Product[] = [];

  if (isSpreeConfigured()) {
    try {
      const userToken = await getAccessToken();
      const productsResponse = await cachedListProducts(
        {
          limit,
          fields: PRODUCT_CARD_FIELDS,
          category_id: categoryId,
        },
        { locale, country },
        userToken,
      );
      products = productsResponse.data ?? [];
    } catch (error) {
      console.error("FeaturedProducts: failed to load products", error);
    }
  }

  const currency = await currencyPromise;

  return (
    <LazyProductCarousel
      products={products}
      basePath={basePath}
      currency={currency}
    />
  );
}
