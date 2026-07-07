"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getClient } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

/**
 * Shape of `GET /api/v3/store/store` — mirrors
 * `Spree::Api::V3::StoreSerializer` in the `sklepik` backend repo exactly.
 *
 * This is a local shim: `@spree/sdk` (installed at 1.1.0, matching the
 * latest published npm release) doesn't export a `Store` type or
 * `client.store.get()` yet — the method exists in the SDK's source
 * (`sklepik/packages/sdk/src/store-client.ts`) but hasn't been released.
 * We call the endpoint through the SDK's public `client.request()` escape
 * hatch instead (documented for exactly this "endpoint not wrapped yet"
 * case). Once `@spree/sdk` publishes `store.get()`, replace this file's
 * `StoreInfo` interface with `import type { Store } from "@spree/sdk"` and
 * `cachedGetStore()`'s body with `getClient().store.get()`.
 */
export interface StoreInfo {
  id: string;
  name: string;
  url: string;
  default_currency: string;
  default_locale: string;
  supported_currencies: string[];
  supported_locales: string[];
  logo_url: string | null;
}

async function cachedGetStore(): Promise<StoreInfo> {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("store");
  return getClient().request<StoreInfo>("GET", "/store");
}

/**
 * Fetch store branding/config (name, logo, supported currencies/locales)
 * from the Store API. Returns undefined when Spree isn't configured, so
 * callers fall back to the env-based helpers in `@/lib/store` (store name)
 * and `STORE_LOGO_URL` (logo) — matching how `getMarkets()` degrades when
 * unconfigured or unreachable.
 */
export async function getStoreInfo(): Promise<StoreInfo | undefined> {
  if (!isSpreeConfigured()) return undefined;

  return cachedGetStore();
}
