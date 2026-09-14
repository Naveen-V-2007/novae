"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const ALL_COLOURS = [
  "Bone", "Ink", "Olive", "Black", "White", "Sand", "Clay", "Grey",
  "Indigo", "Charcoal", "Sky Blue", "Purple", "Maroon", "Brown", "Red",
  "Navy", "Blue", "Denim Blue",
];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_BANDS = [
  { label: "Under ₹2,500", min: 0, max: 2500 },
  { label: "₹2,500 – ₹3,500", min: 2500, max: 3500 },
  { label: "₹3,500 – ₹5,000", min: 3500, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: 999999 },
];

export default function ShopGrid({
  category,
  title,
}: {
  category?: "women" | "men";
  title: string;
}) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("filter") ?? undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [colour, setColour] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [priceBand, setPriceBand] = useState<number | null>(null);
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tag] = useState(initialTag);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (colour) params.set("colour", colour);
    if (size) params.set("size", size);
    if (tag) params.set("tag", tag);
    if (sort !== "recommended") params.set("sort", sort);
    if (priceBand !== null) {
      params.set("minPrice", String(PRICE_BANDS[priceBand].min));
      params.set("maxPrice", String(PRICE_BANDS[priceBand].max));
    }

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [category, colour, size, priceBand, sort, tag]);

  const availableColours = useMemo(
    () => ALL_COLOURS.filter((c) => products.some((p) => p.colours.includes(c))),
    [products]
  );

  return (
    <div className="container-novae py-10 md:py-14">
      <div className="mb-8 flex items-baseline justify-between border-b border-ink/10 pb-6">
        <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
        <p className="text-[13px] text-ink/50">{products.length} PRODUCTS</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters */}
        <aside className="md:w-56 md:shrink-0">
          <button
            className="mb-4 text-[12px] tracking-widest2 uppercase md:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Filters {filtersOpen ? "−" : "+"}
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} space-y-8 md:block`}>
            <FilterGroup title="Colour">
              <div className="flex flex-wrap gap-2">
                {availableColours.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColour(colour === c ? null : c)}
                    className={`border px-3 py-1.5 text-[12px] transition-colors ${
                      colour === c ? "border-ink bg-ink text-bone" : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Size">
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? null : s)}
                    className={`h-9 w-9 border text-[12px] transition-colors ${
                      size === s ? "border-ink bg-ink text-bone" : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Price">
              <div className="flex flex-col gap-2">
                {PRICE_BANDS.map((band, i) => (
                  <label key={band.label} className="flex items-center gap-2 text-[13px] text-ink/75">
                    <input
                      type="radio"
                      checked={priceBand === i}
                      onChange={() => setPriceBand(priceBand === i ? null : i)}
                    />
                    {band.label}
                  </label>
                ))}
              </div>
            </FilterGroup>

            {(colour || size || priceBand !== null) && (
              <button
                onClick={() => {
                  setColour(null);
                  setSize(null);
                  setPriceBand(null);
                }}
                className="text-[12px] tracking-wide text-ink/50 underline underline-offset-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-ink/25 bg-transparent px-3 py-2 text-[12px] tracking-wide uppercase"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <p className="py-20 text-center text-ink/40">Loading…</p>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-ink/40">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}
