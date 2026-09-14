-- ============================================================================
-- NOVAÉ — Supabase / PostgreSQL schema
-- ============================================================================
-- This mirrors the shapes used by the dev-mode JSON store in src/lib/db.ts,
-- so migrating from the file-based dev backend to Supabase is close to 1:1.
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh
-- project. See README.md "Going to production" for the full migration guide.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- USERS  (Supabase Auth handles login; this table stores profile + addresses)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  label text not null default 'Home',
  first_name text not null,
  last_name text not null,
  address text not null,
  apartment text,
  city text not null,
  state text not null,
  pin text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CATALOG
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,       -- 'Women' | 'Men'
  slug text unique not null
);

create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image text
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category_id uuid references public.categories (id),
  collection_id uuid references public.collections (id),
  images text[] not null default '{}',
  colours text[] not null default '{}',
  sizes text[] not null default '{}',
  material text,
  fit text,
  tags text[] not null default '{}',
  rating numeric(2, 1) not null default 0,
  reviews_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- One row per (colour, size) combination for a product.
create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products (id) on delete cascade,
  colour text not null,
  size text not null,
  sku text unique,
  unique (product_id, colour, size)
);

create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants (id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0)
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- WISHLIST / CART  (server-persisted; the shipped frontend uses localStorage
-- for guests, but signed-in carts can be synced to these tables)
-- ---------------------------------------------------------------------------
create table if not exists public.wishlist (
  user_id uuid not null references public.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.cart (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references public.users (id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.cart (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  quantity integer not null default 1 check (quantity > 0)
);

-- ---------------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------------
create type order_status as enum ('placed', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_method as enum ('upi', 'card', 'netbanking');

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  user_id uuid references public.users (id) on delete set null,
  guest_email text,
  address_id uuid references public.addresses (id),
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  status order_status not null default 'placed',
  payment_method payment_method not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  variant_id uuid references public.product_variants (id),
  name text not null,
  image text,
  price numeric(10, 2) not null,
  colour text not null,
  size text not null,
  quantity integer not null
);

create table if not exists public.coupons (
  code text primary key,
  type text not null check (type in ('percent', 'flat')),
  value numeric(10, 2) not null,
  active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users manage own addresses" on public.addresses
  for all using (auth.uid() = user_id);

create policy "Users manage own wishlist" on public.wishlist
  for all using (auth.uid() = user_id);

create policy "Users manage own cart" on public.cart
  for all using (auth.uid() = user_id);

create policy "Users manage own cart items" on public.cart_items
  for all using (
    cart_id in (select id from public.cart where user_id = auth.uid())
  );

create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users view own order items" on public.order_items
  for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

create policy "Anyone can read reviews" on public.reviews
  for select using (true);
create policy "Signed-in users can write reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

-- Products, categories, collections, coupons are public read, admin write.
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.coupons enable row level security;

create policy "Anyone can read products" on public.products for select using (true);
create policy "Anyone can read categories" on public.categories for select using (true);
create policy "Anyone can read collections" on public.collections for select using (true);
create policy "Anyone can read active coupons" on public.coupons for select using (active);

-- Admin writes should go through the Supabase Service Role key from a
-- protected server context (the /admin dashboard's API routes), which
-- bypasses RLS — so no public write policies are defined for these tables.

-- ---------------------------------------------------------------------------
-- SEED: categories + collections (products are best imported via script from
-- src/data/products.ts — see README.md)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Women', 'women'),
  ('Men', 'men')
on conflict (slug) do nothing;

insert into public.collections (name, slug, description) values
  ('THE TRANSITION', 'the-transition', 'Designed for changing days.'),
  ('MONO', 'mono', 'Quiet colour. Strong form.'),
  ('EVERYDAY 01', 'everyday-01', 'The foundation of the NOVAÉ wardrobe.')
on conflict (slug) do nothing;

insert into public.coupons (code, type, value, active) values
  ('NOVAE10', 'percent', 10, true),
  ('WELCOME200', 'flat', 200, true)
on conflict (code) do nothing;
