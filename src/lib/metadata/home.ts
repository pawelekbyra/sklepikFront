import type { Metadata } from "next";
import { buildCanonicalUrl, SOCIAL_IMAGE_PATH } from "@/lib/seo";
import {
  getStoreMetaDescription,
  getStoreSeoTitle,
  getStoreUrl,
} from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";

interface HomeMetadataParams {
  locale: string;
}

export async function generateHomeMetadata({
  locale,
}: HomeMetadataParams): Promise<Metadata> {
  const storeName = getStoreSeoTitle();
  const description = getStoreMetaDescription();
  const storeUrl = getStoreUrl();
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, buildBasePath(locale) || "/")
    : undefined;

  return {
    title: { absolute: storeName },
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: storeName,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      type: "website",
      images: [SOCIAL_IMAGE_PATH],
    },
  };
}
