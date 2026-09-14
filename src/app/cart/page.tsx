"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatINR, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "applied" | "error">("idle");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 149;
  const total = Math.max(0, subtotal - discount) + shipping;

  async function applyCoupon() {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDiscount(data.discount);
      setCouponStatus("applied");
    } catch {
      setDiscount(0);
      setCouponStatus("error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-novae flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="font-heading text-3xl">YOUR BAG IS EMPTY.</h1>
        <p className="mt-3 text-ink/60">Explore the new-in edit to start building your bag.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop New In
        </Link>
      </div>
    );
  }

  return (
    <div className="container-novae py-12 md:py-16">
      <h1 className="mb-10 font-heading text-3xl md:text-4xl">YOUR BAG</h1>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-ink/10">
            {items.map((item) => (
              <li key={`${item.productId}-${item.colour}-${item.size}`} className="flex gap-5 py-6">
                <Link href={`/product/${item.slug}`} className="relative h-36 w-28 shrink-0 overflow-hidden bg-grey">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-[15px] tracking-wide hover:text-clay">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[13px] text-ink/55">
                        {item.colour} · {item.size}
                      </p>
                    </div>
                    <p className="text-[15px]">{formatINR(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-ink/20">
                      <button
                        className="px-3 py-1.5"
                        onClick={() => updateQuantity(item.productId, item.colour, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-3 text-[13px]">{item.quantity}</span>
                      <button
                        className="px-3 py-1.5"
                        onClick={() => updateQuantity(item.productId, item.colour, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-[12px] tracking-wide text-ink/50 hover:text-clay"
                      onClick={() => removeItem(item.productId, item.colour, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit border border-ink/10 p-6">
          <p className="eyebrow mb-5">Order Summary</p>

          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="COUPON CODE"
              className="input-field flex-1 text-[12px]"
            />
            <button onClick={applyCoupon} className="btn-outline px-4 text-[11px]">
              Apply
            </button>
          </div>
          {couponStatus === "applied" && (
            <p className="mt-2 text-[12px] text-olive">Coupon applied — {formatINR(discount)} off.</p>
          )}
          {couponStatus === "error" && (
            <p className="mt-2 text-[12px] text-clay">Invalid or expired coupon.</p>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6 text-[14px]">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-ink/60">Discount</span>
                <span>−{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink/60">Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink/10 pt-3 text-[16px]">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary mt-6 block w-full text-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
