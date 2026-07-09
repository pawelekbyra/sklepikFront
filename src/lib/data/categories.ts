"use server";

import type {
  CategoryListParams,
  PaginatedResponse,
  Product,
  ProductListParams,
} from "@spree/sdk";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";
import { isSpreeConfigured } from "@/lib/spree/config";

async function cachedListCategories(
  params: CategoryListParams | undefined,
  options: { locale?: string; country?: string },
) {
  cacheTag("categories");
  return getClient().categories.list(params, options);
}

export async function getCategories(params?: CategoryListParams) {
  if (!isSpreeConfigured()) return { data: [] };

  try {
    const options = await getLocaleOptions();
    return await cachedListCategories(params, options);
  } catch (error) {
    console.error("getCategories: failed to fetch from API", error);
    return { data: [] };
  }
}

async function cachedGetCategory(
  idOrPermalink: string,
  params: { expand?: string[] } | undefined,
  options: { locale?: string; country?: string },
) {
  cacheTag("category");
  return getClient().categories.get(idOrPermalink, params, options);
}

export async function getCategory(
  idOrPermalink: string,
  params?: { expand?: string[] },
) {
  if (!isSpreeConfigured()) return undefined;

  try {
    const options = await getLocaleOptions();
    return await cachedGetCategory(idOrPermalink, params, options);
  } catch (error) {
    console.error("getCategory: failed to fetch from API", error);
    return undefined;
  }
}

function emptyCategoryProductsResponse(): PaginatedResponse<Product> {
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

/**
 * Persistent cached category products fetch. Cache key is derived from
 * all function arguments (categoryId, params, locale, country, userToken).
 * Guest users pass undefined so the cache entry is shared.
 */
async function cachedListCategoryProducts(
  categoryId: string,
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
  _userToken?: string,
) {
  cacheTag("products", `category-products:${categoryId}`);
  return getClient().products.list(
    { ...params, in_category: categoryId },
    options,
  );
}

export async function getCategoryProducts(
  categoryId: string,
  params?: ProductListParams,
): Promise<PaginatedResponse<Product>> {
  if (!isSpreeConfigured()) return emptyCategoryProductsResponse();

  try {
    const options = await getLocaleOptions();
    const userToken = await getAccessToken();
    return await cachedListCategoryProducts(
      categoryId,
      params,
      options,
      userToken,
    );
  } catch (error) {
    console.error("getCategoryProducts: failed to fetch from API", error);
    return emptyCategoryProductsResponse();
  }
}
