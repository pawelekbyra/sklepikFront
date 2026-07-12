"use client";

import type { Product } from "@spree/sdk";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { trackSelectItem } from "@/lib/analytics/gtm";

interface ProductCardProps {
  product: Product;
  basePath?: string;
  categoryId?: string;
  index?: number;
  listId?: string;
  listName?: string;
  fetchPriority?: "high" | "low" | "auto";
  /** Optional currency used for analytics; omit to skip the select_item event. */
  currency?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  basePath = "",
  categoryId,
  index,
  listId,
  listName,
  fetchPriority,
  currency,
}: ProductCardProps) {
  const t = useTranslations("products");
  const imageUrl = product.thumbnail_url || null;

  // Current display price
  const displayPrice = product.price?.display_amount;

  const currentAmountCents = product.price?.amount_in_cents;
  const originalAmountCents = product.original_price?.amount_in_cents;
  const compareAtAmountCents = product.price?.compare_at_amount_in_cents;
  const onSale =
    (currentAmountCents != null &&
      originalAmountCents != null &&
      currentAmountCents < originalAmountCents) ||
    (compareAtAmountCents != null &&
      currentAmountCents != null &&
      currentAmountCents < compareAtAmountCents);

  const strikethroughPrice = onSale
    ? ((product.original_price?.display_amount &&
      product.original_price.display_amount !== displayPrice
        ? product.original_price.display_amount
        : product.price?.display_compare_at_amount) ?? null)
    : null;

  const handleClick = () => {
    if (index != null && listId && listName && currency) {
      trackSelectItem(product, listId, listName, index, currency);
    }
  };

  return (
    <Link
      href={`${basePath}/products/${product.slug}${categoryId ? `?category_id=${categoryId}` : ""}`}
      className="group block h-full"
      onClick={handleClick}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#3b2415]/10 bg-[#fffaf0] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d95d00]/35 hover:shadow-2xl hover:shadow-[#9c4f00]/15">
        <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_35%_20%,#ffe7a3_0,transparent_32%),linear-gradient(135deg,#fff1bf,#f3a63b)]">
          <div className="absolute inset-3 rounded-[1.5rem] border border-white/50" />
          <ProductImage
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 300px"
            iconClassName="w-16 h-16 text-[#7a3412]"
            fetchPriority={fetchPriority}
          />
          <div className="absolute left-3 top-3 rounded-full bg-[#26180f]/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd166] backdrop-blur">
            HEJKARTA
          </div>
          {onSale && (
            <span className="absolute right-3 top-3 rounded-full bg-[#d95d00] px-3 py-1 text-xs font-black text-white shadow-lg">
              {t("sale")}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 h-px w-full bg-gradient-to-r from-[#d95d00]/35 via-[#3b2415]/10 to-transparent" />
          <h3 className="text-base font-black leading-6 tracking-[-0.03em] text-[#26180f] transition-colors group-hover:text-[#b94c00] sm:text-lg">
            {product.name}
          </h3>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-2">
              {displayPrice && (
                <span className="text-2xl font-black tracking-[-0.04em] text-[#26180f]">
                  {displayPrice}
                </span>
              )}
              {onSale && strikethroughPrice && (
                <span className="text-sm font-semibold text-[#8c6b56] line-through">
                  {strikethroughPrice}
                </span>
              )}
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#26180f] text-[#ffd166] transition group-hover:rotate-12 group-hover:bg-[#d95d00] group-hover:text-white">
              <ArrowUpRight className="size-5" />
            </span>
          </div>

          {!product.purchasable && (
            <span className="mt-4 inline-flex w-fit rounded-full bg-[#3b2415]/10 px-3 py-1 text-sm font-semibold text-[#6b4428]">
              {t("outOfStock")}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
});
