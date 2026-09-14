import { readDB } from "./db";
import { productDetails as seedProductDetails } from "@/data/products";
import { Product } from "./types";

export async function getAllProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await readDB();
  return db.products.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const db = await readDB();
  return db.products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, count);
}

export function getProductDetails(slug: string): string[] {
  return seedProductDetails[slug] ?? [];
}
