import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  const db = await readDB();
  const coupon = db.coupons.find(
    (c) => c.code.toLowerCase() === (code || "").toLowerCase() && c.active
  );

  if (!coupon) {
    return NextResponse.json({ error: "Invalid or expired coupon." }, { status: 404 });
  }

  const discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  return NextResponse.json({ coupon, discount: Math.min(discount, subtotal) });
}
