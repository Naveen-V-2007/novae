import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { generateResetToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
  }

  const db = await readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
  }

  const { token, hash, expiresAt } = generateResetToken();

  await updateDB((d) => {
    const u = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (u) {
      u.resetTokenHash = hash;
      u.resetTokenExpiresAt = expiresAt;
    }
  });

  const resetLink = `/account/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  return NextResponse.json({
    ok: true,
    devNote: "No email service is configured yet, so here's the reset link directly.",
    resetLink,
  });
}
