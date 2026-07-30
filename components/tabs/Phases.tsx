"use client";
import React, { useState } from "react";
import { PHASES } from "@/lib/plan";
import { Chip } from "@/components/ui";

export default function Phases() {
  const [open, setOpen] = useState(0);
  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 08 · Phased approach</div>
        <h1 className="page-title">The build order — start to steady-state</h1>
        <p className="page-sub">
          Five phases, each with a <b className="hl">decision gate</b> you must pass before spending on the next. The discipline is the point:
          validate demand before capex, certify before you build, qualify before you scale.
        </p>

        {/* phase rail */}
        <div style={{ display: "flex", gap: 8, marginTop: 22, marginBottom: 6, flexWrap: "wrap" }}>
          {PHASES.map((p, i) => (
            <button key={p.n} onClick={() => setOpen(i)} className="card"
              style={{ flex: 1, minWidth: 150, cursor: "pointer", padding: 14, textAlign: "left", border: `1px solid ${open === i ? "var(--gold-line)" : "var(--line)"}`, background: open === i ? "var(--gold-dim)" : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: open === i ? "var(--gold)" : "var(--panel-3)", color: open === i ? "#1a1206" : "var(--ink-2)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>{p.n}</div>
                <div className="xsmall muted">{p.window}</div>
              </div>
              <div style={{ fontWeight: 650, fontSize: 13.5, marginTop: 8 }}>{p.title}</div>
              <div className="xsmall gold-t" style={{ marginTop: 4 }}>{p.spend}</div>
            </button>
          ))}
        </div>

        {/* detail */}
        <div className="card pad-lg" style={{ marginTop: 12, animation: "fadeUp 0.3s" }}>
          <div className="card-h">
            <div>
              <div className="eyebrow">Phase {PHASES[open].n} · {PHASES[open].window}</div>
              <h2 style={{ fontSize: 23, marginTop: 4 }}>{PHASES[open].title}</h2>
            </div>
            <Chip kind="gold">Spend: {PHASES[open].spend}</Chip>
          </div>
          <p style={{ fontSize: 15, color: "var(--ink)", marginBottom: 16 }}>{PHASES[open].goal}</p>
          <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 10 }}>Do this</div>
              <div className="timeline">
                {PHASES[open].steps.map((s, i) => (
                  <div key={i} className="tl-node"><div style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{s}</div></div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 10 }}>Decision gate</div>
              <div className="callout">
                <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55 }}>{PHASES[open].gate}</div>
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)" }}>
                {open < PHASES.length - 1 ? <>Pass the gate → <b className="gold-t">Phase {PHASES[open + 1].n}: {PHASES[open + 1].title}</b>. Fail it → stop and re-pick. The gate exists to kill bad corridors cheaply.</> : <>You now have a franchise, not a factory. Compound or exit at 3× EBITDA.</>}
              </div>
            </div>
          </div>
        </div>

        {/* the whole arc */}
        <div className="spacer" />
        <div className="card pad-lg">
          <div className="card-h"><h3>The whole arc on one line</h3><span className="sub">36 months, validate → compound</span></div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
            {PHASES.map((p, i) => (
              <div key={p.n} style={{ flex: i === 0 ? 1 : i === 4 ? 1.4 : 1.2, background: `linear-gradient(180deg, var(--gold-dim), transparent)`, borderLeft: "2px solid var(--gold)", borderRadius: "0 8px 8px 0", padding: "10px 12px" }}>
                <div className="xsmall muted">{p.window}</div>
                <div style={{ fontWeight: 650, fontSize: 12.5, marginTop: 3 }}>{p.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="spacer" />
        <div className="src">Windows are indicative for a private-label converter entry; medical/pharma qualification cycles run longer. Spend bands exclude core capex (see the financial model).</div>
      </div>
    </div>
  );
}
