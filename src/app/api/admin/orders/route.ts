import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  const db = await readDB();
  const orders = [...db.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ orders });
}
