import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  return NextResponse.json({ isAdmin });
}
