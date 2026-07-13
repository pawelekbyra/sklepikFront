"use server";

import { SpreeError } from "@spree/sdk";
import { getClient } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

export interface StorefrontButtonBlock {
  id: string;
  type: "button";
  position: number;
  preferences: {
    label: string;
    href: string;
    openInNewTab: boolean;
  };
}

export interface StorefrontHeroSection {
  id: string;
  type: "hero";
  position: number;
  preferences: {
    heading: string;
    subheading: string;
    backgroundImageAssetId: string | null;
  };
  blocks: StorefrontButtonBlock[];
}

export interface StorefrontProductGridSection {
  id: string;
  type: "product_grid";
  position: number;
  preferences: {
    heading: string;
    taxonId: string | null;
    limit: number;
  };
}

export type StorefrontSection =
  | StorefrontHeroSection
  | StorefrontProductGridSection;

export interface StorefrontPageDocument {
  schemaVersion: 1;
  sections: StorefrontSection[];
}

export interface PublishedStorefrontPage {
  id: string;
  slug: string;
  title: string;
  document: StorefrontPageDocument;
  published_at: string;
}

export async function getPublishedStorefrontPage(): Promise<
  PublishedStorefrontPage | undefined
> {
  if (!isSpreeConfigured()) return undefined;

  try {
    return await getClient().request<PublishedStorefrontPage>(
      "GET",
      "/storefront_page",
    );
  } catch (error) {
    // A missing page is the expected state for stores that have not published
    // from the editor yet. The homepage keeps its code-defined fallback.
    if (error instanceof SpreeError && error.status === 404) return undefined;
    throw error;
  }
}
