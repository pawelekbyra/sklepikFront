import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Manual escape hatch for the product-list "use cache" entries
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

  // profile the entry was cached under — passing the profile name back
  // (e.g. "tenMinutes") does NOT force an immediate bust, it just re-applies
  // that profile's own timing rules, which is why calling this with
  // "tenMinutes" silently did nothing.
  revalidateTag("products", "max");
  revalidateTag("product-filters", "max");

  // revalidateTag only busts the underlying data-fetch cache. The rendered
  // page HTML itself is cached separately (Full Route Cache / PPR shell) and
  // needs its own invalidation, or a stale page keeps serving even after the
  // data cache is cleared.
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    tags: ["products", "product-filters"],
    paths: ["/ (layout)"],
  });
}
