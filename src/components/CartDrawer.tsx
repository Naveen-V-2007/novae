"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone shadow-xl transition-transform duration-400 ease-novae ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <p className="eyebrow">Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})</p>
          <button onClick={closeDrawer} aria-label="Close cart" className="text-xl leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-ink/60">Your bag is empty.</p>
              <Link href="/shop" onClick={closeDrawer} className="btn-outline mt-6">
                Shop New In
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.colour}-${item.size}`} className="flex gap-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-grey">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[13px] tracking-wide">{item.name}</p>
                      <p className="text-[12px] text-ink/55">
                        {item.colour} · {item.size}
                      </p>
                      <p className="mt-1 text-[13px]">{formatINR(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-ink/20">
                        <button
                          className="px-2.5 py-1"
                          onClick={() =>
                            updateQuantity(item.productId, item.colour, item.size, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="px-2 text-[13px]">{item.quantity}</span>
                        <button
                          className="px-2.5 py-1"
                          onClick={() =>
                            updateQuantity(item.productId, item.colour, item.size, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-[11px] tracking-wide text-ink/50 hover:text-clay"
                        onClick={() => removeItem(item.productId, item.colour, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-6">
            <p className="text-[12px] text-ink/55">
              {subtotal >= FREE_SHIPPING_THRESHOLD
                ? "You've unlocked free shipping."
                : `Add ${formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`}
            </p>
            <div className="mt-3 flex items-center justify-between text-[15px]">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="btn-primary mt-5 block w-full text-center"
            >
              View Bag &amp; Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
