"use client";
import React, { useMemo, useState } from "react";
import { WORLD } from "@/lib/geo";
import { DEMAND } from "@/lib/demand";
import { lerpColor } from "@/lib/util";

export default function WorldMap({ onSelect, selected, highlight, hoverRender }: {
  onSelect: (c: string | null) => void;
  selected: string | null;
  // Optional product-driven mode (ENGINEERING_PLAN §3): paint destination
  // countries by a supplied intensity map (geometry key -> 0..1) and render
  // product-specific hover. When omitted, the map is the aggregate demand view.
  highlight?: Record<string, number>;
  hoverRender?: (country: string) => React.ReactNode;
}) {
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);
  const hlMode = !!highlight;
  const W = WORLD.w, H = WORLD.h;
  const countries = WORLD.countries as Record<string, { path: string; cx: number; cy: number }>;
  const demandMap = useMemo(() => {
    const m: Record<string, any> = {};
    DEMAND.forEach((d) => (m[d.name] = d));
    return m;
  }, []);

  function has(name: string) {
    return name === "India" || (hlMode ? highlight![name] != null : !!demandMap[name]);
  }
  function fill(name: string) {
    if (name === "India") return "#eab24a";
    if (hlMode) {
      const t = highlight![name];
      if (t == null) return "#e7ecf2";
      return lerpColor("#dcefef", "#38c7cc", Math.pow(t, 0.7));
    }
    const d = demandMap[name];
    if (!d) return "#e7ecf2";
    const t = Math.pow(d.intensity / 100, 0.75);
    return lerpColor("#e0eeee", "#38c7cc", t);
  }
  const hd = hover ? demandMap[hover.name] : null;

  // flow arcs: aggregate mode uses DEMAND intensity; product mode uses the
  // strongest destination markets from the highlight map.
  const arcTargets = useMemo(() => {
    if (hlMode) return Object.keys(highlight!).filter((k) => highlight![k] >= 0.5);
    return DEMAND.filter((d) => d.intensity >= 74).map((d) => d.name);
  }, [hlMode, highlight]);

  return (
    <div className="mapwrap">
      {hlMode ? <div className="zoom-hint" style={{ marginBottom: 10 }}>Where India ships this product · darker → higher export value</div> : null}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} onMouseLeave={() => setHover(null)}>
        {Object.entries(countries).map(([name, c]) => {
          const isSel = selected === name;
          const on = has(name);
          return (
            <path key={name} d={c.path} className="map-country"
              fill={fill(name)} opacity={isSel ? 1 : on ? 0.96 : hlMode ? 0.42 : 0.5}
              stroke={isSel ? "var(--teal-2)" : "rgba(246,248,251,0.7)"} strokeWidth={isSel ? 1.2 : 0.4}
              style={{ cursor: on && name !== "India" ? "pointer" : "default" }}
              onMouseMove={(e) => { if (name !== "India" && (hlMode ? highlight![name] != null : demandMap[name])) setHover({ name, x: e.clientX, y: e.clientY }); }}
              onClick={() => { if (name !== "India" && (hlMode ? highlight![name] != null : demandMap[name])) onSelect(isSel ? null : name); }} />
          );
        })}
        {/* India origin marker */}
        {countries["India"] && (
          <g style={{ pointerEvents: "none" }}>
            <circle cx={countries["India"].cx} cy={countries["India"].cy} r={4} fill="#eab24a" stroke="#ffffff" strokeWidth={1} />
          </g>
        )}
        {/* flow lines India -> top demand markets */}
        {countries["India"] && arcTargets.map((name) => {
          const c = countries[name];
          if (!c) return null;
          const x1 = countries["India"].cx, y1 = countries["India"].cy;
          const mx = (x1 + c.cx) / 2, my = Math.min(y1, c.cy) - 40;
          return <path key={name} d={`M${x1},${y1} Q${mx},${my} ${c.cx},${c.cy}`} fill="none" stroke="var(--teal)" strokeWidth={0.8} opacity={0.35} style={{ pointerEvents: "none" }} />;
        })}
      </svg>
      {hover && hlMode && hoverRender ? (
        <div className="tooltip" style={{ left: Math.min(hover.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 320), top: hover.y + 14 }}>
          {hoverRender(hover.name)}
        </div>
      ) : hover && hd ? (
        <div className="tooltip" style={{ left: Math.min(hover.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 320), top: hover.y + 14 }}>
          <h4>{hd.short}</h4>
          <div className="tt-row"><span>Demand intensity</span><span style={{ color: "var(--teal-2)" }}>{hd.intensity}/100</span></div>
          <div className="tt-row"><span>India exports (FY25)</span><span>US${hd.indiaExp}B</span></div>
          <div className="tt-row"><span>India's import share</span><span>{hd.share}</span></div>
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--ink-2)" }}>{hd.hook}</div>
        </div>
      ) : null}
    </div>
  );
}
