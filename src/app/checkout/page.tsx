"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/constants";

type PaymentMethod = "upi" | "card" | "netbanking";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: form.email,
          paymentMethod: payment,
          address: {
            id: "checkout",
            label: "Checkout address",
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            pin: form.pin,
            phone: form.phone,
          },
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            colour: i.colour,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      clearCart();
      router.push(`/account?order=${data.order.id}`);
    } catch (err: any) {
      setError(err.message ?? "Could not place order.");
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-novae flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="font-heading text-3xl">NOTHING TO CHECK OUT.</h1>
        <p className="mt-3 text-ink/60">Add something to your bag first.</p>
      </div>
    );
  }

  return (
    <div className="container-novae py-12 md:py-16">
      <h1 className="mb-10 font-heading text-3xl md:text-4xl">CHECKOUT</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-12 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <section>
            <p className="eyebrow mb-4">Customer Information</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} />
              <Field label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} full />
              <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} full />
            </div>
          </section>

          <section>
            <p className="eyebrow mb-4">Shipping Address</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address" value={form.address} onChange={(v) => update("address", v)} full />
              <Field
                label="Apartment / Building"
                value={form.apartment}
                onChange={(v) => update("apartment", v)}
                full
                required={false}
              />
              <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
              <Field label="State" value={form.state} onChange={(v) => update("state", v)} />
              <Field label="PIN Code" value={form.pin} onChange={(v) => update("pin", v)} />
            </div>
          </section>

          <section>
            <p className="eyebrow mb-4">Payment</p>
            <div className="grid grid-cols-3 gap-3">
              {(["upi", "card", "netbanking"] as PaymentMethod[]).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPayment(method)}
                  className={`border px-4 py-3 text-[12px] tracking-widest2 uppercase transition-colors ${
                    payment === method ? "border-ink bg-ink text-bone" : "border-ink/25 hover:border-ink"
                  }`}
                >
                  {method === "netbanking" ? "Net Banking" : method}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-ink/45">
              Test payment mode — no real transaction will be processed.
            </p>
          </section>

          {error && <p className="text-[13px] text-clay">{error}</p>}
        </div>

        <div className="h-fit border border-ink/10 p-6">
          <p className="eyebrow mb-5">Order Summary</p>
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={`${item.productId}-${item.colour}-${item.size}`} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-grey">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] text-bone">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px]">{item.name}</p>
                  <p className="text-[12px] text-ink/50">
                    {item.colour} · {item.size}
                  </p>
                </div>
                <p className="text-[13px]">{formatINR(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6 text-[14px]">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink/10 pt-3 text-[16px]">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <button type="submit" disabled={placing} className="btn-primary mt-6 block w-full text-center">
            {placing ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  full = false,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
  required?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="label-field">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </div>
  );
}
