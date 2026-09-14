import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { hashPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, phone } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const db = await readDB();
  const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user = {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    passwordHash: hashPassword(password),
    addresses: [],
    createdAt: new Date().toISOString(),
  };

  await updateDB((d) => {
    d.users.push(user);
  });

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
