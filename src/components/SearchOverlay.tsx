"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/constants";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.products.slice(0, 6));
      } catch {
        /* ignore */
      }
    }, 250);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bone">
      <div className="container-novae flex h-[76px] items-center justify-between border-b border-ink/10">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH PRODUCTS"
          className="w-full bg-transparent font-heading text-xl tracking-wide uppercase placeholder:text-ink/30 focus:outline-none md:text-2xl"
        />
        <button onClick={onClose} aria-label="Close search" className="ml-6 text-2xl leading-none">
          &times;
        </button>
      </div>
      <div className="container-novae mt-8">
        {results.length === 0 && query && (
          <p className="text-ink/50">No products match &ldquo;{query}&rdquo;.</p>
        )}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-grey">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 text-[13px] tracking-wide">{product.name}</p>
              <p className="text-[13px] text-ink/60">{formatINR(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
