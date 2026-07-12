import type { Category } from "@spree/sdk";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import type { StoreInfo } from "@/lib/data/store";

const LazyMobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
  {
    loading: () => (
      <div className="inline-flex items-center justify-center h-10 w-10" />
    ),
  },
);

const LazyLanguageSwitcher = dynamic(
  () =>
    import("@/components/layout/LanguageSwitcher").then((mod) => ({
      default: mod.LanguageSwitcher,
    })),
  {
    loading: () => (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  },
);

interface HeaderProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
  storeInfo?: StoreInfo;
}

export async function Header({
  rootCategories,
  basePath,
  locale,
  storeInfo: _storeInfo,
}: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "header" });

  return (
    <SearchToggle
      basePath={basePath}
      left={
        <>
          <LazyMobileMenu rootCategories={rootCategories} basePath={basePath} />
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link href={basePath || "/"} className="hover:text-gray-950">
              {t("home")}
            </Link>
            <Link href={`${basePath}/#about`} className="hover:text-gray-950">
              {t("aboutProject")}
            </Link>
            <Link
              href={`${basePath}/#portfolio`}
              className="hover:text-gray-950"
            >
              {t("portfolio")}
            </Link>
            <Link href={`${basePath}/products`} className="hover:text-gray-950">
              {t("shop")}
            </Link>
            <Link href={`${basePath}/#contact`} className="hover:text-gray-950">
              {t("contact")}
            </Link>
          </nav>
        </>
      }
      center={
        <Link href={basePath || "/"} className="flex items-center min-w-0">
          <span className="truncate text-lg font-bold text-gray-900">
            {BRAND_NAME}
          </span>
        </Link>
      }
      rightStart={
        <div className="hidden lg:block">
          <LazyLanguageSwitcher />
        </div>
      }
      rightEnd={
        <>
          {/* Account - desktop only */}
          <div className="hidden md:block">
            <Button variant="ghost" size="icon-lg" asChild>
              <Link href={`${basePath}/account`} aria-label={t("account")}>
                <User className="size-5" />
              </Link>
            </Button>
          </div>

          {/* Cart */}
          <CartButton />
        </>
      }
    />
  );
}
