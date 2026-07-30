"use client";
import React, { useState, useMemo } from "react";
import { CATALOG, TIERS, productVenture, productDrivers, Product as Prod } from "@/lib/catalog";
import { runModel } from "@/lib/ventures";
import { FX } from "@/lib/data";
import { KPI, Chip, Reason, LineChart } from "@/components/ui";
import { crShort } from "@/lib/util";

const tierRank = { A: 0, B: 1, C: 2 } as const;

function TierBadge({ t }: { t: "A" | "B" | "C" }) {
  const m = TIERS[t];
  return <span className="chip" style={{ background: m.bg, borderColor: m.line, color: m.color, fontWeight: 700 }}>Tier {t} · {m.label}</span>;
}

// ---- per-product GTM + financial model ----
function ProductWorkbench({ p }: { p: Prod }) {
  const v = useMemo(() => productVenture(p), [p]);
  const dr = useMemo(() => productDrivers(p), [p]);
  const [price, setPrice] = useState(dr.price[1]);
  const [util, setUtil] = useState(dr.util[1]);
  const cost = dr.cost[1];
  const live = useMemo(() => runModel(v as any, { price, rawCost: cost, util }, FX), [v, price, util, cost]);
  const bear = useMemo(() => runModel(v as any, { price: dr.price[0], rawCost: dr.cost[2], util: dr.util[0] }, FX), [v]);
  const bull = useMemo(() => runModel(v as any, { price: dr.price[2], rawCost: dr.cost[0], util: dr.util[2] }, FX), [v]);
  const irr = (r: number | null) => (r == null ? "n/m" : `${(r * 100).toFixed(0)}%`);
  const entry = p.capexCr < 30 ? "Merchant → private-label converter" : p.capexCr < 70 ? "Private-label converter" : "Converter + in-market JV";

  return (
    <div>
      <div className="grid g4" style={{ marginTop: 4 }}>
        <KPI label="Capital required" val={live.peakFundingCr.toFixed(0)} unit="₹Cr" sub="peak funding need" />
        <KPI label="IRR (5-yr, w/ exit)" val={irr(live.irr)} sub={`bear ${irr(bear.irr)} · bull ${irr(bull.irr)}`} />
        <KPI label="Payback" val={live.paybackYr ? `Y${live.paybackYr}` : ">5y"} sub="cum. cash turns positive" />
        <KPI label="Yr-5 revenue" val={crShort(live.y5RevenueCr).replace("₹", "")} unit="₹" sub={`EBITDA ~${live.steadyEbitdaMarginPct.toFixed(0)}%`} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "300px 1fr", marginTop: 14, alignItems: "start" }}>
        <div className="card">
          <div className="card-h"><h3>Your assumptions</h3><span className="sub">drag</span></div>
          <div className="slider-row">
            <div className="lab"><span>Realised price</span><span className="v">${price} /{p.unit}</span></div>
            <input type="range" min={dr.price[0]} max={dr.price[2]} step={(dr.price[2] - dr.price[0]) / 40} value={price}
              style={{ ["--pct" as any]: `${((price - dr.price[0]) / (dr.price[2] - dr.price[0])) * 100}%` }}
              onChange={(e) => setPrice(+parseFloat(e.target.value).toFixed(2))} />
          </div>
          <div className="slider-row">
            <div className="lab"><span>Capacity utilisation</span><span className="v">{util}%</span></div>
            <input type="range" min={dr.util[0]} max={dr.util[2]} step={1} value={util}
              style={{ ["--pct" as any]: `${((util - dr.util[0]) / (dr.util[2] - dr.util[0])) * 100}%` }}
              onChange={(e) => setUtil(+e.target.value)} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span className="muted">Contribution margin</span><span className="b gold-t">{(((price - cost) / price) * 100).toFixed(0)}%</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span className="muted">Break-even util.</span><span className="b" style={{ color: live.breakevenUtilPct < util ? "var(--green)" : "var(--red)" }}>{live.breakevenUtilPct}%</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span className="muted">Capacity</span><span className="b">{(p.capacity >= 1000 ? (p.capacity / 1000).toFixed(0) + "K" : p.capacity)} {p.unit}/yr</span></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Inception cost</div>
          <table className="tbl" style={{ marginTop: 4 }}><tbody>
            {v.capex.map((c: any, i: number) => <tr key={i}><td style={{ fontSize: 11.5 }}>{c.item}</td><td className="num" style={{ fontSize: 11.5 }}>{c.cr}</td></tr>)}
            <tr><td className="b">Total</td><td className="num b gold-t">{live.totalCapexCr.toFixed(1)}</td></tr>
          </tbody></table>
        </div>

        <div className="card">
          <div className="card-h"><h3>Cumulative cash — the J-curve</h3><span className="sub">₹ Cr · your scenario vs bear–bull</span></div>
          <LineChart w={640} h={220} labels={["Y1", "Y2", "Y3", "Y4", "Y5"]} fmtY={(x) => `${x.toFixed(0)}`}
            series={[bull.years.map((y) => y.cumCashCr), live.years.map((y) => y.cumCashCr), bear.years.map((y) => y.cumCashCr)]}
            colors={["rgba(23,137,90,0.5)", "var(--gold)", "rgba(195,61,49,0.5)"]} />
          <table className="tbl" style={{ marginTop: 6 }}>
            <thead><tr><th>Yr</th><th className="num">Revenue</th><th className="num">EBITDA</th><th className="num">Cum. cash</th></tr></thead>
            <tbody>{live.years.map((y) => (
              <tr key={y.year}><td className="b">Y{y.year}</td><td className="num">{y.revenueCr.toFixed(1)}</td>
                <td className="num" style={{ color: y.ebitdaCr >= 0 ? "var(--green)" : "var(--red)" }}>{y.ebitdaCr.toFixed(1)}</td>
                <td className="num" style={{ color: y.cumCashCr >= 0 ? "var(--green)" : "var(--red)" }}>{y.cumCashCr.toFixed(1)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* GTM */}
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-h"><h3>Go-to-market for this product</h3></div>
          <div style={{ fontSize: 13 }}>
            <div style={{ marginBottom: 8 }}><span className="muted">Recommended entry:</span> <b className="gold-t">{entry}</b> <span className="muted">(from ₹{live.totalCapexCr.toFixed(0)}Cr capex intensity)</span></div>
            <div className="tag-row" style={{ marginBottom: 8 }}>
              <span className="pill-sm">1 · Anchor B2B off-take before capex</span>
              <span className="pill-sm">2 · Trade-council buyer meets</span>
              <span className="pill-sm">3 · In-market agent / JV</span>
              <span className="pill-sm">4 · Certification-led inbound</span>
            </div>
            <Reason><b>Sequence:</b> validate the corridor as a merchant → land one anchor buyer at a price clearing {(((price - cost) / price) * 100).toFixed(0)}% contribution → certify (HS {p.hs}) → build the line → ramp utilisation past break-even ({live.breakevenUtilPct}%).</Reason>
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Target markets &amp; why</h3></div>
          {p.targets.map((t, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 650, fontSize: 13.5 }}>{t.c}</div>
              <div className="small muted">{t.why}</div>
            </div>
          ))}
          <div className="xsmall muted" style={{ marginTop: 4 }}>Global market {p.gmkt} · {p.cagr} CAGR · India share {p.share}. HS {p.hs}.</div>
        </div>
      </div>
    </div>
  );
}

export default function Product(_props: { go?: (t: string) => void }) {
  const [indId, setIndId] = useState<string | null>(null);
  const [prodName, setProdName] = useState<string | null>(null);

  const ind = indId ? CATALOG.find((i) => i.id === indId)! : null;
  const product = useMemo(() => {
    if (!ind || !prodName) return null;
    for (const s of ind.subs) { const p = s.products.find((x) => x.name === prodName); if (p) return { p, sub: s.name }; }
    return null;
  }, [ind, prodName]);

  // Level 1 — industries
  if (!ind) {
    return (
      <div className="page"><div className="wrap">
        <div className="eyebrow">Layer 04 · Product identification</div>
        <h1 className="page-title">The niche scanner</h1>
        <p className="page-sub">This is a <b className="hl">scoping tool, not a recommendation</b>. Drill from industry → sub-industry → a tier-ranked product list → sub-products. Pick <b>whichever</b> product you want and it builds that product's GTM and financial model. The tiers rank opportunity; the decision is yours.</p>
        <div className="grid g3" style={{ marginTop: 20 }}>
          {CATALOG.map((i) => {
            const prods = i.subs.flatMap((s) => s.products);
            const tierCount = { A: 0, B: 0, C: 0 } as any;
            prods.forEach((p) => tierCount[p.tier]++);
            return (
              <div key={i.id} className="card" style={{ cursor: "pointer" }} onClick={() => setIndId(i.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{i.emoji}</span>
                  <div style={{ fontWeight: 680, fontSize: 15 }}>{i.name}</div>
                </div>
                <div className="small muted" style={{ marginTop: 8, minHeight: 54, lineHeight: 1.45 }}>{i.note}</div>
                <div className="tag-row" style={{ marginTop: 10 }}>
                  <span className="pill-sm">{i.subs.length} sub-industries</span>
                  <span className="pill-sm">{prods.length} products</span>
                  {tierCount.A ? <span className="chip" style={{ background: "var(--gold-dim)", borderColor: "var(--gold-line)", color: "var(--gold)", fontWeight: 700 }}>{tierCount.A} × Tier A</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div></div>
    );
  }

  // Level 3 — product detail
  if (product) {
    const { p, sub } = product;
    return (
      <div className="page"><div className="wrap">
        <div className="flow small" style={{ marginBottom: 14 }}>
          <span className="muted" style={{ cursor: "pointer" }} onClick={() => { setIndId(null); setProdName(null); }}>All industries</span><span className="arrow">/</span>
          <span className="muted" style={{ cursor: "pointer" }} onClick={() => setProdName(null)}>{ind.emoji} {ind.name}</span><span className="arrow">/</span>
          <span className="muted">{sub}</span><span className="arrow">/</span><span className="gold-t b">{p.name}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{p.name}</h1>
            <div className="flow" style={{ marginTop: 8 }}><TierBadge t={p.tier} /><Chip>score {p.score}</Chip><Chip kind="teal">TAM {p.gmkt}</Chip><Chip kind="green">{p.cagr} CAGR</Chip></div>
          </div>
          <button className="btn" onClick={() => setProdName(null)}>← back to {ind.name}</button>
        </div>

        <div className="grid g2" style={{ marginTop: 16 }}>
          <div className="card"><div className="card-h"><h3 className="green-t">Advantages</h3></div>
            {p.pros.map((x, i) => <div key={i} style={{ fontSize: 13.5, display: "flex", gap: 8, marginBottom: 6 }}><span className="green-t">▲</span>{x}</div>)}
            <div style={{ marginTop: 8 }} className="tag-row">{p.subs.map((s) => <span key={s} className="pill-sm">{s}</span>)}</div>
            <div className="xsmall muted" style={{ marginTop: 6 }}>Sub-products under this niche</div>
          </div>
          <div className="card"><div className="card-h"><h3 className="red-t">Disadvantages / risks</h3></div>
            {p.cons.map((x, i) => <div key={i} style={{ fontSize: 13.5, display: "flex", gap: 8, marginBottom: 6 }}><span className="red-t">▼</span>{x}</div>)}
            <Reason>India's share of this global market today: <b>{p.share}</b>. The gap between that and demand is the opportunity.</Reason>
          </div>
        </div>

        <div className="section-gap" />
        <div className="eyebrow">You picked this one — here's the model</div>
        <div className="section-title" style={{ marginTop: 3, marginBottom: 14 }}>GTM &amp; financials · {p.name}</div>
        <ProductWorkbench p={p} />
        <div className="spacer" />
        <div className="src">Econ is a defensible new-entrant build (private-label converter): capex/opex bottom-up, price &amp; cost from published bands, terminal value 3× Yr-5 EBITDA. Ranges for screening, not a quote or investment advice.</div>
      </div></div>
    );
  }

  // Level 2 — sub-industries + tiered product lists
  return (
    <div className="page"><div className="wrap">
      <div className="flow small" style={{ marginBottom: 12 }}>
        <span className="muted" style={{ cursor: "pointer" }} onClick={() => setIndId(null)}>All industries</span><span className="arrow">/</span><span className="gold-t b">{ind.emoji} {ind.name}</span>
      </div>
      <h1 style={{ fontSize: 28 }}>{ind.emoji} {ind.name}</h1>
      <p className="page-sub" style={{ marginTop: 6 }}>{ind.note}</p>
      <div className="callout" style={{ marginTop: 14, marginBottom: 6 }}><span className="small">Products are tier-ranked (<b className="gold-t">A</b> = prime white space → <b>C</b> = commoditised). Click any product for its sub-products, GTM and financial model. You choose — nothing is pre-selected.</span></div>

      {ind.subs.map((s) => {
        const prods = [...s.products].sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || b.score - a.score);
        return (
          <div key={s.name} style={{ marginTop: 18 }}>
            <div className="section-title" style={{ fontSize: 16, marginBottom: 10 }}>{s.name}</div>
            <div className="grid g2">
              {prods.map((p) => {
                const m = TIERS[p.tier];
                return (
                  <div key={p.name} className="card" style={{ cursor: "pointer", borderLeft: `3px solid ${m.color}` }} onClick={() => setProdName(p.name)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ fontWeight: 660, fontSize: 14.5 }}>{p.name}</div>
                      <span className="chip" style={{ background: m.bg, borderColor: m.line, color: m.color, fontWeight: 700, whiteSpace: "nowrap" }}>{p.tier} · {p.score}</span>
                    </div>
                    <div className="small muted" style={{ marginTop: 6 }}>TAM {p.gmkt} · {p.cagr} · India {p.share}</div>
                    <div className="tag-row" style={{ marginTop: 8 }}>
                      {p.targets.slice(0, 2).map((t) => <span key={t.c} className="pill-sm">→ {t.c}</span>)}
                      <span className="pill-sm">{p.subs.length} sub-products</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div></div>
  );
}
