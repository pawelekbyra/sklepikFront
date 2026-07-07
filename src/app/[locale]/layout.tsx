import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { getMarkets } from "@/lib/data/markets";
import { getStoreInfo } from "@/lib/data/store";
import { generateStoreMetadata } from "@/lib/metadata/store";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { getDefaultCountry } from "@/lib/store";
import deMessages from "../../../messages/de.json";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import frMessages from "../../../messages/fr.json";
import plMessages from "../../../messages/pl.json";

const messagesMap: Record<string, IntlMessages> = {
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fr: frMessages,
  pl: plMessages,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return generateStoreMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const country = getDefaultCountry();

  // Single-market store: the country used for pricing/markets is a fixed
  // server default, never derived from the URL. Fetch failures here just
  // mean an empty country-switcher list — not a redirect, so there's no
  // way for this to loop. Fetched in parallel with store branding info —
  // neither await blocks on the other.
  const [markets, storeInfo] = await Promise.all([
    getMarkets({ country, locale })
      .then((res) => res.data)
      .catch(() => []),
    getStoreInfo().catch(() => undefined),
  ]);

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
            <JsonLd data={buildOrganizationJsonLd(storeInfo?.logo_url)} />
            {children}
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
