"use client";
import React from "react";
import { INDUSTRIES, composite } from "@/lib/data";
import { RISK_MATRIX } from "@/lib/plan";
import { VENTURES, runModel } from "@/lib/ventures";
import { FX } from "@/lib/data";
import { KPI, Chip, Reason } from "@/components/ui";
import { crShort } from "@/lib/util";

export default function Plan({ go }: { go: (t: string) => void }) {
  const ranked = [...INDUSTRIES].sort((a, b) => composite(b.score) - composite(a.score));
  const flagship = ranked[0];
  // find matching venture for flagship-ish
  const ventureRuns = VENTURES.map((v) => ({ v, m: runModel(v, { price: v.drivers[0].base, rawCost: v.drivers[1].base, util: v.drivers[2].base }, FX) }));

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 05 · The plan</div>
        <h1 className="page-title">From 11 industries to one investable decision</h1>
        <p className="page-sub">The synthesis. Supply, demand, niche and product collapse into a single recommendation — and the evidence behind it.</p>

        {/* funnel */}
        <div className="card pad-lg" style={{ marginTop: 20 }}>
          <div className="card-h"><h3>The decision funnel</h3><span className="sub">how the field narrows</span></div>
          <div className="flow" style={{ justifyContent: "space-between" }}>
            {[
              { n: "46", l: "BS1000 sectors", s: "raw supply universe" },
              { n: "11", l: "exporting industries", s: "with global demand" },
              { n: "5", l: "high-score white spaces", s: "composite ≥ 78" },
              { n: "4", l: "modelled ventures", s: "priced end-to-end" },
              { n: "1", l: "flagship pick", s: "highest risk-adj. return" },
            ].map((x, i, arr) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div className="tnum" style={{ fontSize: 30, fontWeight: 780, color: i === arr.length - 1 ? "var(--gold-2)" : "var(--ink)" }}>{x.n}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{x.l}</div>
                  <div className="xsmall muted">{x.s}</div>
                </div>
                {i < arr.length - 1 ? <div className="arrow" style={{ fontSize: 20 }}>→</div> : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* recommendation */}
        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
          <div className="card pad-lg" style={{ background: "linear-gradient(160deg,#1a1408,#0b0f17)", border: "1px solid var(--gold-line)" }}>
            <div className="eyebrow">Recommended flagship</div>
            <h2 style={{ fontSize: 26, margin: "8px 0" }}>{flagship.emoji} {flagship.whitespace.split(" (")[0]}</h2>
            <div className="flow" style={{ marginBottom: 12 }}>
              <Chip kind="gold">{flagship.name}</Chip><span className="arrow">→</span>
              <Chip kind="teal">{flagship.target}</Chip><span className="arrow">·</span>
              <Chip kind="green">score {composite(flagship.score)}</Chip>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{flagship.whyGap}</p>
            <Reason>
              <b>Why it wins the ranking:</b> highest margin-uplift ({flagship.marginUplift}) meets a real supply base India already
              owns — this is forward-integration, not a cold start. Target market: <b className="teal-t">{flagship.target}</b> — {flagship.targetWhy}
            </Reason>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={() => go("financial")}>See it priced →</button>
          </div>

          <div className="card pad-lg">
            <div className="card-h"><h3>The four modelled ventures</h3><span className="sub">base-case snapshot</span></div>
            <table className="tbl">
              <thead><tr><th>Venture</th><th className="num">Capex</th><th className="num">IRR</th><th className="num">Payback</th></tr></thead>
              <tbody>
                {ventureRuns.map(({ v, m }) => (
                  <tr key={v.id} style={{ cursor: "pointer" }} onClick={() => go("financial")}>
                    <td><span style={{ marginRight: 6 }}>{v.emoji}</span><b>{v.name.split(" →")[0]}</b></td>
                    <td className="num">{m.peakFundingCr.toFixed(0)}</td>
                    <td className="num green-t">{m.irr ? `${(m.irr * 100).toFixed(0)}%` : "n/m"}</td>
                    <td className="num">{m.paybackYr ? `Y${m.paybackYr}` : ">5y"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="xsmall muted" style={{ marginTop: 8 }}>Capital = peak funding need (₹ Cr). IRR includes a 3× EBITDA terminal value. Click any row to model it.</div>
          </div>
        </div>

        {/* risk matrix */}
        <div className="spacer" />
        <div className="card pad-lg">
          <div className="card-h"><h3>Risk register &amp; mitigations</h3><span className="sub">what breaks the thesis — and the hedge</span></div>
          <table className="tbl">
            <thead><tr><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Mitigation</th></tr></thead>
            <tbody>
              {RISK_MATRIX.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, width: "22%" }}>{r.risk}</td>
                  <td><Chip kind={r.likelihood === "High" ? "red" : "gold"}>{r.likelihood}</Chip></td>
                  <td><Chip kind={r.impact === "High" ? "red" : "gold"}>{r.impact}</Chip></td>
                  <td className="small muted" style={{ width: "48%" }}>{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
