"use client";
import React, { useState } from "react";
import { INDUSTRIES, composite, Industry } from "@/lib/data";
import { NICHE_FRAMEWORK } from "@/lib/plan";
import { Chip, Reason } from "@/components/ui";

const AXES = [
  { k: "gap" as const, label: "Gap", color: "#eab24a" },
  { k: "demand" as const, label: "Demand", color: "#38c7cc" },
  { k: "margin" as const, label: "Margin", color: "#47cf8f" },
  { k: "supply" as const, label: "Supply", color: "#9b8cff" },
  { k: "ease" as const, label: "Ease", color: "#4aa3ff" },
];

function Radar({ s, size = 128 }: { s: Industry["score"]; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 14;
  const n = AXES.length;
  const pt = (i: number, v: number) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(ang) * r * (v / 100), cy + Math.sin(ang) * r * (v / 100)];
  };
  const poly = AXES.map((a, i) => pt(i, s[a.k]).join(",")).join(" ");
  return (
    <svg width={size} height={size}>
      {[0.33, 0.66, 1].map((g, i) => (
        <polygon key={i} points={AXES.map((_, j) => { const [x, y] = pt(j, 100 * g); return `${x},${y}`; }).join(" ")}
          fill="none" stroke="rgba(30,41,59,0.07)" />
      ))}
      {AXES.map((a, i) => { const [x, y] = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(30,41,59,0.06)" />; })}
      <polygon points={poly} fill="rgba(234,178,74,0.22)" stroke="var(--gold)" strokeWidth={1.6} />
      {AXES.map((a, i) => { const [x, y] = pt(i, 118); return <text key={i} x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="var(--ink-3)">{a.label}</text>; })}
    </svg>
  );
}

export default function Niche({ go }: { go: (t: string) => void }) {
  const ranked = [...INDUSTRIES].sort((a, b) => composite(b.score) - composite(a.score));
  const [open, setOpen] = useState<string>(ranked[0].id);
  const oi = ranked.find((x) => x.id === open)!;

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 03 · Niche identification</div>
        <h1 className="page-title">Scoring the white space</h1>
        <p className="page-sub">{NICHE_FRAMEWORK.intro}</p>

        {/* methodology */}
        <div className="grid g5" style={{ marginTop: 18 }}>
          {NICHE_FRAMEWORK.axes.map((a) => (
            <div key={a.k} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 650, fontSize: 13 }}>{a.label}</div>
                <span className="chip gold">{a.w}</span>
              </div>
              <div className="xsmall muted" style={{ marginTop: 7, lineHeight: 1.45 }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1.1fr 1fr", alignItems: "start" }}>
          {/* ranked matrix */}
          <div className="card pad-lg">
            <div className="card-h"><h3>The ranked field</h3><span className="sub">composite score · click to inspect</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ranked.map((ind, i) => {
                const cs = composite(ind.score);
                const active = ind.id === open;
                return (
                  <div key={ind.id} onClick={() => setOpen(ind.id)}
                    style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 9, cursor: "pointer",
                      background: active ? "var(--gold-dim)" : "var(--panel-2)", border: `1px solid ${active ? "var(--gold-line)" : "var(--line)"}` }}>
                    <span className="badge-rank">{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 18 }}>{ind.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 650, fontSize: 13 }}>{ind.name}</div>
                      <div className="xsmall muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>→ {ind.target}</div>
                    </div>
                    {/* stacked mini score */}
                    <div className="scorebar" style={{ width: 84 }}>
                      {AXES.map((a) => <div key={a.k} style={{ width: `${100 / 5}%`, background: a.color, opacity: 0.3 + 0.7 * (ind.score[a.k] / 100) }} />)}
                    </div>
                    <span className="tnum" style={{ fontSize: 19, fontWeight: 750, color: "var(--gold-2)", width: 30, textAlign: "right" }}>{cs}</span>
                  </div>
                );
              })}
            </div>
            <div className="legend" style={{ marginTop: 12 }}>
              {AXES.map((a) => <span key={a.k} className="li"><span className="dot" style={{ background: a.color }} /> {a.label}</span>)}
            </div>
          </div>

          {/* detail */}
          <div className="card pad-lg" style={{ position: "sticky", top: 76 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Radar s={oi.score} />
              <div style={{ flex: 1 }}>
                <div className="eyebrow">{oi.emoji} {oi.name}</div>
                <div style={{ fontSize: 26, fontWeight: 750, color: "var(--gold-2)", lineHeight: 1 }} className="tnum">{composite(oi.score)}<span style={{ fontSize: 13, color: "var(--ink-3)" }}> /100</span></div>
                <div className="tag-row" style={{ marginTop: 8 }}>
                  <Chip kind="gold">{oi.tamCagr} CAGR</Chip>
                  <Chip kind="green">{oi.marginUplift}</Chip>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }} className="reason"><b>White space:</b> {oi.whitespace}</div>
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{oi.whyGap}</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {AXES.map((a) => (
                <div key={a.k}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                    <span className="muted">{a.label === "Gap" ? "White-space gap" : a.label === "Ease" ? "Entry feasibility" : a.label + " strength/pull"}</span>
                    <span className="tnum b">{oi.score[a.k]}</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${oi.score[a.k]}%`, background: a.color }} /></div>
                </div>
              ))}
            </div>
            <button className="btn primary" style={{ marginTop: 16, width: "100%" }} onClick={() => go("product")}>See the product thesis →</button>
          </div>
        </div>
        <div className="spacer" />
        <div className="src">Scores are an authored 0–100 assessment per axis, weighted (gap 28 · demand 24 · margin 22 · supply 16 · ease 10). They encode the judgements behind the narrative — a prioritisation lens, not a market statistic.</div>
      </div>
    </div>
  );
}
