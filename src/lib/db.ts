import { products as seedProducts } from "@/data/products";
import { getSupabaseServerClient } from "./supabaseClient";
import { Order, Product, User, Coupon } from "./types";

interface DBShape {
  products: Product[];
  orders: Order[];
  users: User[];
  coupons: Coupon[];
  newsletter: string[];
  contactMessages: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: string;
  }[];
}

function seedDB(): DBShape {
  return {
    products: seedProducts,
    orders: [],
    users: [],
    coupons: [
      { code: "NOVAE10", type: "percent", value: 10, active: true },
      { code: "WELCOME200", type: "flat", value: 200, active: true },
    ],
    newsletter: [],
    contactMessages: [],
  };
}

export async function readDB(): Promise<DBShape> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("app_state").select("data").eq("id", 1).single();

  if (error || !data || !data.data || Object.keys(data.data).length === 0) {
    const fresh = seedDB();
    await supabase.from("app_state").upsert({ id: 1, data: fresh, updated_at: new Date().toISOString() });
    return fresh;
  }

  return data.data as DBShape;
}

export async function updateDB(mutator: (db: DBShape) => void): Promise<DBShape> {
  const db = await readDB();
  mutator(db);

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("app_state")
    .upsert({ id: 1, data: db, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Failed to save to database: ${error.message}`);
  }

  return db;
}

export type { DBShape };
