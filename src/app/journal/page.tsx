import Image from "next/image";
import Link from "next/link";
import { journalArticles } from "@/data/journal";

export const metadata = { title: "Journal — NOVAÉ" };

export default function JournalPage() {
  return (
    <div className="container-novae py-14 md:py-20">
      <h1 className="font-heading text-4xl md:text-5xl">JOURNAL</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {journalArticles.map((article) => (
          <Link key={article.id} href={`/journal/${article.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-grey">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-novae group-hover:scale-[1.03]"
              />
            </div>
            <p className="eyebrow mt-4">{article.category}</p>
            <h2 className="mt-2 font-heading text-xl md:text-2xl">{article.title}</h2>
            <p className="mt-2 max-w-[52ch] text-[14px] text-ink/60">{article.excerpt}</p>
            <span className="link-underline mt-3 inline-block text-[12px] tracking-widest2 uppercase">
              Read Article
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
