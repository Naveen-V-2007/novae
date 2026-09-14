import { NextRequest, NextResponse } from "next/server";
import { updateDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json();
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  await updateDB((d) => {
    d.contactMessages.push({
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ ok: true });
}
