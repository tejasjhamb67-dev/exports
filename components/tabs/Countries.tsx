"use client";
import React, { useState } from "react";
import WorldMap from "@/components/WorldMap";
import { DEMAND, REGIONS } from "@/lib/demand";
import { DESTINATIONS } from "@/lib/data";
import { KPI, Chip, Reason, BarList } from "@/components/ui";

export default function Countries() {
  const [sel, setSel] = useState<string | null>(null);
  const d = sel ? DEMAND.find((x) => x.name === sel) : null;
  const sorted = [...DEMAND].sort((a, b) => b.intensity - a.intensity);

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow teal">Layer 02 · Demand</div>
        <h1 className="page-title">The Demand Map — where the world wants to buy</h1>
        <p className="page-sub">
          If the India map is <b className="gold-t">supply</b>, this is <b className="teal-t">demand</b>. Colour = a blended read of market size,
          India's head-room, and strategic fit for a new entrant. The arcs trace India → its highest-pull markets.
          <b className="hl"> Click a country for what it pulls and why.</b>
        </p>

        <div className="grid g4" style={{ marginTop: 20 }}>
          <KPI label="Top destination" val="USA" sub="US$86.5B · +11.6% · #1 for a decade" tone="teal" />
          <KPI label="Fastest FTA unlock" val="UK" sub="2025 FTA zeroes ~99% of tariff lines" tone="teal" />
          <KPI label="Highest head-room" val="Japan / Germany" sub="<1% share of huge import bills" tone="teal" />
          <KPI label="Top-10 concentration" val="~52%" sub="diversification is itself the strategy" tone="teal" />
        </div>

        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
          <div className="card pad-lg">
            <WorldMap onSelect={setSel} selected={sel} />
            <div className="legend" style={{ marginTop: 10 }}>
              <span className="li"><span className="dot" style={{ background: "#eab24a" }} /> India (origin)</span>
              <span className="li"><span className="dot" style={{ background: "#38c7cc" }} /> demand market</span>
              <div style={{ flex: 1 }} />
              <div style={{ width: 120, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#e0eeee,#38c7cc)" }} />
              <span>low → high pull</span>
            </div>
          </div>

          <div>
            {!d ? (
              <div className="card pad-lg">
                <div className="section-title">Ranked by pull for a new entrant</div>
                <div className="section-note">Not just "biggest buyer" — biggest <i>opportunity</i>, netting out how crowded India already is there.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {sorted.slice(0, 10).map((c, i) => (
                    <div key={c.name} onClick={() => setSel(c.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--panel-2)", borderRadius: 8, cursor: "pointer", border: "1px solid var(--line)" }}>
                      <span className="badge-rank">{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontWeight: 600, flex: 1, fontSize: 13 }}>{c.short}</span>
                      <span className="pill-sm">{c.region}</span>
                      <div style={{ width: 70, height: 6, borderRadius: 3, background: "rgba(30,41,59,0.06)" }}>
                        <div style={{ width: `${c.intensity}%`, height: "100%", borderRadius: 3, background: "var(--teal)" }} />
                      </div>
                      <span className="tnum teal-t" style={{ fontWeight: 700, width: 26, textAlign: "right" }}>{c.intensity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card pad-lg" style={{ animation: "fadeUp 0.35s" }}>
                <div className="card-h">
                  <div><div className="eyebrow teal">{d.region}</div><h3 style={{ fontSize: 22, marginTop: 2 }}>{d.short}</h3></div>
                  <button className="btn" onClick={() => setSel(null)}>← back</button>
                </div>
                <div className="grid g3">
                  <KPI label="Demand intensity" val={`${d.intensity}`} unit="/100" tone="teal" />
                  <KPI label="India exports" val={`${d.indiaExp}`} unit="US$B" tone="teal" />
                  <KPI label="Import share" val={d.share.replace("~", "")} tone="teal" />
                </div>
                <Reason teal>{d.hook}</Reason>
                <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>What this market pulls (white-space fit)</div>
                <div className="tag-row" style={{ marginTop: 8 }}>
                  {d.wants.map((w, i) => <Chip key={i} kind="teal">{w}</Chip>)}
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)" }}>Total goods imports: <b className="teal-t">{d.imports}</b> — India supplies just <b>{d.share}</b>. That gap is the prize.</div>
              </div>
            )}
          </div>
        </div>

        {/* destination value table */}
        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card">
            <div className="card-h"><h3>Top-10 destinations by value</h3><span className="sub">US$B · FY25</span></div>
            <BarList color="var(--teal)" fmt={(v) => `$${v.toFixed(0)}B`}
              rows={DESTINATIONS.map((x) => ({ label: x.short, value: x.usd, sub: `${x.growth > 0 ? "+" : ""}${x.growth}%` }))} />
          </div>
          <div className="card">
            <div className="card-h"><h3>The diversification logic</h3></div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              The US is India's single largest market — and its single largest <b>concentration risk</b>. 2025 tariff actions on
              shrimp, steel and others show why a one-market book is fragile.
            </p>
            <Reason teal>
              The model's rule: build a value-add asset that can serve <b>a second corridor off the same line</b> (EU off a US-qualified
              plant, Gulf off a UAE-CEPA route). One asset, multiple tariff regimes — resilience without rebuilding.
            </Reason>
            <div style={{ marginTop: 12 }} className="tag-row">
              {REGIONS.map((r) => <span key={r} className="pill-sm">{r}</span>)}
            </div>
          </div>
        </div>
        <div className="spacer" />
        <div className="src">Sources: DGCI&amp;S / Dept. of Commerce (India export values by partner, FY25). Import totals & shares triangulated from national trade accounts and ITC Trade Map. Intensity is an authored composite (size × head-room × entrant-fit), shown for prioritisation, not as an official statistic.</div>
      </div>
    </div>
  );
}
