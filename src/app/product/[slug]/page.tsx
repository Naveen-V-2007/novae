import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProductDetails } from "@/lib/catalog";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: `${product.name} — NOVAÉ`, description: product.description };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const details = getProductDetails(product.slug);

  return <ProductDetailClient product={product} details={details} related={related} />;
}
