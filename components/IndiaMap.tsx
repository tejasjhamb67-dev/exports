"use client";
import React, { useMemo, useState, useRef } from "react";
import { INDIA } from "@/lib/geo";
import { STATE_DETAIL } from "@/lib/supply";
import { CITY_XY } from "@/lib/cities";
import { crShort, crFull, lerpColor } from "@/lib/util";

// STATE_DETAIL key -> geometry key (mostly identical)
const KEYMAP: Record<string, string> = {
  Delhi: "Delhi",
  "Jammu and Kashmir": "Jammu and Kashmir",
};
function geoKey(k: string) { return KEYMAP[k] ?? k; }

function bboxOfPath(d: string): [number, number, number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
  }
  return [minx, miny, maxx - minx, maxy - miny];
}

type Metric = "rev" | "n" | "mcap";
const METRICS: { k: Metric; label: string }[] = [
  { k: "rev", label: "Revenue" },
  { k: "mcap", label: "Market cap" },
  { k: "n", label: "# Companies" },
];

export default function IndiaMap({ onSelect, selected }: { onSelect: (s: string | null) => void; selected: string | null }) {
  const [metric, setMetric] = useState<Metric>("rev");
  const [hover, setHover] = useState<{ key: string; x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const W = INDIA.w, H = INDIA.h;
  const states = INDIA.states as Record<string, { path: string; cx: number; cy: number }>;

  // build value per geometry key
  const values = useMemo(() => {
    const m: Record<string, number> = {};
    Object.entries(STATE_DETAIL).forEach(([k, v]) => {
      m[geoKey(k)] = (v as any)[metric];
    });
    return m;
  }, [metric]);
  const maxVal = Math.max(...Object.values(values), 1);

  function fill(key: string) {
    const raw = values[key];
    if (raw == null) return "#e7ecf2";
    const t = Math.pow(raw / maxVal, 0.42);
    return lerpColor("#e9edf3", "#eab24a", t);
  }

  // zoom transform for selected state
  const transform = useMemo(() => {
    if (!selected) return "translate(0px,0px) scale(1)";
    const gk = geoKey(selected);
    const st = states[gk];
    if (!st) return "translate(0px,0px) scale(1)";
    const [x, y, bw, bh] = bboxOfPath(st.path);
    const pad = 60;
    const scale = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh, 4.2);
    const tx = pad - x * scale + ((W - 2 * pad) - bw * scale) / 2;
    const ty = pad - y * scale + ((H - 2 * pad) - bh * scale) / 2;
    return `translate(${tx}px,${ty}px) scale(${scale})`;
  }, [selected, states, W, H]);

  const detail = selected ? (STATE_DETAIL as any)[selected] : null;
  const zoomScale = selected ? parseFloat(transform.split("scale(")[1]) : 1;

  // cities belonging to selected state (from its top companies)
  const stateCities = useMemo(() => {
    if (!detail) return [];
    const set = new Set<string>();
    detail.topCos.forEach((c: any) => { if (CITY_XY[c.city]) set.add(c.city); });
    return [...set];
  }, [detail]);

  function move(e: React.MouseEvent, key: string) {
    if (values[key] == null && !STATE_DETAIL[key]) { setHover(null); return; }
    setHover({ key, x: e.clientX, y: e.clientY });
  }

  const hd = hover ? (STATE_DETAIL as any)[hover.key] : null;

  return (
    <div className="mapwrap" ref={wrapRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
        <div className="seg">
          {METRICS.map((m) => (
            <button key={m.k} className={metric === m.k ? "on" : ""} onClick={() => setMetric(m.k)}>{m.label}</button>
          ))}
        </div>
        {selected ? <button className="btn" onClick={() => onSelect(null)}>← Reset · full India</button> : <span className="zoom-hint">Hover a state · click to zoom in</span>}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight: 620, display: "block" }}
        onMouseLeave={() => setHover(null)}>
        <g style={{ transform, transformOrigin: "0 0", transition: "transform 0.6s cubic-bezier(0.3,0.8,0.3,1)" }}>
          {Object.entries(states).map(([key, st]) => {
            const isSel = selected && geoKey(selected) === key;
            const dim = selected && !isSel;
            return (
              <path key={key} d={st.path} className={`map-state ${isSel ? "active" : ""}`}
                fill={fill(key)} stroke="rgba(246,248,251,0.9)" strokeWidth={0.6 / zoomScale}
                opacity={dim ? 0.28 : 1}
                onMouseMove={(e) => move(e, key)}
                onClick={() => {
                  const sdKey = Object.keys(STATE_DETAIL).find((k) => geoKey(k) === key);
                  onSelect(sdKey ?? null);
                }} />
            );
          })}
          {/* state labels (only major, when not zoomed) */}
          {!selected && Object.entries(states).map(([key, st]) => {
            const v = values[key];
            if (v == null || v < maxVal * 0.03) return null;
            return (
              <text key={key} x={st.cx} y={st.cy} textAnchor="middle" fontSize={9} fill="rgba(30,41,59,0.55)"
                style={{ pointerEvents: "none", fontWeight: 600 }}>{key.length > 12 ? key.slice(0, 10) + "…" : key}</text>
            );
          })}
          {/* city markers when zoomed */}
          {selected && stateCities.map((city) => {
            const [x, y] = CITY_XY[city];
            return (
              <g key={city} style={{ pointerEvents: "none" }}>
                <circle cx={x} cy={y} r={3.2 / zoomScale} fill="var(--gold-2)" stroke="#ffffff" strokeWidth={1 / zoomScale} />
                <text x={x + 5 / zoomScale} y={y + 3 / zoomScale} fontSize={9 / zoomScale} fill="#17202e" fontWeight={600}>{city}</text>
              </g>
            );
          })}
        </g>
      </svg>

      {hover && hd ? (
        <div className="tooltip" style={{ left: Math.min(hover.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 300), top: hover.y + 14 }}>
          <h4>{hover.key === "Delhi" ? "Delhi–NCR" : hover.key}</h4>
          <div className="tt-row"><span>Companies (BS1000)</span><span>{hd.n}</span></div>
          <div className="tt-row"><span>Combined revenue</span><span>{crShort(hd.rev)}</span></div>
          <div className="tt-row"><span>Combined market cap</span><span>{crShort(hd.mcap)}</span></div>
          <div className="tt-row"><span>Lead sector</span><span style={{ color: "var(--gold-2)" }}>{hd.topSectors[0]?.name}</span></div>
          <div style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-4)" }}>click to zoom · players & products →</div>
        </div>
      ) : null}
    </div>
  );
}
