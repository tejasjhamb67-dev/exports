"use client";
import React, { useState } from "react";
import { GTM } from "@/lib/plan";
import { Chip, Reason } from "@/components/ui";

export default function GTMTab() {
  const [mode, setMode] = useState(1);
  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 07 · GTM &amp; implementation</div>
        <h1 className="page-title">How to actually enter</h1>
        <p className="page-sub">Three ways in, ranked by capital and margin. For most of these white spaces, the <b className="hl">private-label converter</b> is the sweet spot — you capture the value-add margin without burning cash on a brand.</p>

        {/* entry modes */}
        <div className="grid g3" style={{ marginTop: 20 }}>
          {GTM.modes.map((m, i) => (
            <div key={i} onClick={() => setMode(i)} className="card" style={{ cursor: "pointer", border: `1px solid ${mode === i ? "var(--gold-line)" : "var(--line)"}`, background: mode === i ? "var(--gold-dim)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.mode}</div>
                {i === 1 ? <Chip kind="green">sweet spot</Chip> : null}
              </div>
              <div className="small muted" style={{ marginTop: 8, minHeight: 40 }}>{m.when}</div>
              <div className="grid g3" style={{ marginTop: 12, gap: 8 }}>
                <div><div className="xsmall muted">Capex</div><div className="b" style={{ fontSize: 13 }}>{m.capex}</div></div>
                <div><div className="xsmall muted">Risk</div><div className="b" style={{ fontSize: 13, color: m.risk === "Low" ? "var(--green)" : m.risk === "High" ? "var(--red)" : "var(--gold-2)" }}>{m.risk}</div></div>
                <div><div className="xsmall muted">Gross margin</div><div className="b gold-t" style={{ fontSize: 13 }}>{m.margin}</div></div>
              </div>
            </div>
          ))}
        </div>
        <Reason>{GTM.modes[mode].note}</Reason>

        {/* channels */}
        <div className="spacer" />
        <div className="section-title">Where the first buyers actually come from</div>
        <div className="section-note">Order of priority for a new entrant. Anchor B2B off-take first — it de-risks utilisation and funds working capital.</div>
        <div className="grid g2">
          {GTM.channels.map((c, i) => (
            <div key={i} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--gold-dim)", border: "1px solid var(--gold-line)", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 700, color: "var(--gold-2)" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontWeight: 650, fontSize: 14 }}>{c.ch}</div>
                  <Chip kind={c.weight === "Primary" ? "gold" : c.weight === "High" ? "teal" : ""}>{c.weight}</Chip>
                </div>
                <div className="small muted" style={{ marginTop: 6 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* the compliance spine */}
        <div className="spacer" />
        <div className="card pad-lg">
          <div className="card-h"><h3>The compliance spine (do these regardless of product)</h3></div>
          <div className="grid g4" style={{ gap: 10 }}>
            {[
              { t: "IEC + AD Code", d: "Importer-Exporter Code (DGFT) + Authorised Dealer code at your bank — you cannot ship without these." },
              { t: "GST LUT / refunds", d: "Letter of Undertaking to export without paying IGST; claim input-tax refunds." },
              { t: "RoDTEP / Drawback", d: "Remission of duties & taxes on exported products — free margin, claim it every shipment." },
              { t: "Product certs", d: "BRC/BAP, ISO 13485, IGI/GIA, MAPA — the cert IS the marketing; buyers filter on it." },
            ].map((x, i) => (
              <div key={i} style={{ background: "var(--panel-2)", borderRadius: 9, padding: 13, border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 650, fontSize: 13 }}>{x.t}</div>
                <div className="xsmall muted" style={{ marginTop: 6, lineHeight: 1.45 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
