"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatINR } from "@/lib/constants";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  function moveToCart(item: (typeof items)[number]) {
    const product = products.find((p) => p.id === item.id);
    const size = product?.sizes[2] ?? product?.sizes[0] ?? "M";
    addItem({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      colour: item.colour,
      size,
      quantity: 1,
    });
    remove(item.id);
  }

  if (items.length === 0) {
    return (
      <div className="container-novae flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="font-heading text-3xl">YOUR WISHLIST IS EMPTY.</h1>
        <p className="mt-3 text-ink/60">Save pieces you love to come back to them later.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-novae py-12 md:py-16">
      <h1 className="mb-10 font-heading text-3xl md:text-4xl">WISHLIST</h1>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.id}>
            <Link href={`/product/${item.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-grey">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </Link>
            <p className="mt-3 text-[13px] tracking-wide">{item.name}</p>
            <p className="text-[13px] text-ink/55">{item.colour}</p>
            <p className="mt-1 text-[13px]">{formatINR(item.price)}</p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => moveToCart(item)} className="btn-outline flex-1 px-3 py-2 text-[11px]">
                Add to Bag
              </button>
              <button
                onClick={() => remove(item.id)}
                aria-label="Remove from wishlist"
                className="border border-ink/20 px-3 py-2 text-[11px] hover:border-clay hover:text-clay"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
