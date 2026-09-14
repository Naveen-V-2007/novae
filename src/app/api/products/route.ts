import { NextRequest, NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { ADMIN_COOKIE } from "@/lib/auth";
import { Product } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // women | men
  const collection = searchParams.get("collection");
  const colour = searchParams.get("colour");
  const size = searchParams.get("size");
  const q = searchParams.get("q")?.toLowerCase();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const tag = searchParams.get("tag"); // e.g. new-in, best-seller
  const sort = searchParams.get("sort"); // newest | price-asc | price-desc | recommended

  const db = await readDB();
  let list: Product[] = db.products;

  if (category) list = list.filter((p) => p.category === category);
  if (collection) list = list.filter((p) => p.collection === collection);
  if (colour) list = list.filter((p) => p.colours.some((c) => c.toLowerCase() === colour.toLowerCase()));
  if (size) list = list.filter((p) => p.sizes.includes(size));
  if (tag) list = list.filter((p) => p.tags.includes(tag));
  if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  if (sort === "newest") list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  return NextResponse.json({ products: list, count: list.length });
}

export async function POST(req: NextRequest) {
  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === "true";
  if (!isAdmin) return NextResponse.json({ error: "Admin only." }, { status: 403 });

  const body = await req.json();
  const product: Product = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    inventory: [],
    rating: 0,
    reviews: 0,
    tags: [],
    ...body,
  };

  await updateDB((d) => {
    d.products.unshift(product);
  });

  return NextResponse.json({ product }, { status: 201 });
}
