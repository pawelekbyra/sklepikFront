import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Manual escape hatch for the product-list "use cache" entries
 * (`cacheLife('tenMinutes')`, tag `products`/`product-filters` in
 * `src/lib/data/products.ts`). Lets an operator force a refresh after an
 * admin-side catalog change instead of waiting out the cache life.
 *
 * Longer term this should be triggered automatically by a Spree webhook
 * (`product.updated`/`product.created`/`product.deleted`) the same way
 * `/api/webhooks/spree` already handles order events, rather than requiring
 * a manual call.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Revalidate endpoint not configured" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("products", "tenMinutes");
  revalidateTag("product-filters", "tenMinutes");

  return NextResponse.json({
    revalidated: true,
    tags: ["products", "product-filters"],
  });
}
