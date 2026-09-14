"use client";

import { useState } from "react";
import { SIZE_GUIDE } from "@/lib/constants";

export default function SizeGuidePage() {
  const [tab, setTab] = useState<"women" | "men">("women");
  const rows = SIZE_GUIDE[tab];

  return (
    <div className="container-novae max-w-[720px] py-14 md:py-20">
      <h1 className="text-center font-heading text-4xl md:text-5xl">SIZE GUIDE</h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-center text-ink/60">
        All measurements are in inches. If you fall between sizes, we recommend sizing up
        for a relaxed fit.
      </p>

      <div className="mt-10 flex justify-center gap-8 border-b border-ink/10">
        {(["women", "men"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-4 text-[13px] tracking-widest2 uppercase ${
              tab === t ? "border-b border-ink text-ink" : "text-ink/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <table className="mt-8 w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink/15 text-[11px] tracking-widest2 uppercase text-ink/50">
            <th className="py-3">Size</th>
            <th className="py-3">Chest</th>
            <th className="py-3">Waist</th>
            <th className="py-3">Hip</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-ink/10">
              <td className="py-3 font-heading">{row.size}</td>
              <td className="py-3">{row.chest}&quot;</td>
              <td className="py-3">{row.waist}&quot;</td>
              <td className="py-3">{row.hip}&quot;</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10 text-[13px] text-ink/55">
        <p>Measure at the fullest part of the chest, natural waistline, and fullest part of the hip.</p>
        <p className="mt-2">Still unsure? Reach out via our <a href="/contact" className="link-underline text-ink">contact page</a> and we&apos;ll help you find your fit.</p>
      </div>
    </div>
  );
}
