import type { Category } from "@spree/sdk";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BRAND_NAME } from "@/lib/brand";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { CurrentYear } from "./CurrentYear";

interface FooterProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
}

export async function Footer({
  rootCategories,
  basePath,
  locale,
}: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tp = await getTranslations({ locale, namespace: "policies" });

  return (
    <footer className="bg-primary text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <span className="text-xl font-bold text-white">{BRAND_NAME}</span>
            <p className="mt-4 text-sm text-neutral-400">{t("description")}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("shop")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`${basePath}/products`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/cart`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("cart")}
                </Link>
              </li>
              {rootCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${basePath}/c/${category.permalink}`}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("company")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={basePath || "/"}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("start")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/#about`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("aboutProject")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/#portfolio`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("portfolio")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/#contact`}
                  className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300">
              {t("policies")}
            </h3>
            <ul className="mt-4 space-y-3">
              {POLICY_LINKS.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`${basePath}/policies/${policy.slug}`}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {tp(policy.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-xs text-neutral-400 text-center">
          <p>
            &copy; <CurrentYear /> {BRAND_NAME}.
          </p>
        </div>
      </div>
    </footer>
  );
}
