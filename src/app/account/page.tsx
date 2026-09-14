"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tab = "profile" | "orders" | "addresses" | "wishlist";

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

  return (
    <div className="container-novae grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
      <aside>
        <h1 className="font-heading text-2xl">HI, {me.firstName?.toUpperCase()}</h1>
        <nav className="mt-8 flex flex-col gap-1 text-[14px]">
          {(["profile", "orders", "addresses", "wishlist"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 text-left capitalize transition-colors ${
                tab === t ? "text-ink" : "text-ink/45 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              setMe(null);
            }}
            className="mt-4 py-2 text-left text-clay"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      <div className="md:col-span-3">
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
  const [forgotLink, setForgotLink] = useState<string | null>(null);
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
    setForgotLink(null);
    setForgotSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.resetLink) {
        setForgotLink(data.resetLink);
      } else {
        setForgotError("Check your email for a reset link.");
      }
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
          <h1 className="font-heading text-3xl">RESET PASSWORD</h1>
          <p className="mt-2 text-[14px] text-ink/60">
            Enter your account email and we'll send a reset link.
          </p>
          <div className="mt-6">
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>

          {forgotLink && (
            <div className="mt-4 border border-ink/10 bg-soft-grey/40 p-4 text-[13px]">
              <p className="text-ink/60">
                No email service is configured yet — use this link directly:
              </p>
              <Link href={forgotLink} className="link-underline mt-2 block break-all text-ink">
                {forgotLink}
              </Link>
            </div>
          )}
          {forgotError && <p className="mt-3 text-[13px] text-clay">{forgotError}</p>}

          <button type="submit" disabled={forgotSubmitting} className="btn-primary mt-6">
            {forgotSubmitting ? "Sending…" : "Send Reset Link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotOpen(false);
              setForgotLink(null);
              setForgotError(null);
            }}
            className="link-underline mt-4 block text-[13px]"
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
        <h1 className="font-heading text-3xl">
          {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
        </h1>

        <div className="mt-8 flex flex-col gap-4">
          {mode === "register" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="label-field">First Name</label>
                <input
                  required
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="label-field">Last Name</label>
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
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink/60">
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
  return (
    <div>
      <h2 className="font-heading text-xl">Profile</h2>
      <div className="mt-6 max-w-sm space-y-3 text-[14px]">
        <p><span className="text-ink/50">Name</span><br />{me.firstName} {me.lastName}</p>
        <p><span className="text-ink/50">Email</span><br />{me.email}</p>
        <p><span className="text-ink/50">Phone</span><br />{me.phone || "—"}</p>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink/40">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-ink/50">No orders yet.</p>;

  return (
    <div>
      <h2 className="font-heading text-xl">Orders</h2>
      <div className="mt-6 divide-y divide-ink/10">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between py-4 text-[14px]">
            <div>
              <p className="font-medium">#{o.id}</p>
              <p className="text-ink/50">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="capitalize">{o.status}</p>
              <p className="text-ink/50">₹{o.total}</p>
            </div>
          </div>
        ))}
      </div>
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
      load();
    } catch {
      // best-effort; refresh either way
      load();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl">Addresses</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-secondary">
            + Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg border border-ink/10 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">First Name</label>
              <input
                required
                className="input-field"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Last Name</label>
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
              <label className="label-field">Apartment / Floor (optional)</label>
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
                placeholder="Home, Work, etc."
                className="input-field"
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mt-4 text-[13px] text-clay">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyAddressForm);
                setError(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-ink/40">Loading addresses…</p>
        ) : addresses.length === 0 && !showForm ? (
          <p className="text-ink/50">No saved addresses yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={a.id} className="relative border border-ink/10 p-4 text-[14px]">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="absolute right-3 top-3 text-[12px] text-ink/40 hover:text-clay"
                  aria-label="Remove address"
                >
                  Remove
                </button>
                <p className="text-[11px] uppercase tracking-wider text-ink/40">{a.label}</p>
                <p className="font-medium">{a.firstName} {a.lastName}</p>
                <p className="text-ink/60">{a.address}</p>
                {a.apartment && <p className="text-ink/60">{a.apartment}</p>}
                <p className="text-ink/60">{a.city}, {a.state} {a.pin}</p>
                <p className="mt-2 text-ink/50">{a.phone}</p>
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
      <h2 className="font-heading text-xl">Wishlist</h2>
      <p className="mt-4 text-ink/50">
        Your saved items live at{" "}
        <Link href="/wishlist" className="link-underline">
          /wishlist
        </Link>
        .
      </p>
    </div>
  );
}
