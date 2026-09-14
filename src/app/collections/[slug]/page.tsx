import { notFound } from "next/navigation";
import Image from "next/image";
import { collections } from "@/data/collections";
import { getAllProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collections.find((c) => c.slug === params.slug);
  if (!collection) notFound();

  const allProducts = await getAllProducts();
  const items = allProducts.filter((p) => p.collection === collection.slug);

  return (
    <div>
      <div className="relative aspect-[16/7] w-full overflow-hidden">
        <Image src={collection.image} alt={collection.name} fill className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/25 text-center text-bone">
          <h1 className="font-heading text-4xl md:text-6xl">{collection.name}</h1>
          <p className="mt-3 text-[15px] text-bone/85">{collection.description}</p>
        </div>
      </div>
      <div className="container-novae py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
