import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  const db = await readDB();
  const revenue = db.orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = db.products.filter((p) =>
    p.inventory.some((v) => v.inventory <= 5)
  ).length;

  return NextResponse.json({
    stats: {
      totalRevenue: revenue,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      totalCustomers: db.users.length,
      lowStock,
    },
    recentOrders: [...db.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8),
  });
}
