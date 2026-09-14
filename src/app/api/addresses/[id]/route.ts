import { NextRequest, NextResponse } from "next/server";
import { updateDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

function getEmail(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token)?.email ?? null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const email = getEmail(req);
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const db = await updateDB((d) => {
    const user = d.users.find((u) => u.email === email);
    if (user) {
      user.addresses = (user.addresses ?? []).filter((a) => a.id !== params.id);
    }
  });

  const user = db.users.find((u) => u.email === email);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}
