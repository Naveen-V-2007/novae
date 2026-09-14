"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    window.location.href = "/admin";
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
      <nav className="flex gap-6">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-[12px] tracking-widest2 uppercase ${
              pathname === l.href ? "text-ink" : "text-ink/45 hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="text-[12px] tracking-widest2 uppercase text-ink/45 hover:text-clay">
        Logout
      </button>
    </div>
  );
}
