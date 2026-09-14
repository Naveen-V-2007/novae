import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

function getSessionEmail(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token)?.email ?? null;
}

export async function GET(req: NextRequest) {
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const db = await readDB();
  const user = db.users.find((u) => u.email === email);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}

export async function POST(req: NextRequest) {
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const address = await req.json();
  const newAddress = { ...address, id: `addr-${Date.now()}` };

  const db = await updateDB((d) => {
    const user = d.users.find((u) => u.email === email);
    if (user) user.addresses.push(newAddress);
  });

  const user = db.users.find((u) => u.email === email);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}
