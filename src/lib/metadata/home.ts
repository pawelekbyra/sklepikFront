import type { Metadata } from "next";
import { BRAND_META_DESCRIPTION, BRAND_SEO_TITLE } from "@/lib/brand";
import { buildCanonicalUrl, SOCIAL_IMAGE_PATH } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";
import { buildBasePath } from "@/lib/utils/path";

interface HomeMetadataParams {
  locale: string;
}

export async function generateHomeMetadata({
  locale,
}: HomeMetadataParams): Promise<Metadata> {
  const title = BRAND_SEO_TITLE;
  const description = BRAND_META_DESCRIPTION;
  const storeUrl = getStoreUrl();
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, buildBasePath(locale) || "/")
    : undefined;

  return {
    title: { absolute: title },
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      type: "website",
      images: [SOCIAL_IMAGE_PATH],
    },
  };
}
