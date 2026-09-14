"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6 border-b border-ink/10 pb-12 md:flex-row md:items-end md:justify-between">
      <div>
        <h3 className="font-heading text-2xl md:text-3xl">STAY IN THE LOOP.</h3>
        <p className="mt-2 max-w-[42ch] text-[14px] text-ink/60">
          Get early access to new collections and limited releases.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL ADDRESS"
          className="input-field flex-1 border-ink/30 placeholder:tracking-wide placeholder:text-[12px]"
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={status === "loading"}>
          {status === "done" ? "Joined" : "Join NOVAÉ"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-[12px] text-clay">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
