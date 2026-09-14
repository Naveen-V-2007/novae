import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ user: null });

  const db = await readDB();
  const user = db.users.find((u) => u.email === session.email);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    },
  });
}
