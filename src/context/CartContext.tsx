"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, colour: string, size: string) => void;
  updateQuantity: (productId: string, colour: string, size: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  lastAdded: CartItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "novae_cart_v1";

function sameLine(a: CartItem, b: { productId: string; colour: string; size: string }) {
  return a.productId === b.productId && a.colour === b.colour && a.size === b.size;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

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

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item) ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
    setLastAdded(item);
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, colour: string, size: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, { productId, colour, size })));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, colour: string, size: string, quantity: number) => {
      setItems((prev) =>
        prev.map((p) =>
          sameLine(p, { productId, colour, size }) ? { ...p, quantity: Math.max(1, quantity) } : p
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        count,
        isDrawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        lastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
