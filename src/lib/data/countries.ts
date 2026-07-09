"use server";

import { getClient, getLocaleOptions } from "@/lib/spree";

export async function getCountries() {
  const options = await getLocaleOptions();
  return getClient().countries.list(options);
}

async function cachedGetCountry(
  iso: string,
  options: { locale?: string; country?: string },
) {
  cacheTag("country", `country-${iso}`);
  return getClient().countries.get(iso, { expand: ["states"] }, options);
}

export async function getCountry(iso: string) {
  const options = await getLocaleOptions();
  return cachedGetCountry(iso, options);
}
