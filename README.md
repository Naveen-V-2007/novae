# NOVAÉ — Everyday, Elevated.

A full-stack e-commerce site for NOVAÉ, a contemporary Indian fashion brand.
Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS, following
the complete brand brief: brand palette, typography, page set, product
catalog, cart/checkout flow, accounts, and an admin dashboard.

This is a **real, working full-stack app** — not a static mockup. Every page
is wired to actual API routes and a real (file-based, for local dev)
database. Run it locally and you can register an account, add products to
your bag, check out, and see the order appear in Account → Orders and in
`/admin`.

## Quick start

```bash
npm install
cp .env.example .env.local     # then edit ADMIN_PASSWORD / SESSION_SECRET
npm run dev
```

Open http://localhost:3000. The admin dashboard is at `/admin` (default
password `novae-admin`, set your own in `.env.local`).

The first request creates `data/db.json` — a real JSON file that stores
users, orders, and product edits made through the admin dashboard, seeded
from `src/data/products.ts`. Delete that file any time to reset to a fresh
seeded state.

## What's implemented

**Pages (all 12 from the brief):** Home, Shop (`/shop`, `/shop/women`,
`/shop/men` with filtering/sorting/search), Product Detail, Collections
(index + individual collection pages), About, Journal (index + article
pages), Size Guide, Contact, Cart, Checkout, Account (login/register, order
history, saved addresses, profile), Wishlist.

**Storefront functionality:** product search, category/colour/size/price
filtering, sorting, quick add, wishlist (persisted per-browser), cart
(persisted per-browser) with a slide-out drawer, coupon codes, guest and
signed-in checkout, free-shipping threshold logic, order confirmation.

**Accounts:** email/password registration and login (hashed passwords,
signed session cookies), saved addresses, order history.

**Admin dashboard (`/admin`):** password-protected. Overview stats
(revenue, orders, products, customers, low stock), product management
(create, edit price, delete, view stock), order management (view all,
update status).

**Backend:** every piece of the above is backed by real Next.js API routes
under `src/app/api/`, not client-side fakes — see `src/lib/db.ts` for the
persistence layer and `src/lib/auth.ts` for password hashing/session logic.

## What's intentionally a placeholder

- **Product photography.** Images are generated placeholders in the brand's
  colours, clearly labelled, so the site renders end-to-end immediately. Swap
  them for real photography per Section 26 of the brief — drop files into
  `public/products/` and update the `images` arrays in
  `src/data/products.ts`.
- **Payments.** Checkout captures order details and "places" the order (and
  decrements inventory) but does not call a real payment gateway. Section 17
  of the brief calls for Razorpay **test mode** — see below for wiring it up.
- **The dev database.** `data/db.json` is real persistence, but it's a local
  file. It's perfect for development and demos; it will **not** work on
  serverless hosts like Vercel, where the filesystem is ephemeral. See
  "Going to production" below.

## Project structure

```
src/
  app/                  Pages (App Router) + API routes under app/api/
  components/           Header, Footer, ProductCard, CartDrawer, AdminGate, ...
  context/              CartContext, WishlistContext, AuthContext (+ Providers)
  data/                 products.ts, collections.ts, journal.ts (seed content)
  lib/                  types.ts, db.ts (persistence), auth.ts, constants.ts
supabase/
  schema.sql            Production Postgres schema (see below)
data/
  db.json               Generated on first run — the dev-mode "database"
```

## Going to production

The dev-mode file database is deliberately simple so the whole stack runs
with zero external services. To deploy for real:

1. **Create a Supabase project** and run `supabase/schema.sql` in the SQL
   editor. It defines `products`, `product_variants`, `inventory`, `orders`,
   `order_items`, `users`, `addresses`, `wishlist`, `cart`, `cart_items`,
   `reviews`, and `coupons` — the exact table list from Section 24 of the
   brief — with row-level security policies already set up.
2. **Import the seed catalog.** The 20 products in `src/data/products.ts`
   are plain objects; write a one-off script that loops over them and
   inserts into `products` + `product_variants` + `inventory` via the
   Supabase JS client (`@supabase/supabase-js`).
3. **Swap `src/lib/db.ts`** for a version backed by the Supabase client
   instead of `fs`. Because the function signatures (`readDB`, `updateDB`)
   are used consistently across every API route, this is a contained change
   — you're replacing one file's internals, not touching the routes.
4. **Swap auth** for Supabase Auth (email/password or OTP) instead of the
   custom cookie session in `src/lib/auth.ts`, and enable the RLS policies
   already written in the schema.
5. **Wire up Razorpay test mode**: create an order server-side via the
   Razorpay Orders API inside `POST /api/orders`, return the `order_id` to
   the client, open Razorpay Checkout, and verify the payment signature in a
   webhook or a `POST /api/orders/verify` route before marking the order
   `placed`.
6. **Deploy to Vercel**, adding the Supabase and Razorpay environment
   variables from `.env.example`.

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · (production-ready for) Supabase
Postgres + Auth · Razorpay test mode · Vercel
