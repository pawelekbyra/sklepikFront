import type { Market } from "@spree/sdk";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { getMarkets } from "@/lib/data/markets";
import { generateStoreMetadata } from "@/lib/metadata/store";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { getDefaultCountry, getDefaultLocale } from "@/lib/store";
import deMessages from "../../../../messages/de.json";
import enMessages from "../../../../messages/en.json";
import esMessages from "../../../../messages/es.json";
import frMessages from "../../../../messages/fr.json";
import plMessages from "../../../../messages/pl.json";

const messagesMap: Record<string, IntlMessages> = {
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fr: frMessages,
  pl: plMessages,
};

interface CountryLocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    country: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: CountryLocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return generateStoreMetadata({ locale });
}

export default async function CountryLocaleLayout({
  children,
  params,
}: CountryLocaleLayoutProps) {
  const { country, locale } = await params;

  let markets: Market[] = [];
  let marketsFetchFailed = false;
  try {
    markets = (await getMarkets({ country, locale })).data;
  } catch {
    marketsFetchFailed = true;
  }

  // Validate that the URL country belongs to an available market.
  // If not, redirect server-side to avoid SSR with wrong prices.
  //
  // A transient markets-fetch failure must NOT be treated as "this country
  // doesn't exist" — skip the check entirely in that case. Otherwise a
  // network blip on the very fallback URL this redirects to would redirect
  // to itself again on the next request, looping forever.
  const isValidCountry =
    marketsFetchFailed ||
    markets.some((market) =>
      market.countries?.some(
        (c) => c.iso.toLowerCase() === country.toLowerCase(),
      ),
    );

  if (!isValidCountry) {
    const defaultMarket = markets.find((m) => m.default) ?? markets[0];
    const fallbackCountry =
      defaultMarket?.countries?.[0]?.iso.toLowerCase() ?? getDefaultCountry();
    const fallbackLocale = defaultMarket?.default_locale ?? getDefaultLocale();

    // Never redirect to the page we're already on.
    if (
      fallbackCountry !== country.toLowerCase() ||
      fallbackLocale !== locale.toLowerCase()
    ) {
      redirect(`/${fallbackCountry}/${fallbackLocale}`);
    }
  }

  // Load messages statically (no runtime data access) to avoid blocking prerender
  const messages = messagesMap[locale] || messagesMap.en;

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale as "en" | "de" | "pl"}
    >
      <StoreProvider
        initialCountry={country}
        initialLocale={locale}
        initialMarkets={markets}
      >
        <AuthProvider>
          <CartProvider>
            <JsonLd data={buildOrganizationJsonLd()} />
            {children}
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
