"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-bone/95 backdrop-blur transition-shadow ${
          scrolled ? "border-b border-ink/10" : "border-b border-transparent"
        }`}
      >
        <div className="container-novae flex h-[76px] items-center justify-between">
          <button
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>

          <Link
            href="/"
            className="font-heading text-2xl tracking-[0.14em] md:text-3xl"
          >
            NOVAÉ
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="link-underline text-[12px] tracking-widest2 uppercase text-ink/80 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hover:text-clay transition-colors"
            >
              <SearchIcon />
            </button>
            <Link href="/account" aria-label="Account" className="hidden sm:block hover:text-clay transition-colors">
              <AccountIcon />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hover:text-clay transition-colors">
              <HeartIcon />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[9px] text-bone">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button
              aria-label="Cart"
              onClick={openDrawer}
              className="relative hover:text-clay transition-colors"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-bone">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-bone md:hidden">
          <div className="container-novae flex h-[76px] items-center justify-between">
            <span className="font-heading text-2xl tracking-[0.14em]">NOVAÉ</span>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="text-2xl leading-none">
              &times;
            </button>
          </div>
          <nav className="container-novae mt-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-heading text-3xl tracking-wide"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account" className="mt-6 text-[12px] tracking-widest2 uppercase text-ink/60">
              Account
            </Link>
          </nav>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="8.2" cy="8.2" r="6.2" stroke="currentColor" strokeWidth="1.2" />
      <line x1="12.9" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="9.5" cy="6" r="3.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.7 17c1.1-3.4 4-5.3 6.8-5.3s5.7 1.9 6.8 5.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path
        d="M9.5 16.2S2 12 2 6.9C2 4.5 3.9 3 5.9 3c1.5 0 2.9.8 3.6 2.1C10.2 3.8 11.6 3 13.1 3c2 0 3.9 1.5 3.9 3.9 0 5.1-7.5 9.3-7.5 9.3z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M4.5 6.5h10l.7 10.5h-11.4l.7-10.5z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6.2V5a2.5 2.5 0 015 0v1.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
