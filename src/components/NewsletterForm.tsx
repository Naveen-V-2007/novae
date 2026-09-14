"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message ?? "Something went wrong.");
    }
  }

  if (status === "done") {
    return <p className="text-[14px] text-ink/70">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        placeholder="Your email"
        className="input-field flex-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary shrink-0">
        {status === "loading" ? "…" : "Join"}
      </button>
      {status === "error" && (
        <p className="absolute mt-12 text-[12px] text-clay">{message}</p>
      )}
    </form>
  );
}
