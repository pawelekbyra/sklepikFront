import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HeroSection } from "@/components/home/HeroSection";
import type { StorefrontPageDocument } from "@/lib/data/storefront-page";

interface StorefrontPageRendererProps {
  document: StorefrontPageDocument;
  basePath: string;
  locale: string;
  country: string;
  currencyPromise: Promise<string | undefined>;
}

export function StorefrontPageRenderer({
  document,
  basePath,
  locale,
  country,
  currencyPromise,
}: StorefrontPageRendererProps) {
  return (
    <>
      {[...document.sections]
        .sort((a, b) => a.position - b.position)
        .map((section) => {
          if (section.type === "hero") {
            const button = section.blocks
              .slice()
              .sort((a, b) => a.position - b.position)[0];
            return (
              <HeroSection
                key={section.id}
                basePath={basePath}
                locale={locale}
                content={{
                  heading: section.preferences.heading,
                  subheading: section.preferences.subheading,
                  button: button
                    ? {
                        label: button.preferences.label,
                        href: button.preferences.href,
                        openInNewTab: button.preferences.openInNewTab,
                      }
                    : undefined,
                }}
              />
            );
          }

          if (section.type === "product_grid") {
            return (
              <FeaturedProductsSection
                key={section.id}
                basePath={basePath}
                locale={locale}
                country={country}
                currencyPromise={currencyPromise}
                heading={section.preferences.heading}
                limit={section.preferences.limit}
                categoryId={section.preferences.taxonId ?? undefined}
              />
            );
          }

          return null;
        })}
    </>
  );
}
