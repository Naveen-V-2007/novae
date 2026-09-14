import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopGrid from "@/components/ShopGrid";

export function generateStaticParams() {
  return [{ gender: "women" }, { gender: "men" }];
}

export default function ShopGenderPage({ params }: { params: { gender: string } }) {
  if (params.gender !== "women" && params.gender !== "men") notFound();

  return (
    <Suspense fallback={null}>
      <ShopGrid category={params.gender} title={params.gender.toUpperCase()} />
    </Suspense>
  );
}
