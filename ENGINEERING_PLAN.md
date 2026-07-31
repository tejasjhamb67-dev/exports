# Build Spec — Export Decision Engine (v2)

Locked scope (user decision): **HS-6 product universe (~5,300 codes), India-centric.**
Goal: a research database + decision tool where an exporter can look up **any** product and
get its **supply** (Indian states/clusters), **demand** (destination countries), tariffs, and a
**how-to-start** pack — with **maps that repaint on product selection** and **functional hover**.

## 1. Data layer (build first, offline/embedded — CSP blocks live fetch)

Source & generate a static dataset (committed as compressed JSON in `/lib/hs/`):

- **HS taxonomy**: full HS-2 → HS-4 → HS-6 tree with official descriptions.
  Source: WCO HS 2022 / DGFT ITC-HS list (public CSV).
- **India supply per HS-6**: FY24/FY25 export value + top origin states.
  Source: DGCIS `commerce.gov.in` export data, APEDA/EEPC/GJEPC council splits,
  ICEGATE port-of-origin as state proxy. Where HS-6 state split is unavailable,
  inherit HS-4 distribution (flag as `derived`).
- **India demand/destinations per HS-6**: FY25 export value by partner country.
  Source: DGCIS partner data / UN Comtrade (reporter=India). Top 5–8 destinations + value.
- **Global demand per HS-6**: world import value + top importers + India's share.
  Source: UN Comtrade (world imports), ITC Trade Map.
- **Policy**: applied MFN tariff bands in key markets, India RoDTEP/drawback rate,
  active FTAs (UAE-CEPA, Aus-ECTA, UK-FTA), anti-dumping flags.
- **How-to-start template** per HS-4 family: capex band, key certs, unit-econ archetype
  (reuse `productVenture`/`runModel` engine already in `lib/ventures.ts`).

Schema (per HS-6):
```ts
type HS6 = {
  code: string; desc: string; hs4: string; hs2: string;
  indiaExportUsdM: number;                 // FY25
  supplyStates: {state: string; sharePct: number}[];   // -> India map
  destinations: {country: string; usdM: number}[];     // -> world map
  globalImportUsdB: number; indiaSharePct: number; cagrPct: number;
  rodtepPct: number; ftas: string[]; adFlags: string[];
  tier: 'A'|'B'|'C'; score: number;        // white-space score (reuse composite)
  econ: {unit; price; grossPct; capexCr; capacity; fixedCr};  // how-to-start
  provenance: 'official'|'derived'|'estimate';
};
```
Build via Python generator (like `catalog.ts` was) → emit `lib/hs/hs6.json` (gzip if large).
Lazy-load per HS-2 chapter so the bundle stays light.

## 2. UI — new "Explore" tab (replaces/absorbs Product)

- **Search bar** over all HS-6 (code or description) + chapter filter + tier filter +
  sort (India export value / global demand / white-space score / margin).
- **Results table**: virtualised list (5,300 rows) — code, desc, tier, India $, global $, share.
- **Select a product → split view**:
  - Left: **India supply map** highlighting `supplyStates` (choropleth by share); hover a
    state → that product's export value from it.
  - Right: **world demand map** highlighting `destinations`; hover a country → India's export
    value to it + that country's total import + India's share.
  - Below: tariffs/FTAs, how-to-start pack, and the interactive financial model (existing engine).

## 3. Map changes (both maps get a `highlight` prop)

- `IndiaMap` / `WorldMap`: add optional `highlight?: Record<name, number>` (value→intensity) and
  `hoverRender?: (name)=>ReactNode` so hover shows product-specific numbers, not just aggregates.
- Product selection lives in a shared context (`ExploreContext`) so maps + panels stay in sync.

## 4. Sequencing (each step independently shippable — keep live app green)

1. Generate HS taxonomy + HS-2/HS-4 real data (fast, ~1,300 rows) → ship.
2. Add `highlight`/`hoverRender` props to maps (backwards-compatible) → ship.
3. New Explore tab with search + results + linked maps on HS-4 → ship.
4. Backfill HS-6 rows chapter-by-chapter (derived where official split missing) → ship in batches.
5. Add policy/tariff layer + how-to-start packs per HS-4 family → ship.

## 5. Data honesty rules
- Tag every figure `official | derived | estimate`; show the tag in the UI.
- HS-6 state/partner splits are often unpublished → inherit HS-4 and flag `derived`.
- Never present an estimate as an official statistic. Ranges over false precision.

> Status: scope locked. Data generation + map-linking is the next full-budget session's job.
> Current live app = the light-theme, 45-product scoping tool (Product tab) — untouched by this spec.
