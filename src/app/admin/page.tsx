"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import { formatINR } from "@/lib/constants";
import { Order } from "@/lib/types";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStock: number;
}

export default function AdminOverviewPage() {
  return (
    <AdminGate>
      <Overview />
    </AdminGate>
  );
}

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentOrders(d.recentOrders ?? []);
      });
  }, []);

  return (
    <div className="container-novae py-10">
      <h1 className="font-heading text-3xl">ADMIN DASHBOARD</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="Revenue" value={formatINR(stats.totalRevenue)} />
          <StatCard label="Orders" value={String(stats.totalOrders)} />
          <StatCard label="Products" value={String(stats.totalProducts)} />
          <StatCard label="Customers" value={String(stats.totalCustomers)} />
          <StatCard label="Low Stock" value={String(stats.lowStock)} accent={stats.lowStock > 0} />
        </div>
      )}

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">Recent Orders</p>
          <Link href="/admin/orders" className="link-underline text-[12px] tracking-widest2 uppercase">
            View All
          </Link>
        </div>
        <div className="border border-ink/10">
          {recentOrders.length === 0 && <p className="p-5 text-ink/50">No orders yet.</p>}
          {recentOrders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between border-b border-ink/10 p-4 text-[13px] last:border-b-0"
            >
              <span>#{o.id}</span>
              <span className="text-ink/60">{o.userEmail}</span>
              <span className="uppercase text-ink/60">{o.status}</span>
              <span>{formatINR(o.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? "border-clay" : "border-ink/10"}`}>
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 font-heading text-2xl ${accent ? "text-clay" : ""}`}>{value}</p>
    </div>
  );
}
