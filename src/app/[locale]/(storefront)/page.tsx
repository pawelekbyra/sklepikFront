export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { HejkartyProductsSection } from "@/components/home/HejkartyProductsSection";
import { SerowyMichalShowcase } from "@/components/home/SerowyMichalShowcase";
import { resolveCurrency } from "@/lib/data/markets";
import { generateHomeMetadata } from "@/lib/metadata/home";
import { getDefaultCountry } from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  try {
    return generateHomeMetadata({ locale });
  } catch (_error) {
    return { title: "Shop" };
  }
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
      <SerowyMichalShowcase basePath={basePath} />
      <HejkartyProductsSection
        basePath={basePath}
        locale={locale}
        country={getDefaultCountry()}
        currencyPromise={currencyPromise}
      />
    </div>
  );
}
