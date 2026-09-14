import { Collection } from "@/lib/types";
import { placeholder } from "@/lib/placeholder";

export const collections: Collection[] = [
  {
    id: "col-transition",
    name: "THE TRANSITION",
    slug: "the-transition",
    description: "Designed for changing days.",
    image: placeholder("The Transition", "olive", 1400, 1000),
  },
  {
    id: "col-mono",
    name: "MONO",
    slug: "mono",
    description: "Quiet colour. Strong form.",
    image: placeholder("Mono", "ink", 1400, 1000),
  },
  {
    id: "col-everyday01",
    name: "EVERYDAY 01",
    slug: "everyday-01",
    description: "The foundation of the NOVAÉ wardrobe.",
    image: placeholder("Everyday 01", "clay", 1400, 1000),
  },
];
