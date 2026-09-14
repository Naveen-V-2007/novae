import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const db = await readDB();
  const product = db.products.find((p) => p.slug === params.slug);
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  const updates = await req.json();
  const db = await updateDB((d) => {
    const idx = d.products.findIndex((p) => p.slug === params.slug);
    if (idx >= 0) d.products[idx] = { ...d.products[idx], ...updates };
  });

  const product = db.products.find((p) => p.slug === params.slug);
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  await updateDB((d) => {
    d.products = d.products.filter((p) => p.slug !== params.slug);
  });

  return NextResponse.json({ ok: true });
}
