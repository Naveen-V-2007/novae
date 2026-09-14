import { Suspense } from "react";
import ShopGrid from "@/components/ShopGrid";

export const metadata = { title: "Shop — NOVAÉ" };

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopGrid title="ALL PRODUCTS" />
    </Suspense>
  );
}
