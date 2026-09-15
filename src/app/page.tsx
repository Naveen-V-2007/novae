import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/catalog";
import { collections } from "@/data/collections";
import { journalArticles } from "@/data/journal";
import type { JournalArticle } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getAllProducts();
  const bestsellers = products.filter((p) => p.tags.includes("bestseller")).slice(0, 8);
  const newArrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-ink">
        <Image
          src="/images/hero/hero-main.png"
          alt="NOVAÉ — Everyday, Elevated"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="relative z-10 flex flex-col items-center text-center text-bone">
          <span className="eyebrow text-bone/70">Contemporary Indian Fashion</span>
          <h1 className="mt-4 font-heading text-5xl tracking-tight md:text-7xl">
            EVERYDAY, ELEVATED.
          </h1>
          <p className="mt-4 max-w-md text-[15px] text-bone/80">
            Minimal, versatile clothing designed for how you actually live — from
            desk to dinner, without missing a beat.
          </p>
          <Link href="/shop" className="btn-primary mt-8 border-bone text-bone hover:bg-bone hover:text-ink">
            Shop The Edit
          </Link>
        </div>
      </section>

      {/* Collections */}
      <section className="container-novae py-20">
        <SectionHeading title="Shop By Collection" description="Curated edits, made to move through your week." align="left" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/35" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-bone">
                <h3 className="font-heading text-2xl">{c.name}</h3>
                <span className="link-underline mt-2 inline-block text-[13px]">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-soft-grey/40 py-20">
        <div className="container-novae">
          <SectionHeading title="Bestsellers" description="Loved by you, worn on repeat." align="left" />
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="btn-secondary">
              View All Bestsellers
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-novae py-20">
          <SectionHeading title="New Arrivals" description="Just landed." align="left" />
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Journal preview */}
      <section className="bg-ink py-20 text-bone">
        <div className="container-novae">
          <h2 className="font-heading text-3xl leading-[1.1] md:text-4xl">Notes On Style</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4">
            {journalArticles.slice(0, 4).map((post: JournalArticle) => (
              <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-wider text-bone/50">
                  {post.category}
                </p>
                <h3 className="mt-1 font-heading text-lg leading-snug">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-novae py-24 text-center">
        <h2 className="font-heading text-3xl">JOIN THE NOVAÉ LIST</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14px] text-ink/60">
          Early access to new drops, styling notes, and 10% off your first order.
        </p>
        <div className="mx-auto mt-6 max-w-sm">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
