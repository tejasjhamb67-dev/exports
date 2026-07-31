"use client";
import React, { useState, useMemo } from "react";
import IndiaMap from "@/components/IndiaMap";
import WorldMap from "@/components/WorldMap";
import { KPI, Chip, Reason, LineChart } from "@/components/ui";
import { runModel } from "@/lib/ventures";
import { FX } from "@/lib/data";
import { crShort } from "@/lib/util";
import {
  HS_NODES, HS2, HS_META, HS_SECTIONS, HSNode, Tier, TIER_META,
  childrenOf, supplyHighlight, demandHighlight, supplyValueUsdM, supplyShare,
  destValueUsdM, usdM, usdB, hsVenture, hsDrivers,
} from "@/lib/hs";

type SortKey = "india" | "global" | "score" | "cagr";
const SORTS: { k: SortKey; label: string }[] = [
  { k: "india", label: "India export" },
  { k: "global", label: "Global demand" },
  { k: "score", label: "White-space score" },
  { k: "cagr", label: "Demand growth" },
];
type LevelKey = "all" | "2" | "4";

function TierBadge({ t, score }: { t: Tier; score: number }) {
  const m = TIER_META[t];
  return <span className="chip" style={{ background: m.bg, borderColor: m.line, color: m.color, fontWeight: 700, whiteSpace: "nowrap" }}>{t} · {score}</span>;
}
function ProvTag({ label, val }: { label: string; val: string }) {
  const gold = val === "official";
  return (
    <span className="chip" style={{ background: gold ? "var(--gold-dim)" : "rgba(120,130,145,0.08)", borderColor: gold ? "var(--gold-line)" : "var(--line-2)", color: gold ? "var(--gold)" : "var(--ink-3)", fontSize: 10.5 }}>
      {label}: {val}
    </span>
  );
}

// ---- policy / tariff / FTA panel (ENGINEERING_PLAN §1 policy layer) ----------
function PolicyPanel({ n }: { n: HSNode }) {
  const p = n.policy;
  return (
    <div className="card pad-lg">
      <div className="card-h"><h3>Policy, tariffs & FTAs</h3><span className="sub">estimate</span></div>
      <div className="grid g3" style={{ marginBottom: 6 }}>
        <KPI label="India RoDTEP" val={`${p.rodtepPct}%`} sub="+ duty drawback on inputs" />
        <KPI label="Active FTAs" val={String(p.ftas.length)} sub="preferential market access" />
        <KPI label="AD / trade flags" val={String(p.adFlags.length)} sub={p.adFlags.length ? "watch these" : "none flagged"} />
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Applied MFN tariff in key markets</div>
      <table className="tbl" style={{ marginTop: 6 }}>
        <thead><tr><th>Market</th><th className="num">Import duty band</th></tr></thead>
        <tbody>
          {p.tariffs.map((t) => (
            <tr key={t.market}><td style={{ fontWeight: 600 }}>{t.market}</td>
              <td className="num" style={{ color: /0%|CEPA|FTA/.test(t.mfn) ? "var(--green)" : /§232|AD|safeguard/.test(t.mfn) ? "var(--red)" : "var(--ink-2)" }}>{t.mfn}</td></tr>
          ))}
        </tbody>
      </table>
      {p.ftas.length ? (
        <>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>FTAs that zero or cut the tariff</div>
          <div className="tag-row" style={{ marginTop: 6 }}>{p.ftas.map((f) => <Chip key={f} kind="green">{f}</Chip>)}</div>
        </>
      ) : null}
      {p.adFlags.length ? (
        <>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Anti-dumping / trade-defence watch</div>
          {p.adFlags.map((f) => <div key={f} style={{ fontSize: 12.5, display: "flex", gap: 8, marginTop: 6 }}><span className="red-t">▼</span>{f}</div>)}
        </>
      ) : null}
    </div>
  );
}

// ---- how-to-start pack: reuses the runModel engine (plan §1) ------------------
function HowToStart({ n }: { n: HSNode }) {
  const v = useMemo(() => hsVenture(n), [n]);
  const dr = useMemo(() => hsDrivers(n), [n]);
  const e = n.econ;
  // interactive drivers (plan §2: the interactive financial model in-place)
  const [price, setPrice] = useState(dr.price[1]);
  const [util, setUtil] = useState(70);
  const cost = dr.cost[1];
  const live = useMemo(() => runModel(v as any, { price, rawCost: cost, util }, FX), [v, price, util, cost]);
  const bear = useMemo(() => runModel(v as any, { price: dr.price[0], rawCost: dr.cost[2], util: 55 }, FX), [v, dr]);
  const bull = useMemo(() => runModel(v as any, { price: dr.price[2], rawCost: dr.cost[0], util: 88 }, FX), [v, dr]);
  const irr = (r: number | null) => (r == null ? "n/m" : `${(r * 100).toFixed(0)}%`);
  const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const contribPct = (((price - cost) / price) * 100).toFixed(0);
  return (
    <div className="card pad-lg">
      <div className="card-h"><h3>How to start — capex, certs & the live model</h3><span className="sub">estimate · drag the drivers</span></div>
      <div style={{ marginBottom: 8, fontSize: 12.5 }}>
        <span className="muted">Recommended entry:</span> <b className="gold-t">{e.entry}</b>
        <span className="muted"> · unit basis {e.unit}, ~{e.grossPct}% base contribution</span>
      </div>

      {/* interactive drivers */}
      <div className="grid g2" style={{ gap: 16, marginBottom: 4 }}>
        <div className="slider-row">
          <div className="lab"><span>Realised price</span><span className="v">${money(price)} /{e.unit}</span></div>
          <input type="range" min={dr.price[0]} max={dr.price[2]} step={(dr.price[2] - dr.price[0]) / 40} value={price}
            style={{ ["--pct" as any]: `${((price - dr.price[0]) / (dr.price[2] - dr.price[0])) * 100}%` }}
            onChange={(ev) => setPrice(+parseFloat(ev.target.value).toFixed(2))} />
        </div>
        <div className="slider-row">
          <div className="lab"><span>Capacity utilisation</span><span className="v">{util}%</span></div>
          <input type="range" min={45} max={92} step={1} value={util}
            style={{ ["--pct" as any]: `${((util - 45) / (92 - 45)) * 100}%` }}
            onChange={(ev) => setUtil(+ev.target.value)} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 11.5, margin: "2px 0 10px" }}>
        <span className="muted">Contribution <b className="gold-t">{contribPct}%</b></span>
        <span className="muted">Break-even util <b style={{ color: live.breakevenUtilPct < util ? "var(--green)" : "var(--red)" }}>{live.breakevenUtilPct}%</b></span>
        <span className="muted">vs base US${money(dr.price[1])}</span>
      </div>

      <div className="grid g4" style={{ marginBottom: 6 }}>
        <KPI label="Capital required" val={live.peakFundingCr.toFixed(0)} unit="₹Cr" sub="peak funding need" />
        <KPI label="IRR (5-yr, w/ exit)" val={irr(live.irr)} sub={`bear ${irr(bear.irr)} · bull ${irr(bull.irr)}`} />
        <KPI label="Payback" val={live.paybackYr ? `Y${live.paybackYr}` : ">5y"} sub="cum. cash turns positive" />
        <KPI label="Yr-5 revenue" val={crShort(live.y5RevenueCr).replace("₹", "")} unit="₹" sub={`EBITDA ~${live.steadyEbitdaMarginPct.toFixed(0)}%`} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1.15fr 1fr", gap: 14, marginTop: 10, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Cumulative cash — the J-curve</div>
          <LineChart w={520} h={190} labels={["Y1", "Y2", "Y3", "Y4", "Y5"]} fmtY={(x) => `${x.toFixed(0)}`}
            series={[bull.years.map((y) => y.cumCashCr), live.years.map((y) => y.cumCashCr), bear.years.map((y) => y.cumCashCr)]}
            colors={["rgba(23,137,90,0.5)", "var(--gold)", "rgba(195,61,49,0.5)"]} />
          <div className="xsmall muted">Bull / your scenario / bear · ₹Cr cumulative cash · terminal value 3× Yr-5 EBITDA</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Inception cost</div>
          <table className="tbl" style={{ marginTop: 4 }}><tbody>
            {v.capex.map((c: any, i: number) => <tr key={i}><td style={{ fontSize: 11.5 }}>{c.item}</td><td className="num" style={{ fontSize: 11.5 }}>{c.cr}</td></tr>)}
            <tr><td className="b">Total capex</td><td className="num b gold-t">{live.totalCapexCr.toFixed(1)}</td></tr>
          </tbody></table>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Key certifications</div>
          <div className="tag-row" style={{ marginTop: 6 }}>{e.certs.map((c) => <span key={c} className="pill-sm">{c}</span>)}</div>
        </div>
      </div>
      <div className="xsmall muted" style={{ marginTop: 8 }}>
        Defensible new-entrant build ({e.entry.toLowerCase()}); price/cost from published bands, FX ₹{FX}/US$, exit at 3× Yr-5 EBITDA.
        Drag price &amp; utilisation to stress the case; the <b>Financial Model</b> tab carries the full flagship models. Ranges for screening — not a quote.
      </div>
    </div>
  );
}

export default function Explore(_props: { go?: (t: string) => void }) {
  const [q, setQ] = useState("");
  const [chapter, setChapter] = useState<string>("");
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [level, setLevel] = useState<LevelKey>("all");
  const [sort, setSort] = useState<SortKey>("india");
  const [selCode, setSelCode] = useState<string | null>(null);
  // local pins so clicking a state/country zooms/highlights without side effects
  const [indiaSel, setIndiaSel] = useState<string | null>(null);
  const [worldSel, setWorldSel] = useState<string | null>(null);

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let r = HS_NODES.filter((n) => {
      if (chapter && n.hs2 !== chapter) return false;
      if (tier !== "all" && n.tier !== tier) return false;
      if (level !== "all" && String(n.level) !== level) return false;
      if (ql) {
        return n.code.startsWith(ql) || n.desc.toLowerCase().includes(ql);
      }
      return true;
    });
    r = r.sort((a, b) => {
      if (sort === "india") return b.indiaExportUsdM - a.indiaExportUsdM;
      if (sort === "global") return b.globalImportUsdB - a.globalImportUsdB;
      if (sort === "cagr") return b.cagrPct - a.cagrPct || b.score - a.score;
      return b.score - a.score || b.indiaExportUsdM - a.indiaExportUsdM;
    });
    return r;
  }, [q, chapter, tier, level, sort]);

  const sel = selCode ? HS_NODES.find((n) => n.code === selCode) ?? null : null;
  const shown = rows.slice(0, 240);

  return (
    <div className="page"><div className="wrap">
      <div className="eyebrow">Layer 05 · Explore — HS product universe</div>
      <h1 className="page-title">Pick any product, watch both maps repaint</h1>
      <p className="page-sub">
        The full HS-2 → HS-4 taxonomy ({HS_META.hs2} chapters · {HS_META.hs4} headings), joined to India's
        FY25 export value, origin-state clusters and destination markets. <b className="hl">Select a product</b> and the
        India map paints where it's made while the world map paints where it ships — hover either for that product's numbers.
      </p>

      <div className="grid g4" style={{ marginTop: 18 }}>
        <KPI label="HS chapters (HS-2)" val={String(HS_META.hs2)} sub="official WCO HS 2022 taxonomy" />
        <KPI label="HS headings (HS-4)" val={String(HS_META.hs4)} sub="curated to India's export chapters" />
        <KPI label="Prime white space" val={String(HS_NODES.filter((n) => n.tier === "A").length)} sub="Tier A rows (score ≥ 71)" />
        <KPI label="India goods exports" val="437" unit="US$B" sub="FY25 · Dept. of Commerce" />
      </div>

      {/* controls */}
      <div className="card" style={{ marginTop: 18, padding: 14 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search HS code or description (e.g. 3004, shrimp, jewellery, solar)…"
            style={{ flex: "1 1 320px", minWidth: 240, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--line-2)", background: "var(--bg-2)", fontSize: 13.5, color: "var(--ink)" }}
          />
          <select value={chapter} onChange={(e) => { setChapter(e.target.value); }} style={{ padding: "9px 10px", borderRadius: 8, border: "1px solid var(--line-2)", fontSize: 13, maxWidth: 260 }}>
            <option value="">All chapters</option>
            {HS_SECTIONS.map((s) => (
              <optgroup key={s.n} label={`${s.n} · ${s.title}`}>
                {HS2.filter((c) => s.chapters.includes(c.code)).map((c) => (
                  <option key={c.code} value={c.code}>{c.code} · {c.desc.length > 46 ? c.desc.slice(0, 44) + "…" : c.desc}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          <div className="seg">
            {(["all", "A", "B", "C"] as const).map((t) => (
              <button key={t} className={tier === t ? "on" : ""} onClick={() => setTier(t)}>{t === "all" ? "All tiers" : `Tier ${t}`}</button>
            ))}
          </div>
          <div className="seg">
            {(["all", "2", "4"] as const).map((l) => (
              <button key={l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>{l === "all" ? "HS-2 + HS-4" : `HS-${l}`}</button>
            ))}
          </div>
          <div className="seg">
            {SORTS.map((s) => (
              <button key={s.k} className={sort === s.k ? "on" : ""} onClick={() => setSort(s.k)}>{s.label}</button>
            ))}
          </div>
          <span className="xsmall muted" style={{ marginLeft: "auto" }}>{rows.length} rows{rows.length > shown.length ? ` · showing ${shown.length}` : ""}</span>
        </div>
      </div>

      {/* results table */}
      <div className="card" style={{ marginTop: 14, padding: 0, maxHeight: 360, overflow: "auto" }}>
        <table className="tbl" style={{ margin: 0 }}>
          <thead style={{ position: "sticky", top: 0, background: "var(--bg-2)", zIndex: 1 }}>
            <tr>
              <th style={{ width: 64 }}>HS</th><th>Description</th><th style={{ width: 60 }}>Tier</th>
              <th className="num" style={{ width: 92 }}>India $</th><th className="num" style={{ width: 96 }}>Global $</th><th className="num" style={{ width: 70 }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((n) => {
              const isSel = n.code === selCode;
              return (
                <tr key={n.code + n.level} onClick={() => { setSelCode(n.code); setIndiaSel(null); setWorldSel(null); }}
                  style={{ cursor: "pointer", background: isSel ? "var(--gold-dim)" : undefined }}>
                  <td className="mono b" style={{ fontSize: 12 }}>{n.code}<span className="xsmall muted" style={{ marginLeft: 4 }}>{n.level === 2 ? "ch" : ""}</span></td>
                  <td style={{ fontSize: 12.5 }}>{n.desc.length > 78 ? n.desc.slice(0, 76) + "…" : n.desc}</td>
                  <td><TierBadge t={n.tier} score={n.score} /></td>
                  <td className="num">{usdM(n.indiaExportUsdM)}</td>
                  <td className="num">{usdB(n.globalImportUsdB)}</td>
                  <td className="num">{n.indiaSharePct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* selection → split view with linked maps */}
      {!sel ? (
        <div className="callout" style={{ marginTop: 16 }}>
          <span className="small">Select any row above to load its supply and demand maps. Figures are screening-grade estimates; the HS taxonomy is official.</span>
        </div>
      ) : (
        <div style={{ marginTop: 18, animation: "fadeUp 0.35s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="flow small" style={{ marginBottom: 6 }}>
                <span className="muted mono">{sel.section} · {sel.sectionTitle}</span><span className="arrow">/</span>
                <span className="muted mono">HS {sel.hs2}</span>{sel.level === 4 ? <><span className="arrow">/</span><span className="gold-t b mono">HS {sel.code}</span></> : null}
              </div>
              <h2 style={{ fontSize: 22, letterSpacing: "-0.01em", maxWidth: 720 }}>{sel.desc}</h2>
              <div className="flow" style={{ marginTop: 8, gap: 8, flexWrap: "wrap" }}>
                <TierBadge t={sel.tier} score={sel.score} />
                <Chip>{TIER_META[sel.tier].label}</Chip>
                <Chip kind="teal">TAM {usdB(sel.globalImportUsdB)}</Chip>
                <Chip kind="green">{sel.cagrPct}% CAGR</Chip>
              </div>
            </div>
            <button className="btn" onClick={() => setSelCode(null)}>← clear selection</button>
          </div>

          <div className="grid g4" style={{ marginTop: 14 }}>
            <KPI label="India export (FY25)" val={usdM(sel.indiaExportUsdM).replace("US$", "")} sub="estimate · DGCIS-scale" />
            <KPI label="World import" val={usdB(sel.globalImportUsdB).replace("US$", "")} sub="estimate" />
            <KPI label="India's share" val={`${sel.indiaSharePct}%`} sub="of world imports (est.)" />
            <KPI label="Top origin state" val={sel.supplyStates[0]?.state ?? "—"} sub={`${sel.supplyStates[0]?.sharePct ?? 0}% of India supply (derived)`} />
          </div>

          <div className="tag-row" style={{ marginTop: 12 }}>
            <ProvTag label="Taxonomy" val={sel.provenance.taxonomy} />
            <ProvTag label="Figures" val={sel.provenance.figures} />
            <ProvTag label="State splits" val={sel.provenance.splits} />
            {sel.level === 4 ? <span className="xsmall muted" style={{ alignSelf: "center" }}>HS-4 origin-state split inherits its chapter (India does not publish it at HS-4)</span> : null}
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, alignItems: "start" }}>
            {/* SUPPLY */}
            <div className="card pad-lg">
              <div className="card-h"><h3>Supply — where India makes it</h3><span className="sub">origin states</span></div>
              <IndiaMap
                selected={indiaSel} onSelect={setIndiaSel}
                highlight={supplyHighlight(sel)}
                hoverRender={(state) => {
                  const share = supplyShare(sel, state);
                  if (!share) return <><h4>{state === "Delhi" ? "Delhi–NCR" : state}</h4><div className="tt-row"><span>Not a lead origin</span><span>—</span></div></>;
                  return (
                    <>
                      <h4>{state === "Delhi" ? "Delhi–NCR" : state}</h4>
                      <div className="tt-row"><span>Share of India supply</span><span style={{ color: "var(--gold-2)" }}>{share}%</span></div>
                      <div className="tt-row"><span>Est. export from here</span><span>{usdM(supplyValueUsdM(sel, state))}</span></div>
                      <div style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-4)" }}>derived split · {sel.desc.slice(0, 34)}…</div>
                    </>
                  );
                }}
              />
              <table className="tbl" style={{ marginTop: 10 }}>
                <thead><tr><th>State</th><th className="num">Share</th><th className="num">Est. export</th></tr></thead>
                <tbody>
                  {sel.supplyStates.slice(0, 6).map((s) => (
                    <tr key={s.state}><td style={{ fontWeight: 600 }}>{s.state === "Delhi" ? "Delhi–NCR" : s.state}</td>
                      <td className="num">{s.sharePct}%</td><td className="num">{usdM(sel.indiaExportUsdM * s.sharePct / 100)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DEMAND */}
            <div className="card pad-lg">
              <div className="card-h"><h3>Demand — where it ships</h3><span className="sub">destination markets</span></div>
              <WorldMap
                selected={worldSel} onSelect={setWorldSel}
                highlight={demandHighlight(sel)}
                hoverRender={(country) => {
                  const v = destValueUsdM(sel, country);
                  if (!v) return <><h4>{country}</h4><div className="tt-row"><span>Not a lead destination</span><span>—</span></div></>;
                  return (
                    <>
                      <h4>{country}</h4>
                      <div className="tt-row"><span>India exports here</span><span style={{ color: "var(--teal-2)" }}>{usdM(v)}</span></div>
                      <div className="tt-row"><span>Of India's total</span><span>{Math.round(v / sel.indiaExportUsdM * 100)}%</span></div>
                      <div style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-4)" }}>estimate · {sel.desc.slice(0, 34)}…</div>
                    </>
                  );
                }}
              />
              <table className="tbl" style={{ marginTop: 10 }}>
                <thead><tr><th>Market</th><th className="num">India export</th><th className="num">Of total</th></tr></thead>
                <tbody>
                  {sel.destinations.slice(0, 6).map((dst) => (
                    <tr key={dst.country}><td style={{ fontWeight: 600 }}>{dst.country}</td>
                      <td className="num">{usdM(dst.usdM)}</td><td className="num">{Math.round(dst.usdM / sel.indiaExportUsdM * 100)}%</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, alignItems: "start" }}>
            <PolicyPanel n={sel} />
            <HowToStart key={sel.code} n={sel} />
          </div>

          {sel.level === 2 && childrenOf(sel.code).length ? (
            <div style={{ marginTop: 16 }}>
              <div className="section-title" style={{ fontSize: 15, marginBottom: 8 }}>Drill into HS-4 headings under chapter {sel.code}</div>
              <div className="tag-row">
                {childrenOf(sel.code).map((c) => (
                  <span key={c.code} className="pill-sm" style={{ cursor: "pointer" }} onClick={() => { setSelCode(c.code); setIndiaSel(null); setWorldSel(null); }}>
                    {c.code} · {c.desc.length > 40 ? c.desc.slice(0, 38) + "…" : c.desc}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <Reason>
            Origin-state shares are a <b>derived</b> cluster model (India publishes export value by HS code, but not by
            origin state at HS-4 — so HS-4 inherits its chapter's split). Destination and value figures are
            screening-grade <b>estimates</b>. Only the HS nomenclature is an <b>official</b> WCO figure.
          </Reason>
        </div>
      )}

      <div className="spacer" />
      <div className="src">
        HS taxonomy: WCO Harmonized System 2022. India value / global demand / CAGR / share: screening-grade estimates
        at DGCIS order-of-magnitude. State origin splits: derived cluster model (HS-4 inherits chapter). Generated {HS_META.generated}.
        No estimate is presented as an official statistic.
      </div>
    </div></div>
  );
}
