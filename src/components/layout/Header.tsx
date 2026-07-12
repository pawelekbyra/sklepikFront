import type { Category } from "@spree/sdk";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import type { StoreInfo } from "@/lib/data/store";
import { getStoreName } from "@/lib/store";

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

const storeName = getStoreName();

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
  storeInfo,
}: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "header" });
  const logoUrl = storeInfo?.logo_url;

  return (
    <SearchToggle
      basePath={basePath}
      left={
        <LazyMobileMenu rootCategories={rootCategories} basePath={basePath} />
      }
      center={
        <Link
          href={basePath || "/"}
          className="flex min-w-0 items-center rounded-full bg-[#fff7df] px-3 py-1 ring-1 ring-[#3b2415]/10"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={200}
              height={80}
              priority
              className="max-h-10 w-auto max-w-[140px] object-contain sm:max-w-[200px]"
            />
          ) : (
            <span className="truncate text-lg font-black tracking-[-0.03em] text-[#26180f]">
              {storeName}
            </span>
          )}
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
