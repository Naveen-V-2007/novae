export type Gender = "women" | "men";

export interface ProductVariantStock {
  size: string;
  colour: string;
  inventory: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Gender;
  collection: string; // slug of collection
  images: string[];
  colours: string[];
  sizes: string[];
  inventory: ProductVariantStock[];
  rating: number;
  reviews: number;
  material: string;
  fit: string;
  tags: string[];
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  image: string;
  date: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  colour: string;
  size: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  colour: string;
  size: string;
  quantity: number;
}

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: "upi" | "card" | "netbanking";
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  addresses: Address[];
  createdAt: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
}
