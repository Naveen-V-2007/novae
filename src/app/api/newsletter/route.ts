import { NextRequest, NextResponse } from "next/server";
import { updateDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  await updateDB((d) => {
    if (!d.newsletter.includes(email)) d.newsletter.push(email);
  });

  return NextResponse.json({ ok: true });
}
