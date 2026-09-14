"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/types";

interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  colour: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  toggle: (product: Product) => void;
  isSaved: (id: string) => boolean;
  remove: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "novae_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const toggle = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
          colour: product.colours[0],
        },
      ];
    });
  };

  const isSaved = (id: string) => items.some((p) => p.id === id);
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <WishlistContext.Provider value={{ items, toggle, isSaved, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
