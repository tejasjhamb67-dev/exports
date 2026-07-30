"use client";
import React from "react";

export function KPI({ label, val, unit, sub, tone = "" }: { label: string; val: string; unit?: string; sub?: React.ReactNode; tone?: string }) {
  return (
    <div className={`kpi ${tone}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-val tnum">
        {val}
        {unit ? <span className="unit">{unit}</span> : null}
      </div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}

export function Chip({ children, kind = "" }: { children: React.ReactNode; kind?: string }) {
  return <span className={`chip ${kind}`}>{children}</span>;
}

export function Reason({ children, teal = false }: { children: React.ReactNode; teal?: boolean }) {
  return <div className={`reason ${teal ? "teal" : ""}`}>{children}</div>;
}

// Horizontal bar list
export function BarList({
  rows, color = "var(--gold)", fmt, max,
}: {
  rows: { label: string; value: number; sub?: string }[];
  color?: string;
  fmt: (v: number) => string;
  max?: number;
}) {
  const m = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      {rows.map((r, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
            <span style={{ color: "var(--ink-2)" }}>{r.label}</span>
            <span className="tnum" style={{ fontWeight: 600 }}>
              {fmt(r.value)} {r.sub ? <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>· {r.sub}</span> : null}
            </span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(r.value / m) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Donut / ring
export function Donut({ segments, size = 168, thick = 22, center }: {
  segments: { label: string; value: number; color: string }[];
  size?: number; thick?: number; center?: React.ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thick) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(30,41,59,0.05)" strokeWidth={thick} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thick}
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.6s ease" }} />
          );
          off += len;
          return el;
        })}
      </svg>
      {center ? (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{center}</div>
      ) : null}
    </div>
  );
}

// Scenario range bar (bear/base/bull)
export function RangeBar({ lo, base, hi, min, max, unit = "", color = "var(--gold)" }: {
  lo: number; base: number; hi: number; min: number; max: number; unit?: string; color?: string;
}) {
  const span = max - min || 1;
  const p = (v: number) => ((v - min) / span) * 100;
  return (
    <div style={{ padding: "6px 0" }}>
      <div style={{ position: "relative", height: 8, background: "rgba(30,41,59,0.06)", borderRadius: 4 }}>
        <div style={{ position: "absolute", left: `${p(lo)}%`, width: `${p(hi) - p(lo)}%`, top: 0, bottom: 0, background: color, opacity: 0.28, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: `calc(${p(base)}% - 6px)`, top: -3, width: 12, height: 12, borderRadius: 6, background: color, border: "2px solid var(--bg)", boxShadow: "0 0 0 3px rgba(0,0,0,0.3)" }} />
      </div>
      <div className="tnum" style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-3)", marginTop: 5 }}>
        <span>{lo.toLocaleString()}{unit}</span>
        <span style={{ color: color, fontWeight: 700 }}>{base.toLocaleString()}{unit}</span>
        <span>{hi.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

// Line/area chart for cumulative cash
export function LineChart({ series, w = 560, h = 220, fmtY, labels, colors }: {
  series: number[][]; w?: number; h?: number; fmtY: (v: number) => string; labels: string[]; colors: string[];
}) {
  const all = series.flat();
  const min = Math.min(0, ...all), max = Math.max(...all, 1);
  const pad = { l: 54, r: 14, t: 14, b: 26 };
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const n = series[0]?.length || 1;
  const x = (i: number) => pad.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => pad.t + ih - ((v - min) / (max - min || 1)) * ih;
  const zeroY = y(0);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = min + (max - min) * (1 - f);
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + f * ih} y2={pad.t + f * ih} stroke="rgba(30,41,59,0.05)" />
            <text x={pad.l - 8} y={pad.t + f * ih + 3} textAnchor="end" fontSize="9.5" fill="var(--ink-4)" className="tnum">{fmtY(v)}</text>
          </g>
        );
      })}
      <line x1={pad.l} x2={w - pad.r} y1={zeroY} y2={zeroY} stroke="rgba(30,41,59,0.18)" strokeDasharray="3 3" />
      {series.map((s, si) => {
        const d = s.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={colors[si]} strokeWidth={2.2} strokeLinejoin="round" />
            {s.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={3} fill={colors[si]} />)}
          </g>
        );
      })}
      {series[0].map((_, i) => (
        <text key={i} x={x(i)} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--ink-4)">{labels[i]}</text>
      ))}
    </svg>
  );
}

// Grouped/stacked column chart
export function Columns({ data, w = 560, h = 240, fmtY, color = "var(--gold)" }: {
  data: { label: string; value: number }[]; w?: number; h?: number; fmtY: (v: number) => string; color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(0, ...data.map((d) => d.value));
  const pad = { l: 54, r: 12, t: 14, b: 26 };
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const bw = (iw / data.length) * 0.6;
  const y = (v: number) => pad.t + ih - ((v - min) / (max - min || 1)) * ih;
  const zeroY = y(0);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      {[0, 0.5, 1].map((f, i) => {
        const v = min + (max - min) * (1 - f);
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + f * ih} y2={pad.t + f * ih} stroke="rgba(30,41,59,0.05)" />
            <text x={pad.l - 8} y={pad.t + f * ih + 3} textAnchor="end" fontSize="9.5" fill="var(--ink-4)" className="tnum">{fmtY(v)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const cx = pad.l + (i + 0.5) * (iw / data.length);
        const top = y(Math.max(0, d.value)), bot = y(Math.min(0, d.value));
        return (
          <g key={i}>
            <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(1, bot - top)} rx={3} fill={d.value < 0 ? "var(--red)" : color} opacity={0.9} />
            <text x={cx} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--ink-4)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
