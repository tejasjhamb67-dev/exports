// ============================================================
//  HS DATA LAYER — typed loader over lib/hs/hs.json (ENGINEERING_PLAN §1).
//  HS-2 -> HS-4 taxonomy + India supply / demand, with provenance.
//  Map highlight helpers key to the exact geometry names in lib/geo.ts.
//  (Single embedded JSON for step 1; per-chapter lazy-loading is a later step.)
// ============================================================
import raw from "./hs.json";

export type Prov = "official" | "estimate" | "derived";
export type Provenance = { taxonomy: Prov; figures: Prov; splits: Prov };
export type SupplyState = { state: string; sharePct: number };
export type Destination = { country: string; usdM: number };
export type Tier = "A" | "B" | "C";

export type HSNode = {
  code: string;
  level: 2 | 4;
  hs2: string;
  hs4: string | null;
  section: string;
  sectionTitle: string;
  desc: string;
  indiaExportUsdM: number;
  supplyStates: SupplyState[];
  destinations: Destination[];
  globalImportUsdB: number;
  indiaSharePct: number;
  cagrPct: number;
  tier: Tier;
  score: number;
  provenance: Provenance;
};

export type HSSection = { n: string; title: string; chapters: string[] };
export type HSMeta = {
  generated: string; scope: string; rows: number; hs2: number; hs4: number;
  provenanceRules: string; sources: string[];
};

export const HS_META: HSMeta = (raw as any).meta;
export const HS_SECTIONS: HSSection[] = (raw as any).sections;
export const HS_NODES: HSNode[] = (raw as any).nodes;

export const HS2: HSNode[] = HS_NODES.filter((n) => n.level === 2);
export const HS4: HSNode[] = HS_NODES.filter((n) => n.level === 4);

export function childrenOf(hs2: string): HSNode[] {
  return HS4.filter((n) => n.hs2 === hs2);
}
export function findNode(code: string): HSNode | null {
  return HS_NODES.find((n) => n.code === code) ?? null;
}
export function chapterOf(n: HSNode): HSNode | null {
  return HS2.find((c) => c.code === n.hs2) ?? null;
}

export const TIER_META: Record<Tier, { label: string; color: string; bg: string; line: string }> = {
  A: { label: "Prime white space", color: "var(--gold)", bg: "var(--gold-dim)", line: "var(--gold-line)" },
  B: { label: "Credible entry", color: "var(--teal)", bg: "var(--teal-dim)", line: "var(--teal-line)" },
  C: { label: "Commoditised / hard", color: "var(--ink-3)", bg: "rgba(120,130,145,0.08)", line: "var(--line-2)" },
};

// ---- map highlight helpers -------------------------------------------------
// India map: state geometry key -> intensity 0..1 (normalised export share)
export function supplyHighlight(n: HSNode): Record<string, number> {
  const m: Record<string, number> = {};
  const max = Math.max(...n.supplyStates.map((s) => s.sharePct), 1);
  n.supplyStates.forEach((s) => { m[s.state] = s.sharePct / max; });
  return m;
}
// World map: country geometry key -> intensity 0..1 (normalised export value)
export function demandHighlight(n: HSNode): Record<string, number> {
  const m: Record<string, number> = {};
  const max = Math.max(...n.destinations.map((d) => d.usdM), 1);
  n.destinations.forEach((d) => { m[d.country] = d.usdM / max; });
  return m;
}
export function supplyShare(n: HSNode, state: string): number {
  return n.supplyStates.find((s) => s.state === state)?.sharePct ?? 0;
}
export function supplyValueUsdM(n: HSNode, state: string): number {
  return n.indiaExportUsdM * supplyShare(n, state) / 100;
}
export function destValueUsdM(n: HSNode, country: string): number {
  return n.destinations.find((d) => d.country === country)?.usdM ?? 0;
}

// ---- formatting ------------------------------------------------------------
export function usdM(v: number): string {
  if (v >= 1000) return `US$${(v / 1000).toFixed(1)}B`;
  return `US$${Math.round(v)}M`;
}
export function usdB(v: number): string {
  if (v >= 1000) return `US$${(v / 1000).toFixed(1)}T`;
  return `US$${v.toFixed(v < 10 ? 1 : 0)}B`;
}
