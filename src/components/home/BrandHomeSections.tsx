import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";

interface BrandHomeSectionsProps {
  basePath: string;
  locale: string;
}

export async function BrandHeroSection({
  basePath,
  locale,
}: BrandHomeSectionsProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "brand",
  });

  return (
    <section className="border-b border-gray-200 bg-gradient-to-b from-amber-50 via-white to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-gray-950">
            {t("heroTitle", { brandName: BRAND_NAME })}
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-700">
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href={`${basePath}/#portfolio`}>
                {t("heroPortfolioCta")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`${basePath}/products`}>{t("heroShopCta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function HowItWorksSection({
  locale,
}: Pick<BrandHomeSectionsProps, "locale">) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "brand",
  });
  const cards = ["operator", "channel", "portfolio"] as const;

  return (
    <section
      id="about"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
          {t("howEyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
          {t("howTitle")}
        </h2>
        <p className="mt-4 text-gray-700">{t("howDescription")}</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-950">
              {t(`howCards.${card}.title`)}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {t(`howCards.${card}.description`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export async function PortfolioSection({
  basePath,
  locale,
}: BrandHomeSectionsProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "brand",
  });

  return (
    <section id="portfolio" className="bg-gray-950 py-16 md:py-20 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            {t("portfolioEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {t("portfolioTitle")}
          </h2>
          <p className="mt-4 text-neutral-300">{t("portfolioDescription")}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-amber-300/30 bg-white p-6 text-gray-950 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              {t("portfolioShopLabel")}
            </p>
            <h3 className="mt-3 text-2xl font-bold">
              {t("portfolioShopTitle")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              {t("portfolioShopDescription")}
            </p>
            <Button className="mt-6" asChild>
              <Link href={`${basePath}/products`}>{t("portfolioShopCta")}</Link>
            </Button>
          </article>
          {["second", "third"].map((slot) => (
            <article
              key={slot}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {t("portfolioPlaceholderLabel")}
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                {t(`portfolioPlaceholders.${slot}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {t(`portfolioPlaceholders.${slot}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function JournalSection({
  locale,
}: Pick<BrandHomeSectionsProps, "locale">) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "brand",
  });

  return (
    <section
      id="contact"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
    >
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
          {t("journalEyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
          {t("journalTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-gray-700">
          {t("journalDescription")}
        </p>
      </div>
    </section>
  );
}
