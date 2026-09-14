import Image from "next/image";
import { placeholder } from "@/lib/placeholder";

export const metadata = { title: "About — NOVAÉ" };

const sections = [
  {
    title: "Our Philosophy",
    body: "Clothing doesn't need excessive decoration to have presence. We design around restraint — a clean line, a considered proportion, a fabric that behaves the way it should. What's left after removing everything unnecessary is the NOVAÉ silhouette.",
    tone: "bone" as const,
  },
  {
    title: "Materials",
    body: "Every fabric is chosen for how it behaves over years, not just on the first wear. European linens that soften with washing, cotton twills that hold their structure, knits that keep their shape season after season.",
    tone: "olive" as const,
  },
  {
    title: "Design Process",
    body: "Each piece begins with a question: what does this garment actually need to do? From there, pattern, fabric and construction are built around movement, comfort and the rhythm of everyday city life.",
    tone: "grey" as const,
  },
  {
    title: "NOVAÉ Responsibility",
    body: "We work with a small number of manufacturing partners, produce in considered volumes, and design pieces meant to be worn for years rather than a season.",
    tone: "clay" as const,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-novae py-16 text-center md:py-24">
        <h1 className="mx-auto max-w-[18ch] font-heading text-4xl leading-[1.1] md:text-6xl">
          WE BELIEVE EVERYDAY CLOTHING CAN BE BEAUTIFUL.
        </h1>
      </section>

      <section className="container-novae grid gap-10 pb-20 md:grid-cols-2 md:gap-16 md:pb-28">
        <div className="relative aspect-[4/5]">
          <Image src={placeholder("NOVAÉ Studio", "ink", 900, 1125)} alt="NOVAÉ studio" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[15px] leading-relaxed text-ink/70">
            NOVAÉ was created around a simple idea: clothing doesn&apos;t need excessive
            decoration to have presence.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
            We design contemporary pieces with considered silhouettes, tactile materials
            and understated details.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
            The brand takes inspiration from Indian architecture, everyday urban life and
            the relationship between movement and clothing.
          </p>
        </div>
      </section>

      <div className="flex flex-col">
        {sections.map((s, i) => (
          <div key={s.title} className={`grid md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image src={placeholder(s.title, s.tone, 900, 700)} alt={s.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center bg-bone px-6 py-14 md:px-16">
              <h2 className="font-heading text-2xl md:text-3xl">{s.title}</h2>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink/65">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
