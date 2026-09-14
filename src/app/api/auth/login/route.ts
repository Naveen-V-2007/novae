import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const db = await readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = createSessionToken({ email: user.email });
  const res = NextResponse.json({
    user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
