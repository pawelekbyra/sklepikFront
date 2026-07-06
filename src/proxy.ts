import { createSpreeMiddleware } from "@/lib/spree/middleware";
import {
  getDefaultCountry,
  getDefaultLocale,
  getPrefixedLocales,
} from "@/lib/store";

export const proxy = createSpreeMiddleware({
  defaultCountry: getDefaultCountry(),
  defaultLocale: getDefaultLocale(),
  supportedLocales: getPrefixedLocales(),
});

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
