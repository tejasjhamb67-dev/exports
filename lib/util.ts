// Formatting helpers — Indian numbering where it belongs.

export function crShort(cr: number): string {
  // ₹ Cr → short form. 1 lakh Cr = ₹1L Cr.
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(cr >= 1000000 ? 1 : 2)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(1)}K Cr`;
  return `₹${Math.round(cr).toLocaleString("en-IN")} Cr`;
}
export function crFull(cr: number): string {
  return `₹${Math.round(cr).toLocaleString("en-IN")} Cr`;
}
export function usdB(v: number): string {
  return `US$${v.toFixed(v < 10 ? 1 : 0)}B`;
}
export function pct(v: number, d = 0): string {
  return `${v > 0 ? "" : ""}${v.toFixed(d)}%`;
}
export function crRange(lo: number, hi: number): string {
  const f = (x: number) => (x >= 100 ? `₹${(x).toFixed(0)}` : `₹${x.toFixed(0)}`);
  return `${f(lo)}–${f(hi)} Cr`;
}
export function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
export function lerpColor(a: string, b: string, t: number): string {
  const pa = hex(a), pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const x = h.replace("#", "");
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}
