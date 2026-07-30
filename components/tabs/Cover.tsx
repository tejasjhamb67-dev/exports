"use client";
import React from "react";
import { KPIS, EXPORT_MIX, PROVENANCE, META } from "@/lib/data";
import { ACTS } from "@/lib/flow";
import { KPI, Chip, Donut } from "@/components/ui";

const SECTOR_COLORS = ["#eab24a", "#e0a860", "#c99a52", "#b8863d", "#a5762f", "#8f6526", "#f4c874", "#d4a95e", "#7a879b"];

export default function Cover({ go }: { go: (tab: string) => void }) {
  return (
    <div className="page">
      <div className="wrap">
        {/* HERO */}
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 36, alignItems: "center", marginBottom: 30 }}>
          <div>
            <div className="eyebrow">Export intelligence model · {META.fy}</div>
            <h1 style={{ fontSize: 48, lineHeight: 1.03, margin: "14px 0 16px", letterSpacing: "-0.03em" }}>
              India makes <span className="gold-t">US$437B</span> of exports.<br />
              The money is in the <span className="teal-t">next link up.</span>
            </h1>
            <p className="page-sub" style={{ fontSize: 16.5, maxWidth: 620 }}>
              A supply–demand model built on <b className="hl">2,000 real companies</b> and official trade data. It maps who makes
              what and where, matches it to global demand, and isolates the one <b className="hl">product × country</b> a new
              entrant can win — then prices it.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={() => go("mapping")}>Start the walkthrough →</button>
              <button className="btn" onClick={() => go("financial")}>Jump to the money</button>
            </div>
          </div>

          <div className="card pad-lg" style={{ background: "linear-gradient(160deg,#131a26,#0b0f17)" }}>
            <div className="card-h"><h3>FY25 merchandise mix</h3><span className="sub">US$B · DGCI&amp;S</span></div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Donut size={148} thick={20}
                segments={EXPORT_MIX.map((e, i) => ({ label: e.cat, value: e.usd, color: SECTOR_COLORS[i % SECTOR_COLORS.length] }))}
                center={<div><div style={{ fontSize: 22, fontWeight: 700 }} className="tnum">437</div><div style={{ fontSize: 10, color: "var(--ink-3)" }}>US$B total</div></div>} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                {EXPORT_MIX.slice(0, 6).map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5 }}>
                    <span className="dot" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                    <span style={{ color: "var(--ink-2)", flex: 1 }}>{e.cat.split(" (")[0]}</span>
                    <span className="tnum b">{e.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid g4">
          {KPIS.map((k, i) => <KPI key={i} label={k.label} val={k.val} unit={k.unit} sub={k.sub} />)}
        </div>

        {/* JOURNEY MAP — establishes the flow */}
        <div className="section-gap" />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div className="eyebrow">How to read this</div>
            <div className="section-title" style={{ marginTop: 4 }}>Four acts, one decision</div>
          </div>
          <div className="small muted">click any act to jump in →</div>
        </div>
        <div className="journey">
          {ACTS.map((a) => (
            <div key={a.n} className="jstep" onClick={() => go(a.go)}>
              <div className="jn">ACT {a.n}</div>
              <div className="jt">{a.title}</div>
              <div className="jd">{a.desc}</div>
              <div className="jtabs">{a.tabs}</div>
            </div>
          ))}
        </div>

        {/* one-line thesis */}
        <div className="section-gap" />
        <div className="callout" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div className="eyebrow">The core thesis</div>
            <p style={{ marginTop: 6, fontSize: 15.5, color: "var(--ink)" }}>
              India exports the <b>cheapest link in every chain</b> — raw shrimp, loose diamonds, cotton yarn, ICE parts, bulk chemicals.
              The margin lives one step up. The play is <b className="gold-t">forward-integration into value India already touches</b> — not a new industry.
            </p>
          </div>
          <button className="btn" onClick={() => go("niche")}>See the white-space ranking →</button>
        </div>

        {/* provenance — calm, at the foot */}
        <div className="section-gap" />
        <div className="section-title">Where the data comes from</div>
        <div className="section-note">No black boxes — every layer is sourced and labelled by confidence.</div>
        <div className="grid g5" style={{ gap: 10 }}>
          {PROVENANCE.map((p, i) => (
            <div key={i} style={{ padding: "12px 13px", background: "var(--panel)", borderRadius: 10, border: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 650, fontSize: 12, marginBottom: 5 }}>{p.tag}</div>
              <div className="xsmall muted" style={{ lineHeight: 1.45 }}>{p.src}</div>
              <div style={{ marginTop: 8 }}><Chip kind={p.conf === "Hard data" || p.conf === "Official" ? "green" : "gold"}>{p.conf}</Chip></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
