"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/AdminNav";
import { formatINR } from "@/lib/constants";
import { Product } from "@/lib/types";
import { placeholder } from "@/lib/placeholder";

export default function AdminProductsPage() {
  return (
    <AdminGate>
      <ProductsManager />
    </AdminGate>
  );
}

const emptyForm = {
  name: "",
  price: 0,
  category: "women" as "women" | "men",
  collection: "everyday-01",
  material: "",
  fit: "",
  description: "",
  colours: "Bone",
  sizes: "XS,S,M,L,XL,XXL",
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
      setUploadedImages((prev) => [...prev, ...dataUrls]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeUploadedImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const colours = form.colours.split(",").map((c) => c.trim()).filter(Boolean);
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const images =
      uploadedImages.length > 0
        ? uploadedImages
        : [placeholder(form.name, "bone"), placeholder(`${form.name} detail`, "bone")];

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.toUpperCase(),
        slug,
        price: Number(form.price),
        category: form.category,
        collection: form.collection,
        material: form.material,
        fit: form.fit,
        description: form.description,
        colours,
        sizes,
        images,
        inventory: colours.flatMap((c) => sizes.map((s) => ({ colour: c, size: s, inventory: 10 }))),
      }),
    });
    setForm(emptyForm);
    setUploadedImages([]);
    setCreating(false);
    load();
  }

  async function updatePrice(slug: string, price: number) {
    await fetch(`/api/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    load();
  }

  async function deleteProduct(slug: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="container-novae py-10">
      <h1 className="font-heading text-3xl">ADMIN DASHBOARD</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="eyebrow">Products ({products.length})</p>
        <button onClick={() => setCreating((v) => !v)} className="btn-outline px-4 py-2 text-[11px]">
          {creating ? "Cancel" : "Add Product"}
        </button>
      </div>

      {creating && (
        <form onSubmit={createProduct} className="mt-6 grid gap-4 border border-ink/10 p-6 md:grid-cols-2">
          <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextField
            label="Price (₹)"
            type="number"
            value={String(form.price)}
            onChange={(v) => setForm({ ...form, price: Number(v) })}
          />
          <div>
            <label className="label-field">Category</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as "women" | "men" })}
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
            </select>
          </div>
          <TextField label="Collection Slug" value={form.collection} onChange={(v) => setForm({ ...form, collection: v })} />
          <TextField label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
          <TextField label="Fit" value={form.fit} onChange={(v) => setForm({ ...form, fit: v })} />
          <TextField label="Colours (comma separated)" value={form.colours} onChange={(v) => setForm({ ...form, colours: v })} />
          <TextField label="Sizes (comma separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />

          <div className="md:col-span-2">
            <label className="label-field">Product Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="block w-full text-[13px] file:mr-4 file:border file:border-ink/25 file:bg-transparent file:px-4 file:py-2 file:text-[11px] file:tracking-widest2 file:uppercase file:cursor-pointer"
            />
            {uploading && <p className="mt-2 text-[12px] text-ink/50">Reading images…</p>}
            {uploadedImages.length === 0 && !uploading && (
              <p className="mt-2 text-[12px] text-ink/45">
                No photos selected — a placeholder box will be used until you add real photos.
              </p>
            )}
            {uploadedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {uploadedImages.map((src, i) => (
                  <div key={i} className="relative h-20 w-16 overflow-hidden bg-grey">
                    <Image src={src} alt={`Upload ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(i)}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center bg-ink/80 text-[10px] text-bone"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Description</label>
            <textarea
              required
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary md:col-span-2">
            Create Product
          </button>
        </form>
      )}

      <div className="mt-8 border border-ink/10">
        {loading && <p className="p-5 text-ink/50">Loading…</p>}
        {!loading &&
          products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b border-ink/10 p-4 last:border-b-0">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-grey">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px]">{p.name}</p>
                <p className="text-[12px] text-ink/50">
                  {p.category} · {p.collection}
                </p>
              </div>
              <input
                type="number"
                defaultValue={p.price}
                onBlur={(e) => updatePrice(p.slug, Number(e.target.value))}
                className="w-24 border border-ink/20 px-2 py-1 text-[13px]"
              />
              <span className="w-20 text-[12px] text-ink/50">
                {p.inventory.reduce((s, v) => s + v.inventory, 0)} in stock
              </span>
              <button
                onClick={() => deleteProduct(p.slug)}
                className="text-[12px] text-clay hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input required type={type} className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
