export const revalidate = 0;

import type { Metadata } from "next";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { resolveCurrency } from "@/lib/data/markets";
import { generateHomeMetadata } from "@/lib/metadata/home";
import {
  getDefaultCountry,
  getDefaultLocale,
  getPrefixedLocales,
} from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Prebuild the homepage shell for every locale the store serves (the
 * default, unprefixed locale plus every locale with a URL prefix). Next.js
 * reuses the static shell (hero + featured section chrome) while featured
 * products stream in under Suspense.
 */
export async function generateStaticParams() {
  const defaultLocale = getDefaultLocale();
  const locales = [
    defaultLocale,
    ...getPrefixedLocales().filter((l) => l !== defaultLocale),
  ];
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateHomeMetadata({ locale });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const basePath = buildBasePath(locale);
  // Not awaited here — resolved inside the Suspense-wrapped product grid so
  // the static Hero can stream immediately instead of blocking on the
  // backend's markets round-trip (see docs/technical-debt.md).
  const currencyPromise = resolveCurrency(getDefaultCountry());

  return (
    <div>
      <HeroSection basePath={basePath} locale={locale} />
      <FeaturedProductsSection
        basePath={basePath}
        locale={locale}
        country={getDefaultCountry()}
        currencyPromise={currencyPromise}
      />
    </div>
  );
}
