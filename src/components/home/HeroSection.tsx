import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getStoreName } from "@/lib/store";

interface HeroSectionProps {
  basePath: string;
  locale: string;
  content?: {
    heading?: string;
    subheading?: string;
    button?: {
      label: string;
      href: string;
      openInNewTab: boolean;
    };
  };
}

export async function HeroSection({
  basePath,
  locale,
  content,
}: HeroSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });
  const storeName = getStoreName();
  const heading = content?.heading || t("welcome", { storeName });
  const subheading = content?.subheading || t("heroDescription");
  const button = content?.button ?? {
    label: t("shopNow"),
    href: "/products",
    openInNewTab: false,
  };
  const buttonHref = button.href.startsWith("/")
    ? `${basePath}${button.href}`
    : button.href;

  return (
    <section className="border-b border-gray-200 min-h-[823px] md:min-h-0 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {heading}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {subheading}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button size="lg" asChild>
              <Link
                href={buttonHref}
                target={button.openInNewTab ? "_blank" : undefined}
                rel={button.openInNewTab ? "noreferrer" : undefined}
              >
                {button.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
