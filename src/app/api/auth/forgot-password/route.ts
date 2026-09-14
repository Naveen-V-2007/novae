import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { generateResetToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/email";

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/account/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  try {
    await sendResetPasswordEmail(user.email, resetUrl);
  } catch (err) {
    console.error("Failed to send reset email:", err);
    return NextResponse.json({ error: "Couldn't send the reset email. Try again shortly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Check your email for a reset link." });
}
