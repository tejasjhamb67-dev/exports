"use client";
import React, { useState, useMemo } from "react";
import { VENTURES, runModel, Assump } from "@/lib/ventures";
import { FX } from "@/lib/data";
import { KPI, Chip, Reason, LineChart, Columns, RangeBar } from "@/components/ui";
import { crFull, crShort, clamp } from "@/lib/util";

export default function Financial() {
  const [vid, setVid] = useState(VENTURES[0].id);
  const v = VENTURES.find((x) => x.id === vid)!;
  const [a, setA] = useState<Assump>(() => ({ price: v.drivers[0].base, rawCost: v.drivers[1].base, util: v.drivers[2].base }));
  const [tip, setTip] = useState<string | null>(null);

  // reset assumptions when venture changes
  React.useEffect(() => {
    setA({ price: v.drivers[0].base, rawCost: v.drivers[1].base, util: v.drivers[2].base });
  }, [vid]);

  const live = useMemo(() => runModel(v, a, FX), [v, a]);
  // scenario extremes for ranges
  const bear = useMemo(() => runModel(v, { price: v.drivers[0].min, rawCost: v.drivers[1].max, util: v.drivers[2].min }, FX), [v]);
  const bull = useMemo(() => runModel(v, { price: v.drivers[0].max, rawCost: v.drivers[1].min, util: v.drivers[2].max }, FX), [v]);
  const base = useMemo(() => runModel(v, { price: v.drivers[0].base, rawCost: v.drivers[1].base, util: v.drivers[2].base }, FX), [v]);

  const fmtIRR = (r: number | null) => (r == null ? "n/m" : `${(r * 100).toFixed(0)}%`);
  const contribution = ((a.price - a.rawCost) / a.price) * 100;

  function setDriver(key: string, val: number) { setA((p) => ({ ...p, [key]: val })); }

  const cumBase = base.years.map((y) => y.cumCashCr);
  const cumBear = bear.years.map((y) => y.cumCashCr);
  const cumBull = bull.years.map((y) => y.cumCashCr);
  const cumLive = live.years.map((y) => y.cumCashCr);

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 06 · Financial feasibility</div>
        <h1 className="page-title">The model, live</h1>
        <p className="page-sub">
          Not a static spreadsheet — a working model. Move the drivers; capex, IRR, payback and the cash curve recompute.
          Every default is a defensible mid-point; the <b className="hl">shaded band is the bear→bull range</b> from the driver extremes.
          All figures ₹ Cr, USD→INR at ₹{FX}.
        </p>

        {/* venture switcher */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          {VENTURES.map((x) => (
            <button key={x.id} onClick={() => setVid(x.id)} className={`tab ${x.id === vid ? "active" : ""}`} style={{ border: `1px solid ${x.id === vid ? "var(--gold-line)" : "var(--line)"}`, fontSize: 13, padding: "9px 14px" }}>
              <span style={{ fontSize: 16 }}>{x.emoji}</span> {x.name}
            </button>
          ))}
        </div>

        <div className="spacer" />
        <Reason><b>{v.emoji} {v.name}:</b> {v.thesisLine} <span className="muted">— {v.entrantFit}</span></Reason>

        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "340px 1fr", alignItems: "start" }}>
          {/* ---- CONTROLS ---- */}
          <div className="card pad-lg">
            <div className="card-h"><h3>Drivers</h3><span className="sub">drag to model</span></div>
            {v.drivers.map((dr) => {
              const val = (a as any)[dr.key] as number;
              const pctPos = ((val - dr.min) / (dr.max - dr.min)) * 100;
              return (
                <div className="slider-row" key={dr.key}>
                  <div className="lab">
                    <span onMouseEnter={() => setTip(dr.key)} onMouseLeave={() => setTip(null)} style={{ cursor: "help", borderBottom: "1px dotted var(--ink-4)" }}>{dr.label}</span>
                    <span className="v">{val}{dr.unit && dr.unit !== "%" ? " " + dr.unit : dr.unit}</span>
                  </div>
                  <input type="range" min={dr.min} max={dr.max} step={dr.step} value={val}
                    style={{ ["--pct" as any]: `${pctPos}%` }}
                    onChange={(e) => setDriver(dr.key, parseFloat(e.target.value))} />
                  {tip === dr.key ? <div className="xsmall muted" style={{ marginTop: 6, lineHeight: 1.4, background: "var(--panel-2)", padding: "7px 9px", borderRadius: 7 }}>{dr.basis}</div> : null}
                </div>
              );
            })}

            <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--panel-2)", borderRadius: 9, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span className="muted">Contribution margin / {v.unitName}</span>
                <span className="tnum gold-t b">{contribution.toFixed(0)}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 5 }}>
                <span className="muted">Installed capacity</span>
                <span className="tnum b">{(v.capacityUnitsPerYr / 1e6).toFixed(2)}M {v.unitName}/yr</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 5 }}>
                <span className="muted">Break-even utilisation</span>
                <span className="tnum b" style={{ color: live.breakevenUtilPct < a.util ? "var(--green)" : "var(--red)" }}>{live.breakevenUtilPct}%</span>
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Inception cost (capex)</div>
            <div style={{ marginTop: 10 }}>
              <Columns w={300} h={150} color="var(--gold)" fmtY={(x) => `${x.toFixed(0)}`}
                data={v.capex.map((c) => ({ label: c.item.split(" ")[0].slice(0, 6), value: c.cr }))} />
            </div>
            <table className="tbl" style={{ marginTop: 4 }}>
              <tbody>
                {v.capex.map((c, i) => (
                  <tr key={i}><td style={{ fontSize: 12 }}>{c.item}</td><td className="num" style={{ fontSize: 12 }}>{c.cr.toFixed(1)}</td></tr>
                ))}
                <tr><td style={{ fontWeight: 700 }}>Total inception</td><td className="num" style={{ fontWeight: 700, color: "var(--gold-2)" }}>{live.totalCapexCr.toFixed(1)}</td></tr>
              </tbody>
            </table>
            <div className="xsmall muted" style={{ marginTop: 8 }}>Steady-state fixed opex ≈ {crFull(v.fixedOpexCr)}/yr. {v.fixedOpexNote}</div>
          </div>

          {/* ---- OUTPUTS ---- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid g4">
              <KPI label="Capital required" val={live.peakFundingCr.toFixed(0)} unit="₹Cr" sub="peak funding need (capex + max cash drawdown)" />
              <KPI label="IRR (5-yr, w/ exit)" val={fmtIRR(live.irr)} sub={`bear ${fmtIRR(bear.irr)} · bull ${fmtIRR(bull.irr)}`} tone="green" />
              <KPI label="Payback" val={live.paybackYr ? `Y${live.paybackYr}` : ">5y"} sub="cumulative cash turns positive" tone="teal" />
              <KPI label="Yr-5 revenue" val={crShort(live.y5RevenueCr).replace("₹", "")} unit="₹" sub={`EBITDA margin ~${live.steadyEbitdaMarginPct.toFixed(0)}%`} tone="violet" />
            </div>

            {/* cash curve */}
            <div className="card pad-lg">
              <div className="card-h"><h3>Cumulative cash — the J-curve</h3><span className="sub">₹ Cr · live vs bear–bull band</span></div>
              <div style={{ position: "relative" }}>
                <LineChart w={620} h={230} labels={["Y1", "Y2", "Y3", "Y4", "Y5"]}
                  fmtY={(x) => `${x >= 0 ? "" : "-"}${Math.abs(x) >= 100 ? (Math.abs(x) / 1).toFixed(0) : Math.abs(x).toFixed(0)}`}
                  series={[cumBull, cumLive, cumBear]}
                  colors={["rgba(71,207,143,0.5)", "#eab24a", "rgba(240,100,95,0.5)"]} />
              </div>
              <div className="legend" style={{ marginTop: 6 }}>
                <span className="li"><span className="dot" style={{ background: "#47cf8f" }} /> bull</span>
                <span className="li"><span className="dot" style={{ background: "#eab24a" }} /> your scenario</span>
                <span className="li"><span className="dot" style={{ background: "#f0645f" }} /> bear</span>
                <div style={{ flex: 1 }} />
                <span className="muted xsmall">Terminal value in IRR assumes 3× Yr-5 EBITDA trade sale.</span>
              </div>
            </div>

            {/* P&L */}
            <div className="card pad-lg">
              <div className="card-h"><h3>5-year P&amp;L — your scenario</h3><span className="sub">₹ Cr</span></div>
              <table className="tbl">
                <thead><tr><th>Year</th><th className="num">Volume ({v.unitName})</th><th className="num">Revenue</th><th className="num">Gross</th><th className="num">EBITDA</th><th className="num">Cum. cash</th></tr></thead>
                <tbody>
                  {live.years.map((y) => (
                    <tr key={y.year}>
                      <td className="b">Y{y.year}</td>
                      <td className="num">{(y.volume / 1000).toFixed(0)}K</td>
                      <td className="num">{y.revenueCr.toFixed(1)}</td>
                      <td className="num">{y.grossCr.toFixed(1)}</td>
                      <td className="num" style={{ color: y.ebitdaCr >= 0 ? "var(--green)" : "var(--red)" }}>{y.ebitdaCr.toFixed(1)}</td>
                      <td className="num" style={{ color: y.cumCashCr >= 0 ? "var(--green)" : "var(--red)" }}>{y.cumCashCr.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* scenario ranges */}
            <div className="grid g3">
              <div className="card">
                <div className="card-h"><h3>IRR range</h3></div>
                <RangeBar min={-20} max={80} lo={Math.round((bear.irr ?? -0.2) * 100)} base={Math.round((base.irr ?? 0) * 100)} hi={Math.round((bull.irr ?? 0.8) * 100)} unit="%" color="var(--green)" />
              </div>
              <div className="card">
                <div className="card-h"><h3>NPV @15% range</h3></div>
                <RangeBar min={Math.min(0, bear.npvCr)} max={bull.npvCr} lo={Math.round(bear.npvCr)} base={Math.round(base.npvCr)} hi={Math.round(bull.npvCr)} unit=" Cr" color="var(--gold)" />
              </div>
              <div className="card">
                <div className="card-h"><h3>Capital at risk</h3></div>
                <RangeBar min={0} max={Math.round(bear.peakFundingCr * 1.1)} lo={Math.round(bull.peakFundingCr)} base={Math.round(base.peakFundingCr)} hi={Math.round(bear.peakFundingCr)} unit=" Cr" color="var(--red)" />
              </div>
            </div>

            {/* incentives + risks */}
            <div className="grid g2">
              <div className="card">
                <div className="card-h"><h3>Government tailwinds</h3></div>
                <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{v.incentives}</p>
              </div>
              <div className="card">
                <div className="card-h"><h3>Key risks to the model</h3></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {v.keyRisks.map((r, i) => <div key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", display: "flex", gap: 8 }}><span className="red-t">▸</span> {r}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="spacer" />
        <div className="src">
          Model basis: capex is a bottom-up equipment + working-capital build (per line above). Revenue = capacity × ramp × utilisation × price.
          EBITDA nets steady-state fixed opex. Prices, costs and capacities from published realised-price bands, sector-council benchmarks and DGFT incentive schedules — carried as ranges. Illustrative for feasibility screening, not investment advice.
        </div>
      </div>
    </div>
  );
}
