"use server";

import type {
  PaginatedResponse,
  Product,
  ProductFiltersResponse,
  ProductListParams,
} from "@spree/sdk";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

function emptyProductListResponse(): PaginatedResponse<Product> {
  return {
    data: [],
    meta: {
      count: 0,
      pages: 0,
      page: 1,
      limit: 0,
      from: 0,
      to: 0,
      total_count: 0,
      in: 0,
      previous: null,
      next: null,
    },
  } as unknown as PaginatedResponse<Product>;
}

function emptyProductFiltersResponse(): ProductFiltersResponse {
  return {
    data: [],
    filters: [],
    sort_options: [],
    default_sort: null,
    total_count: 0,
  } as unknown as ProductFiltersResponse;
}

/**
 * Cached product list fetch. Cache key is derived from all function
 * arguments by Next.js "use cache":
 *
 * - locale/country: determines language and market-specific pricing
 * - userToken: per-user cache segmentation (separate arg, NOT passed to
 *   SDK). Authenticated users may see different prices (B2B, loyalty).
 *   Each user's JWT is unique so the cache is segmented per user.
 *   Guest users pass undefined.
 */
export async function cachedListProducts(
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
  _userToken?: string,
) {
  cacheTag("products");
  return getClient().products.list(params, options);
}

export async function getProducts(params?: ProductListParams) {
  if (!isSpreeConfigured()) return emptyProductListResponse();

  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedListProducts(params, options, userToken);
  } catch (error) {
    console.error("getProducts: failed to fetch from API", error);
    return emptyProductListResponse();
  }
}

/**
 * Persistent cached product detail fetch. Cache key is derived from:
 *
 * - slugOrId, expand: identify the product and response shape
 * - locale/country: determines language and market-specific pricing
 * - userToken: per-user cache segmentation (separate arg, NOT passed to
 *   SDK). Authenticated users may see different prices (B2B, loyalty).
 *   Guest users pass undefined, so all guests share one entry.
 */
export async function cachedGetProduct(
  slugOrId: string,
  expand: string[],
  options: { locale?: string; country?: string },
  _userToken?: string,
) {
  cacheTag("products", `product:${slugOrId}`);
  return getClient().products.get(slugOrId, { expand }, options);
}

export async function getProduct(
  slugOrId: string,
  params?: { expand?: string[] },
) {
  if (!isSpreeConfigured()) return undefined;

  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedGetProduct(
      slugOrId,
      params?.expand ?? [],
      options,
      userToken,
    );
  } catch (error) {
    console.error("getProduct: failed to fetch from API", error);
    return undefined;
  }
}

async function cachedGetProductFilters(
  params: Record<string, unknown> | undefined,
  options: { locale?: string; country?: string },
  _userToken?: string,
) {
  cacheTag("product-filters");
  return getClient().products.filters(params, options);
}

export async function getProductFilters(params?: Record<string, unknown>) {
  if (!isSpreeConfigured()) return emptyProductFiltersResponse();

  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedGetProductFilters(params, options, userToken);
  } catch (error) {
    console.error("getProductFilters: failed to fetch from API", error);
    return emptyProductFiltersResponse();
  }
}
