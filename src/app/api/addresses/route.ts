import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { Address } from "@/lib/types";

function getEmail(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token)?.email ?? null;
}

export async function GET(req: NextRequest) {
  const email = getEmail(req);
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const db = await readDB();
  const user = db.users.find((u) => u.email === email);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}

export async function POST(req: NextRequest) {
  const email = getEmail(req);
  if (!email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await req.json();
  const { label, firstName, lastName, address, apartment, city, state, pin, phone } = body;

  if (!firstName || !lastName || !address || !city || !state || !pin || !phone) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const newAddress: Address = {
    id: `addr_${Date.now()}`,
    label: label || "Home",
    firstName,
    lastName,
    address,
    apartment: apartment || undefined,
    city,
    state,
    pin,
    phone,
  };

  const db = await updateDB((d) => {
    const user = d.users.find((u) => u.email === email);
    if (user) {
      if (!user.addresses) user.addresses = [];
      user.addresses.push(newAddress);
    }
  });

  const user = db.users.find((u) => u.email === email);
  return NextResponse.json({ address: newAddress, addresses: user?.addresses ?? [] });
}
