"use client";

import type { Media, Product, Variant } from "@spree/sdk";
import { CircleCheckBig, CircleX, Loader2, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { MediaGallery } from "@/components/products/MediaGallery";
import { ProductCustomFields } from "@/components/products/ProductCustomFields";
import { VariantPicker } from "@/components/products/VariantPicker";
import { Button } from "@/components/ui/button";
import { QuantityPicker } from "@/components/ui/quantity-picker";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { trackAddToCart, trackViewItem } from "@/lib/analytics/gtm";

interface ProductDetailsProps {
  product: Product;
  basePath: string;
}

export function ProductDetails({ product, basePath }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { currency } = useStore();
  const t = useTranslations("products");

  // Filter variants list
  const variants = useMemo(() => {
    return (product.variants || []).filter(Boolean);
  }, [product.variants]);

  const hasVariants = variants.length > 0;
  const optionTypes = product.option_types || [];

  // Initialize with default variant or first available variant
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(() => {
    if (product.default_variant) {
      return product.default_variant;
    }
    if (hasVariants) {
      return variants.find((v) => v.purchasable) || variants[0];
    }
    // For products without variants, use default variant
    return product.default_variant || null;
  });

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Track product view (analytics - client-only side effect)
  useEffect(() => {
    trackViewItem(product, currency);
  }, [product, currency]);

  const galleryImages = useMemo((): Media[] => {
    return product.media || [];
  }, [product.media]);

  const variantImageIndex = useMemo((): number | null => {
    if (!selectedVariant) return null;
    const index = galleryImages.findIndex((m) =>
      m.variant_ids.includes(selectedVariant.id),
    );
    return index >= 0 ? index : null;
  }, [selectedVariant, galleryImages]);

  const price = selectedVariant?.price ?? product.price;
  const originalPrice =
    selectedVariant?.original_price ?? product.original_price;
  const displayPrice = price?.display_amount;

  const currentAmountCents = price?.amount_in_cents;
  const originalAmountCents = originalPrice?.amount_in_cents;
  const compareAtAmountCents = price?.compare_at_amount_in_cents;
  const onSale =
    (currentAmountCents != null &&
      originalAmountCents != null &&
      currentAmountCents < originalAmountCents) ||
    (compareAtAmountCents != null &&
      currentAmountCents != null &&
      currentAmountCents < compareAtAmountCents);

  const strikethroughPrice = onSale
    ? ((originalPrice?.display_amount &&
      originalPrice.display_amount !== displayPrice
        ? originalPrice.display_amount
        : price?.display_compare_at_amount) ?? null)
    : null;

  // Purchasability
  const isPurchasable = hasVariants
    ? (selectedVariant?.purchasable ?? false)
    : (product.purchasable ?? false);

  const inStock = hasVariants
    ? (selectedVariant?.in_stock ?? false)
    : (product.in_stock ?? false);

  const handleAddToCart = async () => {
    const variantId =
      selectedVariant?.id ||
      product.default_variant?.id ||
      product.default_variant_id;
    if (!variantId) {
      throw new Error("No variant selected");
    }

    setLoading(true);
    await addItem(variantId, quantity);
    setLoading(false);
    trackAddToCart(product, selectedVariant, quantity, currency);
  };

  return (
    <div className="bg-[#fff7df] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 rounded-[2.5rem] border border-[#3b2415]/10 bg-white/60 p-4 shadow-2xl shadow-[#9c4f00]/10 backdrop-blur lg:grid-cols-2 lg:p-8">
        {/* Media Gallery */}
        <div>
          <MediaGallery
            images={galleryImages}
            productName={product.name}
            activeIndex={variantImageIndex}
          />
        </div>

        {/* Product Info */}
        <div className="rounded-[2rem] bg-[#fffaf0] p-6 lg:p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d95d00]">
            produkt Serowego Michała
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#26180f] sm:text-5xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-4">
            {displayPrice && (
              <span className="text-4xl font-black tracking-[-0.05em] text-[#26180f]">
                {displayPrice}
              </span>
            )}
            {onSale && strikethroughPrice && (
              <>
                <span className="text-xl font-semibold text-[#8c6b56] line-through">
                  {strikethroughPrice}
                </span>
                <span className="rounded-full bg-[#d95d00] px-3 py-1 text-sm font-black text-white">
                  {t("sale")}
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecf8df] px-3 py-1 font-semibold text-[#3f6d20]">
                <CircleCheckBig className="w-5 h-5" />
                {t("inStock")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffe2d7] px-3 py-1 font-semibold text-[#a63b14]">
                <CircleX className="w-5 h-5" />
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Variant Picker */}
          {hasVariants && optionTypes.length > 0 && (
            <div className="mt-8">
              <VariantPicker
                variants={variants}
                optionTypes={optionTypes}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8 rounded-[1.5rem] border border-[#3b2415]/10 bg-white/70 p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <QuantityPicker
                quantity={quantity}
                onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrement={() => setQuantity(quantity + 1)}
                size="lg"
              />

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={loading || !isPurchasable}
                className="rounded-full bg-[#26180f] px-7 text-white hover:bg-[#d95d00]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    {t("adding")}
                  </>
                ) : isPurchasable ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {t("addToCart")}
                  </>
                ) : (
                  t("outOfStock")
                )}
              </Button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-10 border-[#3b2415]/10 border-t pt-8">
              <h2 className="mb-4 text-lg font-black text-[#26180f]">
                {t("description")}
              </h2>
              {/* Description is admin-authored HTML from the Spree CMS backend (trusted source) */}
              <div
                className="prose prose-sm max-w-none text-[#6b4428]"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Custom Fields */}
          <ProductCustomFields customFields={product.custom_fields} />

          {/* Product Details */}
          <div className="mt-8 border-[#3b2415]/10 border-t pt-8">
            <h2 className="mb-4 text-lg font-black text-[#26180f]">
              {t("details")}
            </h2>
            <dl className="space-y-3">
              {selectedVariant?.sku && (
                <div className="flex">
                  <dt className="w-32 text-sm font-semibold text-[#8c6b56]">
                    {t("sku")}
                  </dt>
                  <dd className="text-sm font-semibold text-[#26180f]">
                    {selectedVariant.sku}
                  </dd>
                </div>
              )}
              {selectedVariant?.options_text && (
                <div className="flex">
                  <dt className="w-32 text-sm font-semibold text-[#8c6b56]">
                    {t("options")}
                  </dt>
                  <dd className="text-sm font-semibold text-[#26180f]">
                    {selectedVariant.options_text}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
