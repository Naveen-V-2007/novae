import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bone">
      <div className="container-novae py-16">
        <Newsletter />

        <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <p className="font-heading text-2xl tracking-[0.14em]">NOVAÉ</p>
            <p className="mt-3 max-w-[24ch] text-[13px] text-ink/60">
              Contemporary Indian clothing, made for movement and quiet confidence.
            </p>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              { label: "New In", href: "/shop?filter=new-in" },
              { label: "Women", href: "/shop/women" },
              { label: "Men", href: "/shop/men" },
              { label: "Collections", href: "/collections" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Journal", href: "/journal" },
              { label: "Contact", href: "/contact" },
              { label: "Size Guide", href: "/size-guide" },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { label: "Account", href: "/account" },
              { label: "Track Order", href: "/account" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "Cart", href: "/cart" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink/10 pt-8 text-[12px] text-ink/50 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} NOVAÉ. All rights reserved.</p>
          <p>
            {CONTACT.email} · {CONTACT.whatsapp}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="link-underline text-[13px] text-ink/75 hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
