import { getDefaultLocale, getPrefixedLocales } from "@/lib/store";

/**
 * Build the base path for a locale: empty string for the default locale
 * (no URL prefix), `/{locale}` for every other supported locale.
 */
export function buildBasePath(locale: string): string {
  return locale === getDefaultLocale() ? "" : `/${locale}`;
}

/**
 * Extract the optional /{locale} prefix from a pathname, for locales other
 * than the default (which has no prefix).
 * e.g. "/en/products" -> "/en", "/products" -> ""
 */
export function extractBasePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  if (first && getPrefixedLocales().includes(first)) return `/${first}`;
  return "";
}

/**
 * Get the path portion after the optional /{locale} prefix.
 * e.g. "/en/products/shoes" -> "/products/shoes", "/products/shoes" -> "/products/shoes"
 */
export function getPathWithoutPrefix(pathname: string): string {
  const prefix = extractBasePath(pathname);
  if (!prefix) return pathname;
  return pathname.slice(prefix.length) || "/";
}
