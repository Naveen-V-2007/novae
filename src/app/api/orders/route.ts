import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/constants";
import { Order, OrderItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const email = verifySessionToken(token)?.email;
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const db = await readDB();
  const orders = db.orders
    .filter((o) => o.userEmail === email)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const email = verifySessionToken(token)?.email ?? null;

  const body = await req.json();
  const { items, address, paymentMethod, guestEmail } = body as {
    items: OrderItem[];
    address: Order["address"];
    paymentMethod: Order["paymentMethod"];
    guestEmail?: string;
  };

  if (!items?.length || !address || !paymentMethod) {
    return NextResponse.json({ error: "Missing order details." }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  const order: Order = {
    id: `NV${Date.now().toString().slice(-8)}`,
    userEmail: email ?? guestEmail ?? "guest@novae.in",
    items,
    subtotal,
    shipping,
    total,
    status: "placed",
    address,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  await updateDB((d) => {
    d.orders.push(order);
    // Simulated payment capture + inventory decrement.
    order.items.forEach((item) => {
      const product = d.products.find((p) => p.id === item.productId);
      const stock = product?.inventory.find(
        (v) => v.colour === item.colour && v.size === item.size
      );
      if (stock) stock.inventory = Math.max(0, stock.inventory - item.quantity);
    });
  });

  return NextResponse.json({ order });
}
