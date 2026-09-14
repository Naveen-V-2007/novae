"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="container-novae grid gap-14 py-14 md:grid-cols-2 md:py-20">
      <div>
        <h1 className="font-heading text-4xl md:text-5xl">GET IN TOUCH.</h1>
        <div className="mt-8 space-y-6 text-[15px] text-ink/70">
          <div>
            <p className="eyebrow mb-1">Customer Support</p>
            <p>{CONTACT.email}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">WhatsApp</p>
            <p>{CONTACT.whatsapp}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">Support Hours</p>
            <p>{CONTACT.hours}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" required>
            <input
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Phone">
          <input
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="Subject" required>
          <input
            required
            className="input-field"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </Field>
        <Field label="Message" required>
          <textarea
            required
            rows={5}
            className="input-field"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
        {status === "done" && <p className="text-[13px] text-olive">Thanks — we&apos;ll be in touch soon.</p>}
        {status === "error" && <p className="text-[13px] text-clay">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-field">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}
