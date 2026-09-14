"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/constants";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { toggle, isSaved } = useWishlist();
  const { addItem } = useCart();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]);

  function handleQuickAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      colour: product.colours[0],
      size,
      quantity: 1,
    });
    setQuickAddOpen(false);
  }

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-grey">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 ease-novae group-hover:scale-[1.05]"
          />
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        <button
          aria-label="Save to wishlist"
          onClick={() => toggle(product)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-bone/90 text-ink transition-transform hover:scale-105"
        >
          <svg width="15" height="15" viewBox="0 0 19 19" fill={isSaved(product.id) ? "currentColor" : "none"}>
            <path
              d="M9.5 16.2S2 12 2 6.9C2 4.5 3.9 3 5.9 3c1.5 0 2.9.8 3.6 2.1C10.2 3.8 11.6 3 13.1 3c2 0 3.9 1.5 3.9 3.9 0 5.1-7.5 9.3-7.5 9.3z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>

        {product.tags.includes("new-in") && (
          <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[10px] tracking-widest2 uppercase text-bone">
            New
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-bone/95 p-3 transition-transform duration-300 ease-novae group-hover:translate-y-0 md:block">
          {quickAddOpen ? (
            <div className="flex items-center gap-2">
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="flex-1 border border-ink/30 bg-transparent px-2 py-2 text-[12px]"
              >
                {product.sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button onClick={handleQuickAdd} className="btn-primary px-4 py-2 text-[11px]">
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setQuickAddOpen(true)}
              className="w-full text-center text-[11px] tracking-widest2 uppercase hover:text-clay"
            >
              Quick Add
            </button>
          )}
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block">
        <p className="text-[13px] tracking-wide">{product.name}</p>
        <p className="text-[13px] text-ink/55">{product.colours[0]}</p>
        <p className="mt-1 text-[13px]">{formatINR(product.price)}</p>
      </Link>
    </div>
  );
}
