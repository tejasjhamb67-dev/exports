"use client";
import React, { useMemo, useState } from "react";
import { WORLD } from "@/lib/geo";
import { DEMAND } from "@/lib/demand";
import { lerpColor } from "@/lib/util";

export default function WorldMap({ onSelect, selected }: { onSelect: (c: string | null) => void; selected: string | null }) {
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);
  const W = WORLD.w, H = WORLD.h;
  const countries = WORLD.countries as Record<string, { path: string; cx: number; cy: number }>;
  const demandMap = useMemo(() => {
    const m: Record<string, any> = {};
    DEMAND.forEach((d) => (m[d.name] = d));
    return m;
  }, []);

  function fill(name: string) {
    if (name === "India") return "#eab24a";
    const d = demandMap[name];
    if (!d) return "#141b26";
    const t = Math.pow(d.intensity / 100, 0.75);
    return lerpColor("#183036", "#38c7cc", t);
  }
  const hd = hover ? demandMap[hover.name] : null;

  return (
    <div className="mapwrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} onMouseLeave={() => setHover(null)}>
        {Object.entries(countries).map(([name, c]) => {
          const isSel = selected === name;
          const has = !!demandMap[name] || name === "India";
          return (
            <path key={name} d={c.path} className="map-country"
              fill={fill(name)} opacity={isSel ? 1 : has ? 0.96 : 0.5}
              stroke={isSel ? "var(--teal-2)" : "rgba(8,11,17,0.7)"} strokeWidth={isSel ? 1.2 : 0.4}
              style={{ cursor: has ? "pointer" : "default" }}
              onMouseMove={(e) => demandMap[name] && setHover({ name, x: e.clientX, y: e.clientY })}
              onClick={() => demandMap[name] && onSelect(isSel ? null : name)} />
          );
        })}
        {/* India origin marker */}
        {countries["India"] && (
          <g style={{ pointerEvents: "none" }}>
            <circle cx={countries["India"].cx} cy={countries["India"].cy} r={4} fill="#eab24a" stroke="#1a130a" strokeWidth={1} />
          </g>
        )}
        {/* flow lines India -> top demand markets */}
        {countries["India"] && DEMAND.filter((d) => d.intensity >= 74).map((d) => {
          const c = countries[d.name];
          if (!c) return null;
          const x1 = countries["India"].cx, y1 = countries["India"].cy;
          const mx = (x1 + c.cx) / 2, my = Math.min(y1, c.cy) - 40;
          return <path key={d.name} d={`M${x1},${y1} Q${mx},${my} ${c.cx},${c.cy}`} fill="none" stroke="var(--teal)" strokeWidth={0.8} opacity={0.35} style={{ pointerEvents: "none" }} />;
        })}
      </svg>
      {hover && hd ? (
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
