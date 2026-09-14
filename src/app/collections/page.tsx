import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/collections";

export const metadata = { title: "Collections — NOVAÉ" };

export default function CollectionsPage() {
  return (
    <div>
      <div className="container-novae py-14 text-center">
        <h1 className="font-heading text-4xl md:text-5xl">COLLECTIONS</h1>
      </div>
      <div className="flex flex-col">
        {collections.map((c, i) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className={`group grid md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 ease-novae group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center bg-bone px-6 py-14 md:px-16">
              <h2 className="font-heading text-3xl md:text-5xl">{c.name}</h2>
              <p className="mt-4 max-w-[36ch] text-ink/60">{c.description}</p>
              <span className="link-underline mt-7 w-fit text-[12px] tracking-widest2 uppercase">
                Explore Collection
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
