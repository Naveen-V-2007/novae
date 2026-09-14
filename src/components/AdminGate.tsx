"use client";

import { useEffect, useState } from "react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "in" | "out">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setStatus(d.isAdmin ? "in" : "out"));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }
    setStatus("in");
  }

  if (status === "checking") {
    return <div className="container-novae py-24 text-center text-ink/40">Loading…</div>;
  }

  if (status === "out") {
    return (
      <div className="container-novae flex min-h-[60vh] items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="font-heading text-3xl">DASHBOARD ACCESS</h1>
          <p className="mt-2 text-[14px] text-ink/60">
            Enter the admin password to continue.
          </p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="input-field mt-6"
          />
          {error && <p className="mt-2 text-[13px] text-clay">{error}</p>}
          <button type="submit" className="btn-primary mt-4 w-full">
            Enter
          </button>
          <p className="mt-4 text-[12px] text-ink/40">
            Default dev password: novae-admin (set ADMIN_PASSWORD in .env.local to change it).
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
