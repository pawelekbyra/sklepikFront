import type { Product } from "@spree/sdk";
import type { WebhookEvent } from "@spree/sdk/webhooks";
import { revalidatePath, revalidateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { handleProductChanged } from "@/lib/webhooks/handlers";

function makeEvent(slug: string): WebhookEvent<Product> {
  return {
    id: "evt_1",
    name: "product.updated",
    created_at: new Date().toISOString(),
    data: { slug } as Product,
    metadata: { spree_version: "1.0" },
  };
}

describe("handleProductChanged", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("busts the products list, filters, and per-product cache tags", async () => {
    await handleProductChanged(makeEvent("kakao-70"));

    expect(revalidateTag).toHaveBeenCalledWith("products", "max");
    expect(revalidateTag).toHaveBeenCalledWith("product-filters", "max");
    expect(revalidateTag).toHaveBeenCalledWith("product:kakao-70", "max");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("still busts the list-level tags when the payload has no slug", async () => {
    await handleProductChanged(makeEvent(""));

    expect(revalidateTag).toHaveBeenCalledWith("products", "max");
    expect(revalidateTag).toHaveBeenCalledWith("product-filters", "max");
    expect(revalidateTag).not.toHaveBeenCalledWith(
      expect.stringMatching(/^product:/),
      "max",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
