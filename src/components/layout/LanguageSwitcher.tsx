"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDefaultLocale, getPrefixedLocales } from "@/lib/store";
import { LANGUAGE_NAMES } from "@/lib/utils/language-names";
import { buildBasePath, getPathWithoutPrefix } from "@/lib/utils/path";

/**
 * Purely a UI-language control — independent of currency/market (see
 * docs/plans/market-language-switcher.md). Rewrites only the /{locale}
 * URL segment via a soft client navigation; never touches cart, currency,
 * or cookies.
 */
export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  const locales = [
    getDefaultLocale() as Locale,
    ...getPrefixedLocales().map((l) => l as Locale),
  ];

  // Nothing to switch between — don't render a dropdown with one option.
  if (locales.length <= 1) return null;

  const handleSelect = (locale: Locale) => {
    if (locale === currentLocale) return;
    const pathRest = getPathWithoutPrefix(pathname);
    router.push(`${buildBasePath(locale)}${pathRest}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {LANGUAGE_NAMES[currentLocale as Locale] ??
              currentLocale.toUpperCase()}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
        {locales.map((locale) => {
          const isSelected = locale === currentLocale;
          return (
            <DropdownMenuItem
              key={locale}
              onSelect={() => handleSelect(locale)}
            >
              <span className="flex-1 font-medium">
                {LANGUAGE_NAMES[locale] ?? locale.toUpperCase()}
              </span>
              {isSelected && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
