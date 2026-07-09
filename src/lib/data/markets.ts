"use server";

import type { Market } from "@spree/sdk";
import { getClient, getLocaleOptions } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

async function cachedListMarkets(options: {
  locale?: string;
  country?: string;
}) {
  return getClient().markets.list(options);
}

async function cachedResolveMarket(
  country: string,
  options: { locale?: string; country?: string },
) {
  return getClient().markets.resolve(country, options);
}

async function cachedListMarketCountries(
  marketId: string,
  options: { locale?: string; country?: string },
) {
  return getClient().markets.countries.list(marketId, options);
}

export async function getMarkets(options?: {
  locale?: string;
  country?: string;
}): Promise<{ data: Market[] }> {
  if (!isSpreeConfigured()) return { data: [] };

  try {
    const resolvedOptions = options ?? (await getLocaleOptions());
    return await cachedListMarkets(resolvedOptions);
  } catch (error) {
    console.error("getMarkets: failed to fetch from API", error);
    return { data: [] };
  }
}

export async function resolveMarket(country: string) {
  if (!isSpreeConfigured()) return undefined;

  try {
    const options = await getLocaleOptions();
    return await cachedResolveMarket(country, options);
  } catch (error) {
    console.error("resolveMarket: failed to fetch from API", error);
    return undefined;
  }
}

export async function getMarketCountries(marketId: string) {
  if (!isSpreeConfigured()) return { data: [] };

  try {
    const options = await getLocaleOptions();
    return await cachedListMarketCountries(marketId, options);
  } catch (error) {
    console.error("getMarketCountries: failed to fetch from API", error);
    return { data: [] };
  }
}

/**
 * Resolve the currency for a given country on the server side, using the
 * cached markets list. Returns undefined if the country is not served by
 * any market or when market data is unavailable during static rendering.
 */
export async function resolveCurrency(
  country: string,
): Promise<string | undefined> {
  let markets: Market[];

  try {
    ({ data: markets } = await getMarkets());
  } catch (error) {
    console.error("resolveCurrency: failed to load markets", error);
    return undefined;
  }

  const iso = country.toLowerCase();
  for (const market of markets) {
    const match = market.countries?.some((c) => c.iso.toLowerCase() === iso);
    if (match) return market.currency;
  }
  return undefined;
}
