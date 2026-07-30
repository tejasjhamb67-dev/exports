"use client";
import React, { useState } from "react";
import { INDUSTRIES, composite } from "@/lib/data";
import { Chip, Reason, KPI } from "@/components/ui";

export default function Product({ go }: { go: (t: string) => void }) {
  const ranked = [...INDUSTRIES].sort((a, b) => composite(b.score) - composite(a.score));
  const [id, setId] = useState(ranked[0].id);
  const ind = ranked.find((x) => x.id === id)!;

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 04 · Product identification</div>
        <h1 className="page-title">One white-space product per industry</h1>
        <p className="page-sub">
          For every industry: what India ships today, the underserved product one link up, the single country to target, and the logic.
          <b className="hl"> This is the "what to actually sell" layer.</b>
        </p>

        {/* industry selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18, marginBottom: 20 }}>
          {ranked.map((x) => (
            <button key={x.id} className={`tab ${x.id === id ? "active" : ""}`} onClick={() => setId(x.id)} style={{ border: `1px solid ${x.id === id ? "var(--gold-line)" : "var(--line)"}` }}>
              <span>{x.emoji}</span> {x.name}
            </button>
          ))}
        </div>

        {/* the flow: today -> whitespace -> target */}
        <div className="card pad-lg" style={{ animation: "fadeUp 0.3s" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 14, alignItems: "stretch" }}>
            {/* today */}
            <div style={{ background: "var(--panel-2)", borderRadius: 10, padding: 16, border: "1px solid var(--line)" }}>
              <div className="eyebrow" style={{ color: "var(--ink-3)" }}>India exports today</div>
              <div style={{ fontWeight: 650, fontSize: 15, marginTop: 6 }}>{ind.exportToday}</div>
              <div className="small muted" style={{ marginTop: 8 }}>Scale: <b className="hl">{ind.indiaExportUsd}</b></div>
              <div className="tag-row" style={{ marginTop: 10 }}>
                {ind.destNow.map((d) => <span key={d} className="pill-sm">{d}</span>)}
              </div>
            </div>
            <div style={{ display: "grid", placeItems: "center", fontSize: 22, color: "var(--ink-4)" }}>→</div>
            {/* whitespace */}
            <div style={{ background: "var(--gold-dim)", borderRadius: 10, padding: 16, border: "1px solid var(--gold-line)" }}>
              <div className="eyebrow">The white space</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6, color: "var(--gold-2)" }}>{ind.whitespace}</div>
              <div className="tag-row" style={{ marginTop: 10 }}>
                <Chip kind="gold">TAM {ind.tam}</Chip>
                <Chip kind="green">{ind.marginUplift}</Chip>
              </div>
            </div>
            <div style={{ display: "grid", placeItems: "center", fontSize: 22, color: "var(--teal)" }}>→</div>
            {/* target */}
            <div style={{ background: "var(--teal-dim)", borderRadius: 10, padding: 16, border: "1px solid var(--teal-line)" }}>
              <div className="eyebrow teal">Target country</div>
              <div style={{ fontWeight: 700, fontSize: 20, marginTop: 6, color: "var(--teal-2)" }}>{ind.target}</div>
              <div className="small muted" style={{ marginTop: 8, lineHeight: 1.45 }}>{ind.targetWhy}</div>
            </div>
          </div>
        </div>

        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
          <div className="card pad-lg">
            <div className="card-h"><h3>Why this is a gap — and why now</h3></div>
            <p style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{ind.whyGap}</p>
            <div className="grid g3" style={{ marginTop: 16 }}>
              <KPI label="Global TAM" val={ind.tam.split(" ")[0].replace("US$", "")} unit="" sub={ind.tam.replace(/^US\$[^ ]+ /, "")} />
              <KPI label="TAM growth" val={ind.tamCagr.split("–")[0]} unit="%+" sub="CAGR" tone="green" />
              <KPI label="India's share now" val={ind.indiaShareNow.replace(/[^0-9<~%]/g, "").slice(0, 4) || "low"} sub="of the white-space segment" tone="violet" />
            </div>
          </div>
          <div className="card pad-lg">
            <div className="card-h"><h3>Who already plays here</h3><span className="sub">BS1000 incumbents</span></div>
            <div className="tag-row">
              {ind.players.map((p) => <span key={p} className="pill-sm" style={{ fontSize: 12, padding: "4px 10px" }}>{p}</span>)}
            </div>
            <Reason>
              These incumbents own the <i>commodity</i> link. A new entrant does not fight them there — it enters the
              <b className="gold-t"> value-added link above them</b>, often buying their output as raw material.
            </Reason>
            <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Where in India</div>
            <div className="tag-row" style={{ marginTop: 8 }}>
              {ind.clusters.map((c) => <Chip key={c}>{c}</Chip>)}
            </div>
          </div>
        </div>

        <div className="spacer" />
        <div className="callout teal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow teal">Ready to price it?</div>
            <div style={{ fontSize: 15, marginTop: 4 }}>Four of these white spaces are modelled end-to-end — capex, unit economics, IRR, payback — in the financial tab.</div>
          </div>
          <button className="btn primary" onClick={() => go("financial")}>Open the financial model →</button>
        </div>
      </div>
    </div>
  );
}
