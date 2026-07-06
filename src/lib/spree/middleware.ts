import { type NextRequest, NextResponse } from "next/server";

const COUNTRY_COOKIE = "spree_country";
const LOCALE_COOKIE = "spree_locale";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export interface SpreeMiddlewareConfig {
  /**
   * Country ISO code used for market/currency resolution (default: 'pl').
   * This is a single-market store — the country is never part of the URL.
   */
  defaultCountry?: string;
  /** Default locale code — has no URL prefix (default: 'pl') */
  defaultLocale?: string;
  /** Locale codes shown with a URL prefix, e.g. 'en' -> /en/... (default: ['en']) */
  supportedLocales?: string[];
  /** Routes to skip — prefixes matched with startsWith (default: ['/_next', '/api', '/favicon.ico']) */
  staticRoutes?: string[];
}

/**
 * Set spree_country / spree_locale cookies on a response so that
 * `getLocaleOptions()` reads values matching the resolved locale during SSR.
 */
function setLocaleCookies(
  response: NextResponse,
  country: string,
  locale: string,
): void {
  response.cookies.set(COUNTRY_COOKIE, country, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Creates a Next.js middleware implementing "as-needed" locale prefixing
 * for a single-market store:
 *
 * - The default locale (Polish) has NO URL prefix: `/products`.
 * - Every other supported locale is prefixed: `/en/products`.
 * - An explicit `/{defaultLocale}/...` URL is canonicalized (redirected) to
 *   its unprefixed form, so there's exactly one URL per page.
 * - The market/country used for pricing is a fixed server default; it is
 *   never derived from or exposed in the URL.
 */
export function createSpreeMiddleware(
  config: SpreeMiddlewareConfig = {},
): (request: NextRequest) => NextResponse {
  const defaultCountry = config.defaultCountry ?? "pl";
  const defaultLocale = config.defaultLocale ?? "pl";
  const supportedLocales = config.supportedLocales ?? ["en"];
  const staticRoutes = config.staticRoutes ?? [
    "/_next",
    "/api",
    "/dev",
    "/favicon.ico",
  ];

  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static routes
    if (staticRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Skip if pathname contains a file extension (static assets)
    if (/\.\w+$/.test(pathname)) {
      return NextResponse.next();
    }

    const firstSegment = pathname.split("/")[1]?.toLowerCase();

    // Explicit default-locale prefix (e.g. /pl/products) — redirect to the
    // canonical unprefixed URL so there's exactly one address per page.
    if (firstSegment === defaultLocale) {
      const rest = pathname.slice(`/${firstSegment}`.length);
      const url = request.nextUrl.clone();
      url.pathname = rest || "/";
      const response = NextResponse.redirect(url);
      setLocaleCookies(response, defaultCountry, defaultLocale);
      return response;
    }

    if (firstSegment && supportedLocales.includes(firstSegment)) {
      // Explicit non-default locale prefix — pass through, sync cookies.
      const response = NextResponse.next();
      setLocaleCookies(response, defaultCountry, firstSegment);
      return response;
    }

    // No recognized locale prefix — this is the default locale. Rewrite
    // internally to `/{defaultLocale}/...` so the `[locale]` route segment
    // resolves, while the visible URL stays prefix-free.
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url);
    setLocaleCookies(response, defaultCountry, defaultLocale);
    return response;
  };
}
