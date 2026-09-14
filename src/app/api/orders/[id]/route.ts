import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE, ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await readDB();
  const order = db.orders.find((o) => o.id === params.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const email = verifySessionToken(token)?.email;
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";

  if (!isAdmin && order.userEmail !== email) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  const { status } = await req.json();
  const db = await updateDB((d) => {
    const order = d.orders.find((o) => o.id === params.id);
    if (order) order.status = status;
  });

  const order = db.orders.find((o) => o.id === params.id);
  return NextResponse.json({ order });
}
