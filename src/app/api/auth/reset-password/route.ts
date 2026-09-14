import { NextRequest, NextResponse } from "next/server";
import { updateDB, readDB } from "@/lib/db";
import { hashPassword, hashResetToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();
  if (!email || !token || !password) {
    return NextResponse.json({ error: "Missing reset details." }, { status: 400 });
  }

  const db = await readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.resetTokenHash || !user.resetTokenExpiresAt) {
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }

  const isExpired = new Date(user.resetTokenExpiresAt).getTime() < Date.now();
  const tokenMatches = user.resetTokenHash === hashResetToken(token);

  if (isExpired || !tokenMatches) {
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }

  await updateDB((d) => {
    const u = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (u) {
      u.passwordHash = hashPassword(password);
      delete u.resetTokenHash;
      delete u.resetTokenExpiresAt;
    }
  });

  return NextResponse.json({ ok: true });
}
