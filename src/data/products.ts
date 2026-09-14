import { Product, ProductVariantStock } from "@/lib/types";
import { placeholder } from "@/lib/placeholder";
import productImageManifest from "./product-images.json";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeInventory(colours: string[], sizes: string[]): ProductVariantStock[] {
  const stock: ProductVariantStock[] = [];
  colours.forEach((colour, ci) => {
    sizes.forEach((size, si) => {
      stock.push({
        colour,
        size,
        inventory: 8 + ((ci * 3 + si * 2) % 14),
      });
    });
  });
  return stock;
}

interface Seed {
  name: string;
  price: number;
  compareAtPrice?: number;
  category: "women" | "men";
  collection: string;
  colours: string[];
  sizes?: string[];
  material: string;
  fit: string;
  description: string;
  details: string[];
  tone: "ink" | "bone" | "clay" | "olive" | "grey";
  tags?: string[];
}

const seeds: Seed[] = [
  // WOMEN
  {
    name: "Relaxed Linen Shirt",
    price: 2990,
    category: "women",
    collection: "everyday-01",
    colours: ["Bone", "Olive", "Black"],
    material: "100% European linen",
    fit: "Relaxed",
    description:
      "A relaxed linen shirt cut with a clean structured shoulder and an easy fit. Designed to move between everyday wear and evening dressing.",
    details: ["100% European linen", "Relaxed fit", "Full sleeves", "Button closure", "Chest pocket", "Pre-washed finish"],
    tone: "bone",
    tags: ["best-seller", "new-in"],
  },
  {
    name: "Wide Leg Trousers",
    price: 3490,
    category: "women",
    collection: "everyday-01",
    colours: ["Brown", "Ink", "Sand"],
    material: "Cotton-linen blend",
    fit: "Wide leg",
    description:
      "High-rise wide leg trousers in a fluid cotton-linen blend. Cut for movement with a clean, unbroken line from waist to hem.",
    details: ["Cotton-linen blend", "High-rise waist", "Wide leg fit", "Side pockets", "Concealed zip"],
    tone: "grey",
    tags: ["best-seller"],
  },
  {
    name: "Ribbed Tank Top",
    price: 1490,
    category: "women",
    collection: "mono",
    colours: ["Black", "Bone", "Ink", "Olive"],
    material: "Ribbed cotton stretch",
    fit: "Fitted",
    description:
      "A close, ribbed tank in soft cotton stretch. A quiet foundation piece designed to layer under shirts and blazers.",
    details: ["Ribbed cotton stretch", "Fitted silhouette", "Scoop neck", "Machine washable"],
    tone: "olive",
  },
  {
    name: "Boxy Cotton Shirt",
    price: 2690,
    category: "women",
    collection: "the-transition",
    colours: ["Olive", "White", "Clay"],
    material: "100% cotton poplin",
    fit: "Boxy",
    description:
      "A boxy cotton poplin shirt with dropped shoulders and a cropped, straight hem. Sits away from the body for a considered, architectural line.",
    details: ["100% cotton poplin", "Boxy fit", "Dropped shoulder", "Curved hem", "Mother-of-pearl buttons"],
    tone: "clay",
    tags: ["new-in"],
  },
  {
    name: "Pleated Midi Skirt",
    price: 3290,
    category: "women",
    collection: "the-transition",
    colours: ["Black", "Bone", "Ink"],
    material: "Satin-finish crepe",
    fit: "A-line",
    description:
      "A permanently pleated midi skirt in satin-finish crepe. Moves with the body while holding a clean, structured silhouette.",
    details: ["Satin-finish crepe", "Permanent pleating", "Elasticated waistband", "Midi length"],
    tone: "bone",
  },
  {
    name: "Relaxed Blazer",
    price: 5990,
    category: "women",
    collection: "mono",
    colours: ["Black", "Ink", "Olive"],
    material: "Wool-blend twill",
    fit: "Relaxed",
    description:
      "A single-breasted relaxed blazer in wool-blend twill. Softly structured shoulders with a longer, easy body.",
    details: ["Wool-blend twill", "Single-breasted", "Two front pockets", "Fully lined"],
    tone: "ink",
    tags: ["best-seller"],
  },
  {
    name: "Everyday Straight Jeans",
    price: 3490,
    category: "women",
    collection: "everyday-01",
    colours: ["Black", "Indigo"],
    material: "Rigid cotton denim",
    fit: "Straight",
    description:
      "A mid-rise straight jean in rigid cotton denim. Cut clean through the leg with minimal wash and hardware.",
    details: ["Rigid cotton denim", "Mid-rise", "Straight leg", "Five-pocket construction"],
    tone: "grey",
  },
  {
    name: "Draped Top",
    price: 2490,
    category: "women",
    collection: "mono",
    colours: ["Bone", "Clay"],
    material: "Fluid viscose",
    fit: "Relaxed",
    description:
      "A softly draped top in fluid viscose with a gathered neckline. Simple in construction, considered in movement.",
    details: ["Fluid viscose", "Gathered neckline", "Relaxed fit", "Hand wash cold"],
    tone: "clay",
  },
  {
    name: "Oversized Overshirt",
    price: 3990,
    category: "women",
    collection: "the-transition",
    colours: ["Denim Blue", "Olive", "Bone"],
    material: "Brushed cotton twill",
    fit: "Oversized",
    description:
      "An oversized overshirt in brushed cotton twill, built as a light layer for the space between seasons.",
    details: ["Brushed cotton twill", "Oversized fit", "Patch pockets", "Button closure"],
    tone: "olive",
    tags: ["new-in"],
  },
  {
    name: "Linen Co-Ord Set",
    price: 4990,
    category: "women",
    collection: "everyday-01",
    colours: ["Sand", "Ink"],
    material: "100% European linen",
    fit: "Relaxed",
    description:
      "A relaxed linen shirt and trouser set designed to be worn together or apart. One fabric, one silhouette language.",
    details: ["100% European linen", "Matching shirt and trouser", "Relaxed fit", "Pre-washed finish"],
    tone: "bone",
    tags: ["best-seller"],
  },
  // MEN
  {
    name: "Structured Linen Shirt",
    price: 2990,
    category: "men",
    collection: "everyday-01",
    colours: ["Purple", "Sand", "Olive", "Black"],
    material: "100% linen",
    fit: "Relaxed",
    description:
      "A relaxed linen shirt cut with a clean structured shoulder and an easy fit. Designed to move between everyday wear and evening dressing.",
    details: ["100% linen", "Relaxed fit", "Full sleeves", "Button closure", "Chest pocket", "Pre-washed finish"],
    tone: "bone",
    tags: ["best-seller", "new-in", "just-in"],
  },
  {
    name: "Relaxed Oxford Shirt",
    price: 2790,
    category: "men",
    collection: "everyday-01",
    colours: ["Maroon", "White", "Sky Blue"],
    material: "Cotton oxford",
    fit: "Relaxed",
    description:
      "A relaxed cotton oxford shirt with a soft, unlined collar. Built as a permanent piece in the everyday wardrobe.",
    details: ["Cotton oxford", "Relaxed fit", "Unlined collar", "Button-down"],
    tone: "grey",
  },
  {
    name: "Tapered Trousers",
    price: 3490,
    category: "men",
    collection: "the-transition",
    colours: ["Brown", "Olive", "Ink"],
    material: "Cotton-linen blend",
    fit: "Tapered",
    description:
      "Relaxed through the thigh and tapered to the ankle, cut in a breathable cotton-linen blend for warm-weather wear.",
    details: ["Cotton-linen blend", "Tapered leg", "Elasticated waist with drawcord", "Side pockets"],
    tone: "olive",
    tags: ["best-seller", "just-in"],
  },
  {
    name: "Oversized Cotton Tee",
    price: 1690,
    category: "men",
    collection: "mono",
    colours: ["Red", "Bone", "Ink", "Olive"],
    material: "Heavyweight cotton jersey",
    fit: "Oversized",
    description:
      "An oversized tee in heavyweight cotton jersey. Dropped shoulders and a longer body for a considered, relaxed line.",
    details: ["Heavyweight cotton jersey", "Oversized fit", "Dropped shoulder", "Ribbed neckline"],
    tone: "bone",
    tags: ["new-in", "just-in"],
  },
  {
    name: "Textured Overshirt",
    price: 3990,
    category: "men",
    collection: "the-transition",
    colours: ["Sky Blue", "Charcoal", "Sand"],
    material: "Textured cotton weave",
    fit: "Relaxed",
    description:
      "A textured overshirt built as a light mid-layer. Cut relaxed through the body with a soft, structured collar.",
    details: ["Textured cotton weave", "Relaxed fit", "Chest pockets", "Button closure"],
    tone: "ink",
    tags: ["best-seller", "just-in"],
  },
  {
    name: "Relaxed Denim",
    price: 3690,
    category: "men",
    collection: "everyday-01",
    colours: ["Sky Blue", "Indigo", "Black"],
    material: "Rigid cotton denim",
    fit: "Relaxed",
    description:
      "A relaxed straight jean in rigid cotton denim with minimal wash. Sits easy through the hip and thigh.",
    details: ["Rigid cotton denim", "Relaxed fit", "Five-pocket construction", "Minimal wash"],
    tone: "grey",
  },
  {
    name: "Utility Jacket",
    price: 4990,
    category: "men",
    collection: "the-transition",
    colours: ["Brown", "Olive", "Black"],
    material: "Cotton canvas",
    fit: "Relaxed",
    description:
      "A utility jacket in durable cotton canvas with multiple patch pockets. Built for layering across seasons.",
    details: ["Cotton canvas", "Relaxed fit", "Multiple patch pockets", "Snap and zip closure"],
    tone: "olive",
    tags: ["new-in"],
  },
  {
    name: "Knit Polo",
    price: 2990,
    category: "men",
    collection: "mono",
    colours: ["Black", "Bone", "Clay", "Ink"],
    material: "Fine cotton knit",
    fit: "Regular",
    description:
      "A fine cotton knit polo with a clean ribbed collar. Understated texture designed to layer under overshirts.",
    details: ["Fine cotton knit", "Regular fit", "Ribbed collar and cuffs", "Two-button placket"],
    tone: "clay",
  },
  {
    name: "Pleated Trousers",
    price: 3790,
    category: "men",
    collection: "mono",
    colours: ["Blue", "Ink", "Sand"],
    material: "Wool-blend suiting",
    fit: "Relaxed",
    description:
      "Single-pleated trousers in a soft wool-blend suiting cloth. A relaxed leg with a clean, tailored waistband.",
    details: ["Wool-blend suiting", "Single pleat", "Relaxed leg", "Belt loops"],
    tone: "ink",
  },
  {
    name: "Everyday Kurta",
    price: 2490,
    category: "men",
    collection: "everyday-01",
    colours: ["Navy", "Bone", "Olive"],
    material: "Cotton blend",
    fit: "Straight",
    description:
      "A modernised straight kurta in soft cotton blend, cut clean with minimal detailing for everyday wear.",
    details: ["Cotton blend", "Straight fit", "Side slits", "Band collar"],
    tone: "bone",
    tags: ["new-in"],
  },
];

export const products: Product[] = seeds.map((seed, index) => {
  const sizes = seed.sizes ?? SIZES;
  const slug = slugify(seed.name);
  const realPhotos = (productImageManifest as Record<string, string[]>)[slug];
  return {
    id: `prod-${String(index + 1).padStart(2, "0")}`,
    name: seed.name.toUpperCase(),
    slug,
    description: seed.description,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    category: seed.category,
    collection: seed.collection,
    images: realPhotos ?? [
      placeholder(seed.name, seed.tone, 900, 1125),
      placeholder(`${seed.name} — detail`, seed.tone, 900, 1125),
      placeholder(`${seed.name} — back`, seed.tone, 900, 1125),
    ],
    colours: seed.colours,
    sizes,
    inventory: makeInventory(seed.colours, sizes),
    rating: Math.round((4.4 + ((index * 7) % 6) / 10) * 10) / 10,
    reviews: 12 + ((index * 17) % 140),
    material: seed.material,
    fit: seed.fit,
    tags: seed.tags ?? [],
    createdAt: new Date(Date.now() - index * 86400000 * 3).toISOString(),
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count);
}

export function getProductDetailList(details: string[] = []) {
  return details;
}

// Details lookup since Product type doesn't carry `details` directly
export const productDetails: Record<string, string[]> = Object.fromEntries(
  seeds.map((s) => [slugify(s.name), s.details])
);
