import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Button } from "@/components/ui/button";

function CarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface FeaturedProductsSectionProps {
  basePath: string;
  locale: string;
  country: string;
  currencyPromise: Promise<string | undefined>;
}

export async function FeaturedProductsSection({
  basePath,
  locale,
  country,
  currencyPromise,
}: FeaturedProductsSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "brand",
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 featured-products">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            {t("shopEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
            {t("shopTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            {t("shopDescription")}
          </p>
        </div>
        <Button variant="link" asChild>
          <Link href={`${basePath}/products`}>{t("shopCta")} &rarr;</Link>
        </Button>
      </div>
      <Suspense fallback={<CarouselSkeleton />}>
        <FeaturedProducts
          basePath={basePath}
          locale={locale}
          country={country}
          currencyPromise={currencyPromise}
        />
      </Suspense>
    </section>
  );
}
