import Link from "next/link";
import { Suspense } from "react";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Button } from "@/components/ui/button";

function HejkartySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface Props {
  basePath: string;
  locale: string;
  country: string;
  currencyPromise: Promise<string | undefined>;
}

export function HejkartyProductsSection({
  basePath,
  locale,
  country,
  currencyPromise,
}: Props) {
  return (
    <section className="bg-[#fff7df] px-4 py-20 sm:px-6 lg:px-8 featured-products">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 rounded-[2rem] border border-[#3b2415]/10 bg-white/70 p-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d95d00]">
              HEJKARTY w sklepie
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#26180f]">
              Kup HEJKARTY Serowego Michała
            </h2>
            <p className="mt-3 max-w-2xl text-[#6b4428]">
              Commerce zostaje połączony z historią marki: produkty nadal
              pochodzą ze Store API, ale są opakowane w landing z HEJKARTAMI
              zamiast generycznego storefrontu.
            </p>
          </div>
          <Button
            asChild
            className="rounded-full bg-[#d95d00] text-white hover:bg-[#b94c00]"
          >
            <Link href={`${basePath}/products`}>Zobacz talię</Link>
          </Button>
        </div>
        <Suspense fallback={<HejkartySkeleton />}>
          <FeaturedProducts
            basePath={basePath}
            locale={locale}
            country={country}
            currencyPromise={currencyPromise}
          />
        </Suspense>
      </div>
    </section>
  );
}
