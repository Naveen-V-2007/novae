import { notFound } from "next/navigation";
import Image from "next/image";
import { journalArticles, getArticleBySlug } from "@/data/journal";

export function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <article className="container-novae max-w-[760px] py-14 md:py-20">
      <p className="eyebrow text-center">{article.category}</p>
      <h1 className="mt-3 text-center font-heading text-3xl md:text-5xl">{article.title}</h1>
      <p className="mt-3 text-center text-[13px] text-ink/45">
        {new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="relative mt-10 aspect-[16/10] overflow-hidden bg-grey">
        <Image src={article.image} alt={article.title} fill className="object-cover" />
      </div>
      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-ink/80">
        {article.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
