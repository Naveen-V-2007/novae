import { JournalArticle } from "@/lib/types";

export const journalArticles: JournalArticle[] = [
  {
    id: "j-01",
    slug: "the-art-of-wearing-less",
    title: "THE ART OF WEARING LESS",
    category: "Philosophy",
    excerpt:
      "Restraint is not the absence of style. It is style, refined until only what matters is left.",
    image: "/images/journal/the-art-of-wearing-less.jpeg",
    date: "2026-02-14",
    body: [
      "A wardrobe built around fewer, better pieces is not a compromise. It is a discipline — one that asks what a garment actually needs to do before deciding what it should look like.",
      "At NOVAÉ, every piece is designed to answer a question: does this earn its place? A shirt with too many details is a shirt with too many decisions. We remove until what remains is only the essential — a clean shoulder, a considered drape, a fabric that behaves the way it should.",
      "Wearing less is not about owning less. It is about choosing with intention, so that everything in the wardrobe works together, and nothing has to shout to be noticed.",
    ],
  },
  {
    id: "j-02",
    slug: "why-fabric-matters",
    title: "WHY FABRIC MATTERS",
    category: "Material",
    excerpt:
      "The fabric decides everything else — how a piece moves, ages and feels against the skin.",
    image: "/images/journal/why-fabric-matters.jpeg",
    date: "2026-01-22",
    body: [
      "Before a single seam is cut, the fabric has already decided most of the outcome. A linen that is too light will crease unpredictably. A cotton that is too dense will resist movement. The right cloth makes the pattern's job easier.",
      "We select fabrics for how they behave over years, not just on the first wear — European linens that soften with washing, cotton twills that hold their structure, knits that keep their shape.",
      "Good fabric is quiet. You notice it only when it is missing.",
    ],
  },
  {
    id: "j-03",
    slug: "building-a-better-capsule-wardrobe",
    title: "BUILDING A BETTER CAPSULE WARDROBE",
    category: "Guide",
    excerpt:
      "A working capsule wardrobe is built on repetition, not variety — the same good decisions, worn often.",
    image: "/images/journal/building-a-better-capsule-wardrobe.jpeg",
    date: "2025-12-30",
    body: [
      "A capsule wardrobe fails when it tries to cover every occasion. It works when it covers most of them, well.",
      "Start with a neutral base — ink, bone, olive, soft grey — and let one accent colour do the work of standing out. Build from pieces that share a common silhouette language, so that anything in the wardrobe can be worn with anything else.",
      "The goal is not fewer clothes. It is fewer decisions each morning.",
    ],
  },
  {
    id: "j-04",
    slug: "the-new-indian-minimalism",
    title: "THE NEW INDIAN MINIMALISM",
    category: "Perspective",
    excerpt:
      "A generation of Indian dressing that borrows from architecture and urban life, not just tradition.",
    image: "/images/journal/the-new-indian-minimalism.jpeg",
    date: "2025-11-18",
    body: [
      "Contemporary Indian style is no longer defined only by its ethnicwear or its streetwear — a third language has emerged, one shaped by the country's architecture, its concrete and stone, and the rhythm of its cities.",
      "This is dressing built for movement — for the commute, the meeting, the evening — without needing to signal effort. It borrows structure from tailoring and ease from everyday fabric.",
      "NOVAÉ sits inside this shift: contemporary Indian minimalism, made for the life actually being lived.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return journalArticles.find((a) => a.slug === slug);
}
