"use client";
import React, { useState, useMemo } from "react";
import IndiaMap from "@/components/IndiaMap";
import { STATE_DETAIL } from "@/lib/supply";
import { metaFor } from "@/lib/sectors";
import { crShort, crFull } from "@/lib/util";
import { KPI, BarList, Chip, Reason } from "@/components/ui";

export default function Mapping() {
  const [sel, setSel] = useState<string | null>(null);
  const d = sel ? (STATE_DETAIL as any)[sel] : null;

  const nation = useMemo(() => {
    let n = 0, rev = 0, mcap = 0;
    Object.values(STATE_DETAIL).forEach((s: any) => { n += s.n; rev += s.rev; mcap += s.mcap; });
    return { n, rev, mcap };
  }, []);

  // products a state exports, derived from its sector mix
  const stateProducts = useMemo(() => {
    if (!d) return [];
    const set = new Map<string, string>();
    d.topSectors.forEach((s: any) => metaFor(s.name).products.forEach((p) => set.set(p, s.name)));
    return [...set.entries()].slice(0, 8);
  }, [d]);
  const stateDest = useMemo(() => {
    if (!d) return [];
    const set = new Set<string>();
    d.topSectors.forEach((s: any) => metaFor(s.name).dest.forEach((x) => set.add(x)));
    return [...set].filter((x) => x !== "Domestic-led").slice(0, 6);
  }, [d]);

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">Layer 01 · Supply</div>
        <h1 className="page-title">The Supply Map — where India actually makes things</h1>
        <p className="page-sub">
          Every company in the Business Standard BS1000 carries an HQ city. We roll 1,000 listed companies up to their state,
          so this map is not a survey estimate — it is the summed revenue and market cap of real, named firms.
          <b className="hl"> Hover any state. Click to zoom into its cities, players and products.</b>
        </p>

        <div className="grid g4" style={{ marginTop: 20 }}>
          <KPI label="States with export-scale firms" val={String(Object.keys(STATE_DETAIL).length)} sub="of BS1000 listed universe" />
          <KPI label="Companies mapped" val={nation.n.toLocaleString("en-IN")} sub="96% of BS1000 geo-located" tone="teal" />
          <KPI label="Combined revenue" val={crShort(nation.rev).replace("₹", "")} unit="₹" sub="FY25, listed universe" tone="green" />
          <KPI label="Combined market cap" val={crShort(nation.mcap).replace("₹", "")} unit="₹" sub="listed universe" tone="violet" />
        </div>

        <div className="spacer" />
        <div className="grid" style={{ gridTemplateColumns: "1.15fr 1fr", alignItems: "start" }}>
          <div className="card pad-lg">
            <IndiaMap onSelect={setSel} selected={sel} />
            <div className="legend" style={{ marginTop: 12 }}>
              <span>Colour = supply intensity (darker → higher)</span>
              <div style={{ flex: 1 }} />
              <div style={{ width: 130, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#20293a,#eab24a)" }} />
              <span>low → high</span>
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div>
            {!d ? (
              <div className="card pad-lg">
                <div className="section-title">The four factory floors</div>
                <div className="section-note">Supply is brutally concentrated. Four clusters carry the export economy.</div>
                <BarList
                  fmt={(v) => crShort(v)}
                  rows={Object.entries(STATE_DETAIL)
                    .sort((a, b) => (b[1] as any).rev - (a[1] as any).rev)
                    .slice(0, 8)
                    .map(([k, v]: any) => ({ label: k === "Delhi" ? "Delhi–NCR" : k, value: v.rev, sub: `${v.n} cos` }))}
                />
                <div className="spacer" />
                <Reason>
                  <b>Maharashtra + Delhi-NCR = ~55%</b> of listed revenue. Gujarat, Tamil Nadu, Karnataka, Telangana form the
                  second tier — each with a distinct export DNA (Gujarat = chemicals/pharma, TN = auto/textiles, Telangana = pharma).
                  A new exporter should co-locate where the cluster, labour and logistics already exist — not greenfield.
                </Reason>
              </div>
            ) : (
              <div className="card pad-lg" style={{ animation: "fadeUp 0.35s" }}>
                <div className="card-h">
                  <div>
                    <div className="eyebrow">{sel === "Delhi" ? "Delhi–NCR cluster" : sel}</div>
                    <h3 style={{ fontSize: 22, marginTop: 2 }}>{d.n} export-scale companies</h3>
                  </div>
                  <button className="btn" onClick={() => setSel(null)}>← back</button>
                </div>
                <div className="grid g3" style={{ marginBottom: 4 }}>
                  <KPI label="Revenue" val={crShort(d.rev).replace("₹", "")} unit="₹" />
                  <KPI label="Market cap" val={crShort(d.mcap).replace("₹", "")} unit="₹" tone="teal" />
                  <KPI label="Companies" val={String(d.n)} tone="green" />
                </div>

                <div style={{ marginTop: 16, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Top sectors here</div>
                <div style={{ marginTop: 8 }}>
                  <BarList color="var(--teal)" fmt={(v) => crShort(v)}
                    rows={d.topSectors.map((s: any) => ({ label: s.name, value: s.rev, sub: `${s.n} cos` }))} />
                </div>

                <div style={{ marginTop: 18, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Players (largest by revenue)</div>
                <table className="tbl" style={{ marginTop: 6 }}>
                  <thead><tr><th>Company</th><th>City</th><th className="num">Rev ₹Cr</th><th className="num">M-cap ₹Cr</th></tr></thead>
                  <tbody>
                    {d.topCos.slice(0, 7).map((c: any, i: number) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td className="muted small">{c.city}</td>
                        <td className="num">{c.rev.toLocaleString("en-IN")}</td>
                        <td className="num">{c.mcap ? c.mcap.toLocaleString("en-IN") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: 18, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Exports out of this cluster</div>
                <div className="tag-row" style={{ marginTop: 8 }}>
                  {stateProducts.map(([p], i) => <span key={i} className="pill-sm">{p}</span>)}
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)" }}>→ typically serving:</div>
                <div className="tag-row" style={{ marginTop: 6 }}>
                  {stateDest.map((x, i) => <Chip key={i} kind="teal">{x}</Chip>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="spacer" />
        <div className="src">Source: Business Standard BS1000, FY25 (1,000 listed companies). Revenue &amp; market cap summed from as-reported company financials; state assigned from HQ city. Delhi figure includes the wider NCR (Gurugram/Noida/Faridabad).</div>
      </div>
    </div>
  );
}
