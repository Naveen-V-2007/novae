"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tab = "profile" | "orders" | "addresses" | "wishlist";

const TAB_LABELS: Record<Tab, string> = {
  profile: "Profile",
  orders: "Orders",
  addresses: "Addresses",
  wishlist: "Wishlist",
};

export default function AccountPage() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data?.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container-novae py-24 text-center text-ink/40">Loading…</div>;
  }

  if (!me) {
    return <AuthGate mode={mode} setMode={setMode} onAuth={(u) => setMe(u)} />;
  }

  const initial = (me.firstName?.[0] ?? "?").toUpperCase();

  return (
    <div className="container-novae grid grid-cols-1 gap-16 py-16 md:grid-cols-[220px_1fr]">
      <aside>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-ink font-heading text-xl text-bone">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg leading-tight">
              {me.firstName} {me.lastName}
            </p>
            <p className="truncate text-[13px] text-ink/50">{me.email}</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-col">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-l-2 py-2.5 pl-4 text-left text-[14px] transition-colors ${
                tab === t
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/45 hover:text-ink"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </nav>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            setMe(null);
          }}
          className="mt-10 border-t border-ink/10 pt-6 text-left text-[13px] text-clay"
        >
          Sign out
        </button>
      </aside>

      <div className="min-w-0">
        {tab === "profile" && <ProfilePanel me={me} />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "addresses" && <AddressesPanel />}
        {tab === "wishlist" && <WishlistPanel />}
      </div>
    </div>
  );
}

function AuthGate({
  mode,
  setMode,
  onAuth,
}: {
  mode: "signin" | "register";
  setMode: (m: "signin" | "register") => void;
  onAuth: (u: any) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const url = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "signin"
          ? { email, password }
          : { firstName, lastName, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      onAuth(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    setForgotSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotSuccess(data.message || "Check your email for a reset link.");
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotSubmitting(false);
    }
  }

  if (forgotOpen) {
    return (
      <div className="container-novae flex min-h-[60vh] items-center justify-center py-16">
        <form onSubmit={handleForgot} className="w-full max-w-sm">
          <h1 className="font-heading text-3xl leading-tight">Reset your password</h1>
          <p className="mt-3 text-[14px] text-ink/60">
            Enter the email on your account and we'll send a link to set a new password.
          </p>
          <div className="mt-8">
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>

          {forgotSuccess && (
            <p className="mt-4 text-[13px] text-ink/70">{forgotSuccess}</p>
          )}
          {forgotError && <p className="mt-4 text-[13px] text-clay">{forgotError}</p>}

          <button type="submit" disabled={forgotSubmitting} className="btn-primary mt-8">
            {forgotSubmitting ? "Sending…" : "Send reset link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotOpen(false);
              setForgotSuccess(null);
              setForgotError(null);
            }}
            className="link-underline mt-6 block text-[13px]"
          >
            Back to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-novae flex min-h-[60vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-heading text-3xl leading-tight">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-3 text-[14px] text-ink/60">
          {mode === "signin"
            ? "Welcome back — sign in to view your orders and saved details."
            : "Save your addresses and track orders in one place."}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {mode === "register" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="label-field">First name</label>
                <input
                  required
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="label-field">Last name</label>
                <input
                  required
                  className="input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="self-end text-[12px] text-ink/50 hover:text-ink"
            >
              Forgot password?
            </button>
          )}

          {error && <p className="text-[13px] text-clay">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="mt-8 text-center text-[13px] text-ink/60">
          {mode === "signin" ? "New to NOVAÉ?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "register" : "signin")}
            className="link-underline text-ink"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}

function ProfilePanel({ me }: { me: any }) {
  const rows = [
    { label: "Name", value: `${me.firstName} ${me.lastName}` },
    { label: "Email", value: me.email },
    { label: "Phone", value: me.phone || "Not added" },
  ];

  return (
    <div>
      <h2 className="font-heading text-2xl">Profile</h2>
      <div className="mt-6 max-w-md border-t border-ink/10">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between border-b border-ink/10 py-4">
            <span className="text-[13px] text-ink/50">{r.label}</span>
            <span className="text-[15px]">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-ink/40",
  processing: "bg-ink/40",
  shipped: "bg-olive",
  delivered: "bg-olive",
  cancelled: "bg-clay",
};

function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="font-heading text-2xl">Orders</h2>

      {loading ? (
        <p className="mt-6 text-ink/40">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-6 max-w-md border-t border-ink/10 py-8">
          <p className="text-ink/60">You haven't placed an order yet.</p>
          <Link href="/shop" className="link-underline mt-3 inline-block text-[13px] text-ink">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 max-w-xl border-t border-ink/10">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-ink/10 py-5">
              <div>
                <p className="text-[15px]">Order #{o.id}</p>
                <p className="mt-1 text-[13px] text-ink/50">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-2 text-[14px] capitalize">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[o.status] ?? "bg-ink/40"}`} />
                  {o.status}
                </p>
                <p className="mt-1 text-[13px] text-ink/50">₹{o.total}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyAddressForm = {
  label: "Home",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pin: "",
};

function AddressesPanel() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddressForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(field: keyof typeof emptyAddressForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save that address.");
      setForm(emptyAddressForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    } finally {
      load();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl">Addresses</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-[13px] text-ink underline underline-offset-4">
            Add address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg border-t border-ink/10 pt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">First name</label>
              <input
                required
                className="input-field"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Last name</label>
              <input
                required
                className="input-field"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Phone</label>
              <input
                required
                className="input-field"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Address</label>
              <input
                required
                className="input-field"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Apartment, floor (optional)</label>
              <input
                className="input-field"
                value={form.apartment}
                onChange={(e) => update("apartment", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">City</label>
              <input
                required
                className="input-field"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">State</label>
              <input
                required
                className="input-field"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Pincode</label>
              <input
                required
                className="input-field"
                value={form.pin}
                onChange={(e) => update("pin", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Label</label>
              <input
                placeholder="Home, Work…"
                className="input-field"
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mt-5 text-[13px] text-clay">{error}</p>}

          <div className="mt-8 flex gap-6">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyAddressForm);
                setError(null);
              }}
              className="text-[13px] text-ink/50 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-ink/40">Loading addresses…</p>
        ) : addresses.length === 0 && !showForm ? (
          <div className="max-w-md border-t border-ink/10 py-8">
            <p className="text-ink/60">You haven't saved an address yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={a.id} className="group relative border-t border-ink/10 pt-5">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="absolute right-0 top-5 text-[12px] text-ink/30 opacity-0 transition-opacity hover:text-clay group-hover:opacity-100"
                  aria-label="Remove address"
                >
                  Remove
                </button>
                <p className="text-[12px] text-ink/45">{a.label}</p>
                <p className="mt-2 text-[15px]">{a.firstName} {a.lastName}</p>
                <p className="mt-1 text-[14px] text-ink/60">{a.address}</p>
                {a.apartment && <p className="text-[14px] text-ink/60">{a.apartment}</p>}
                <p className="text-[14px] text-ink/60">{a.city}, {a.state} {a.pin}</p>
                <p className="mt-2 text-[13px] text-ink/45">{a.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistPanel() {
  return (
    <div>
      <h2 className="font-heading text-2xl">Wishlist</h2>
      <div className="mt-6 max-w-md border-t border-ink/10 py-8">
        <p className="text-ink/60">Everything you've saved lives on one page.</p>
        <Link href="/wishlist" className="link-underline mt-3 inline-block text-[13px] text-ink">
          View wishlist
        </Link>
      </div>
    </div>
  );
}
