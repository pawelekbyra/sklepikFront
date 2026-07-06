import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";

interface ProductsMetadataParams {
  locale: string;
}

export async function generateProductsMetadata({
  locale,
}: ProductsMetadataParams): Promise<Metadata> {
  const storeUrl = getStoreUrl();
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, `${buildBasePath(locale)}/products`)
    : undefined;

  return {
    title: "Produkty",
    description: "Przeglądaj naszą pełną kolekcję produktów.",
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: "Produkty",
      description: "Przeglądaj naszą pełną kolekcję produktów.",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      type: "website",
    },
  };
}
