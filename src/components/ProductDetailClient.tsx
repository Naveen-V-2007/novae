"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR, FREE_SHIPPING_THRESHOLD, DELIVERY_ESTIMATE, RETURNS_WINDOW } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailClient({
  product,
  details,
  related,
}: {
  product: Product;
  details: string[];
  related: Product[];
}) {
  const { addItem, openDrawer } = useCart();
  const { toggle, isSaved } = useWishlist();
  const [colour, setColour] = useState(product.colours[0]);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<"description" | "shipping" | "returns">("description");
  const [sizeError, setSizeError] = useState(false);

  const stock = useMemo(
    () => product.inventory.find((v) => v.colour === colour && v.size === size),
    [product, colour, size]
  );

  function handleAddToBag() {
    if (!size) {
      setSizeError(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      colour,
      size,
      quantity,
    });
  }

  function handleBuyNow() {
    if (!size) {
      setSizeError(true);
      return;
    }
    handleAddToBag();
    openDrawer();
  }

  return (
    <div className="container-novae py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-grey">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-16 overflow-hidden bg-grey ${
                  activeImage === i ? "ring-1 ring-ink" : ""
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{product.category === "women" ? "Women" : "Men"}</p>
          <h1 className="mt-2 font-heading text-2xl md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-ink/60">
            <span>{"★".repeat(Math.round(product.rating))}</span>
            <span>{product.rating.toFixed(1)}</span>
            <span>· {product.reviews} reviews</span>
          </div>
          <p className="mt-4 text-xl">{formatINR(product.price)}</p>

          {/* Colour */}
          <div className="mt-7">
            <p className="label-field">Colour: {colour}</p>
            <div className="flex flex-wrap gap-2">
              {product.colours.map((c) => (
                <button
                  key={c}
                  onClick={() => setColour(c)}
                  className={`border px-4 py-2 text-[12px] uppercase tracking-wide transition-colors ${
                    colour === c ? "border-ink bg-ink text-bone" : "border-ink/25 hover:border-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="label-field mb-0">Size</p>
              <Link href="/size-guide" className="link-underline text-[11px] tracking-wide uppercase text-ink/60">
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const variant = product.inventory.find((v) => v.colour === colour && v.size === s);
                const outOfStock = variant && variant.inventory === 0;
                return (
                  <button
                    key={s}
                    disabled={outOfStock}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    className={`h-11 w-11 border text-[13px] transition-colors ${
                      size === s ? "border-ink bg-ink text-bone" : "border-ink/25 hover:border-ink"
                    } ${outOfStock ? "cursor-not-allowed opacity-30 line-through" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {sizeError && <p className="mt-2 text-[12px] text-clay">Please select a size.</p>}
            {stock && stock.inventory > 0 && stock.inventory <= 5 && (
              <p className="mt-2 text-[12px] text-clay">Only {stock.inventory} left in stock.</p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="label-field">Quantity</p>
            <div className="flex w-fit items-center border border-ink/25">
              <button className="px-4 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center text-[14px]">{quantity}</span>
              <button className="px-4 py-2" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button onClick={handleAddToBag} className="btn-primary flex-1">
              Add to Bag
            </button>
            <button onClick={handleBuyNow} className="btn-outline flex-1">
              Buy Now
            </button>
            <button
              onClick={() => toggle(product)}
              aria-label="Save to wishlist"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-ink/25 hover:border-ink"
            >
              <svg width="17" height="17" viewBox="0 0 19 19" fill={isSaved(product.id) ? "currentColor" : "none"}>
                <path
                  d="M9.5 16.2S2 12 2 6.9C2 4.5 3.9 3 5.9 3c1.5 0 2.9.8 3.6 2.1C10.2 3.8 11.6 3 13.1 3c2 0 3.9 1.5 3.9 3.9 0 5.1-7.5 9.3-7.5 9.3z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t border-ink/10">
            <div className="flex gap-6 border-b border-ink/10">
              {(["description", "shipping", "returns"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-4 text-[12px] tracking-widest2 uppercase ${
                    tab === t ? "border-b border-ink text-ink" : "text-ink/45"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-5 text-[14px] leading-relaxed text-ink/70">
              {tab === "description" && (
                <div>
                  <p>{product.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {details.map((d) => (
                      <li key={d} className="flex gap-2">
                        <span>—</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tab === "shipping" && (
                <p>
                  Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}. Estimated
                  delivery: {DELIVERY_ESTIMATE}.
                </p>
              )}
              {tab === "returns" && <p>Easy returns within {RETURNS_WINDOW} of delivery.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-heading text-2xl md:text-3xl">YOU MAY ALSO LIKE</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
