"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import { formatINR } from "@/lib/constants";
import { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["placed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  return (
    <AdminGate>
      <OrdersManager />
    </AdminGate>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="container-novae py-10">
      <h1 className="font-heading text-3xl">ADMIN DASHBOARD</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <p className="eyebrow mt-8">Orders ({orders.length})</p>
      <p className="mt-1 text-[12px] text-ink/45">Click an order to see the full address and items.</p>

      <div className="mt-4 border border-ink/10">
        {loading && <p className="p-5 text-ink/50">Loading…</p>}
        {!loading && orders.length === 0 && <p className="p-5 text-ink/50">No orders yet.</p>}
        {orders.map((o) => {
          const isOpen = expanded === o.id;
          return (
            <div key={o.id} className="border-b border-ink/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : o.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left hover:bg-ink/[0.02]"
              >
                <div>
                  <p className="text-[13px]">
                    <span className="mr-2 inline-block text-ink/40">{isOpen ? "▾" : "▸"}</span>#{o.id}
                  </p>
                  <p className="text-[12px] text-ink/50">
                    {o.userEmail} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[13px]">{formatINR(o.total)}</span>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="border border-ink/25 px-2 py-1.5 text-[12px] uppercase"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </button>

              {isOpen && (
                <div className="grid gap-8 border-t border-ink/10 bg-ink/[0.015] p-5 md:grid-cols-2">
                  <div>
                    <p className="eyebrow mb-3">Shipping Address</p>
                    <p className="text-[14px]">
                      {o.address.firstName} {o.address.lastName}
                    </p>
                    <p className="text-[13px] text-ink/70">
                      {o.address.address}
                      {o.address.apartment ? `, ${o.address.apartment}` : ""}
                    </p>
                    <p className="text-[13px] text-ink/70">
                      {o.address.city}, {o.address.state} {o.address.pin}
                    </p>
                    <p className="text-[13px] text-ink/70">{o.address.phone}</p>

                    <p className="eyebrow mb-1 mt-5">Payment</p>
                    <p className="text-[13px] uppercase text-ink/70">{o.paymentMethod}</p>
                  </div>

                  <div>
                    <p className="eyebrow mb-3">Items</p>
                    <ul className="flex flex-col gap-3">
                      {o.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-grey">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px]">{item.name}</p>
                            <p className="text-[12px] text-ink/50">
                              {item.colour} · {item.size} · x{item.quantity}
                            </p>
                          </div>
                          <p className="text-[13px]">{formatINR(item.price * item.quantity)}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-col gap-1 border-t border-ink/10 pt-4 text-[13px]">
                      <div className="flex justify-between text-ink/60">
                        <span>Subtotal</span>
                        <span>{formatINR(o.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-ink/60">
                        <span>Shipping</span>
                        <span>{o.shipping === 0 ? "FREE" : formatINR(o.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span>Total</span>
                        <span>{formatINR(o.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
