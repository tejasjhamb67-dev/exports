"use client";
import React from "react";
import { KPIS, EXPORT_MIX, PROVENANCE, META, INDUSTRIES, composite } from "@/lib/data";
import { KPI, Chip, Donut } from "@/components/ui";
import { usdB } from "@/lib/util";

const SECTOR_COLORS = ["#eab24a", "#38c7cc", "#47cf8f", "#9b8cff", "#4aa3ff", "#f0645f", "#f4c874", "#6fe0e3", "#7a879b"];

export default function Cover({ go }: { go: (tab: string) => void }) {
  const top = [...INDUSTRIES].sort((a, b) => composite(b.score) - composite(a.score)).slice(0, 3);
  return (
    <div className="page">
      <div className="wrap">
        {/* HERO */}
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 32, alignItems: "center", marginBottom: 26 }}>
          <div>
            <div className="eyebrow">Export intelligence model · {META.fy}</div>
            <h1 style={{ fontSize: 46, lineHeight: 1.04, margin: "12px 0 14px", letterSpacing: "-0.03em" }}>
              India makes <span className="gold-t">US$437B</span> of exports.<br />
              The money is in the <span className="teal-t">next link up.</span>
            </h1>
            <p className="page-sub" style={{ fontSize: 16.5, maxWidth: 640 }}>
              A supply–demand model built on <b className="hl">2,000 real companies</b> and official trade data — not vibes.
              We map who makes what and where, match it to structural global demand, and isolate the
              <b className="hl"> white-space product × target country</b> a new entrant can actually win. Then we price it.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={() => go("mapping")}>Explore the supply map →</button>
              <button className="btn" onClick={() => go("financial")}>Open the financial model</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
              <Chip kind="gold">Warm = India / supply</Chip>
              <Chip kind="teal">Cool = world / demand</Chip>
              <Chip>Every figure sourced</Chip>
              <Chip>Ranges, not false precision</Chip>
            </div>
          </div>

          <div className="card pad-lg" style={{ background: "linear-gradient(160deg,#131a26,#0b0f17)" }}>
            <div className="card-h"><h3>FY25 merchandise mix</h3><span className="sub">US$B · DGCI&amp;S</span></div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Donut size={150} thick={20}
                segments={EXPORT_MIX.map((e, i) => ({ label: e.cat, value: e.usd, color: SECTOR_COLORS[i % SECTOR_COLORS.length] }))}
                center={<div><div style={{ fontSize: 22, fontWeight: 700 }} className="tnum">437</div><div style={{ fontSize: 10, color: "var(--ink-3)" }}>US$B total</div></div>} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
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
          {KPIS.map((k, i) => <KPI key={i} {...k} tone={(k as any).tone} />)}
        </div>

        {/* The thesis in one line + top-3 whitespace */}
        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
          <div className="callout">
            <div className="eyebrow">The core thesis</div>
            <p style={{ marginTop: 8, fontSize: 15, color: "var(--ink)" }}>
              India exports the <b>cheapest link in every chain</b> — raw shrimp, loose diamonds, cotton yarn, ICE parts, bulk chemicals.
              The margin lives one step up. The opportunity is not a new industry; it's <b className="gold-t">forward-integration into value India already touches.</b>
            </p>
          </div>
          <div className="card">
            <div className="card-h"><h3>Top-3 white spaces (composite score)</h3><span className="sub">click to jump</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {top.map((ind, i) => (
                <div key={ind.id} onClick={() => go("niche")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 11px", background: "var(--panel-2)", borderRadius: 9, cursor: "pointer", border: "1px solid var(--line)" }}>
                  <span style={{ fontSize: 20 }}>{ind.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 650, fontSize: 13.5 }}>{ind.whitespace.split(" — ")[0].split(" (")[0]}</div>
                    <div className="small muted">{ind.name} → <span className="teal-t">{ind.target}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: "var(--gold-2)" }}>{composite(ind.score)}</div>
                    <div className="xsmall muted">score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* provenance */}
        <div className="spacer" />
        <div className="card">
          <div className="card-h"><h3>Where the data comes from</h3><span className="sub">no black boxes</span></div>
          <div className="grid g5" style={{ gap: 10 }}>
            {PROVENANCE.map((p, i) => (
              <div key={i} style={{ padding: "11px 12px", background: "var(--panel-2)", borderRadius: 9, border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 650, fontSize: 12, marginBottom: 4 }}>{p.tag}</div>
                <div className="xsmall muted" style={{ lineHeight: 1.4 }}>{p.src}</div>
                <div style={{ marginTop: 7 }}><Chip kind={p.conf === "Hard data" || p.conf === "Official" ? "green" : "gold"}>{p.conf}</Chip></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
