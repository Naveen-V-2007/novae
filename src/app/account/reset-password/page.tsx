"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-novae py-24 text-center text-ink/40">Loading…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => router.push("/account"), 1500);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="container-novae flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-heading text-2xl">INVALID RESET LINK</h1>
        <Link href="/account" className="link-underline mt-4 text-[13px]">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container-novae flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-heading text-2xl">PASSWORD UPDATED</h1>
        <p className="mt-2 text-ink/60">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="container-novae flex min-h-[60vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-heading text-3xl">SET NEW PASSWORD</h1>
        <p className="mt-2 text-[14px] text-ink/60">for {email}</p>

        <div className="mt-8 flex flex-col gap-4">
          <div>
            <label className="label-field">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Confirm Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && <p className="text-[13px] text-clay">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
