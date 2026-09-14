#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/import-photos.js <path-to-photos-folder>");
  process.exit(1);
}
if (!fs.existsSync(sourceDir)) {
  console.error(`Folder not found: ${sourceDir}`);
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), "public", "products");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "product-images.json");

const PRODUCTS = [
  { slug: "relaxed-linen-shirt", match: ["relaxed linen shirt"] },
  { slug: "wide-leg-trousers", match: ["wide leg trousers"] },
  { slug: "ribbed-tank-top", match: ["ribbed tank top"] },
  { slug: "boxy-cotton-shirt", match: ["boxy cotton shirt"] },
  { slug: "pleated-midi-skirt", match: ["pleated midi skirt"] },
  { slug: "relaxed-blazer", match: ["relaxed blazer"] },
  { slug: "everyday-straight-jeans", match: ["everyday straight jeans"] },
  { slug: "draped-top", match: ["draped top"] },
  { slug: "oversized-overshirt", match: ["oversized overshirt"] },
  { slug: "linen-co-ord-set", match: ["linen co-ord set"] },
  { slug: "structured-linen-shirt", match: ["structured linen shirt"] },
  { slug: "relaxed-oxford-shirt", match: ["relaxed oxford shirt", "relexed oxford shirt"] },
  { slug: "tapered-trousers", match: ["tapered trousers"] },
  { slug: "oversized-cotton-tee", match: ["oversized cotton tee", "oversized cotten tee"] },
  { slug: "textured-overshirt", match: ["textured overshirt"] },
  { slug: "relaxed-denim", match: ["relaxed denim"] },
  { slug: "utility-jacket", match: ["utility jacket"] },
  { slug: "knit-polo", match: ["knit polo"] },
  { slug: "pleated-trousers", match: ["pleated trousers"] },
  { slug: "everyday-kurta", match: ["everyday kurta"] },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

const allFiles = fs.readdirSync(sourceDir).filter((f) => {
  const ext = path.extname(f).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
});

const manifest = {};
const usedFiles = new Set();
const report = [];

for (const product of PRODUCTS) {
  const matches = allFiles.filter((file) => {
    const lower = file.toLowerCase();
    return product.match.some((frag) => lower.includes(frag));
  });

  if (matches.length === 0) {
    report.push(`✗ ${product.slug}: no files found — will use placeholder`);
    continue;
  }

  matches.sort((a, b) => {
    const numA = (a.match(/-(\d)(?=[.(]|$)/) || [])[1];
    const numB = (b.match(/-(\d)(?=[.(]|$)/) || [])[1];
    if (!numA && !numB) return 0;
    if (!numA) return -1;
    if (!numB) return 1;
    return Number(numA) - Number(numB);
  });

  const urls = [];
  matches.forEach((file, i) => {
    const ext = path.extname(file);
    const destName = `${product.slug}-${i + 1}${ext}`;
    fs.copyFileSync(path.join(sourceDir, file), path.join(OUT_DIR, destName));
    urls.push(`/products/${destName}`);
    usedFiles.add(file);
  });

  while (urls.length < 3) {
    urls.push(urls[urls.length - 1]);
  }

  manifest[product.slug] = urls;
  report.push(`✓ ${product.slug}: ${matches.length} photo(s) found → ${urls.length} slots filled`);
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

const unusedFiles = allFiles.filter((f) => !usedFiles.has(f));

console.log(report.join("\n"));
console.log(`\nWrote manifest: ${MANIFEST_PATH}`);
console.log(`Copied photos into: ${OUT_DIR}`);
if (unusedFiles.length) {
  console.log(`\nFiles in the source folder that weren't matched to any product:`);
  unusedFiles.forEach((f) => console.log(`  - ${f}`));
}
