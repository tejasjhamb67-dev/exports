// ============================================================
//  VENTURES — investable, new-entrant white-space plays.
//  Each carries a fully parametric unit-economics model. The
//  Financial tab drives these live (bear / base / bull via sliders).
//  All money in ₹ Cr unless noted. Basis notes make every number
//  auditable; ranges, never false precision.
// ============================================================

export type Driver = {
  key: string;
  label: string;
  unit: string;
  min: number; base: number; max: number;
  step: number;
  basis: string;
};

export type Venture = {
  id: string;
  name: string;
  industryId: string;
  product: string;
  target: string;
  emoji: string;
  thesisLine: string;
  entrantFit: string;        // why a new entrant can win this
  // Unit economics (per unit — kg, carat, sqm, unit)
  unitName: string;          // "kg", "carat", "sq.m", "unit"
  drivers: Driver[];         // interactive drivers
  // capex breakdown (₹ Cr) — inception cost
  capex: { item: string; cr: number; note: string }[];
  // fixed opex (₹ Cr / yr at steady state)
  fixedOpexCr: number;
  fixedOpexNote: string;
  // volume ramp as % of installed capacity, Y1..Y5
  ramp: number[];
  capacityUnitsPerYr: number; // installed capacity (units/yr) at 100%
  incentives: string;         // RoDTEP / duty drawback / PLI notes
  keyRisks: string[];
};

export const VENTURES: Venture[] = [
  {
    id: "shrimp",
    name: "Value-Added Shrimp → Japan",
    industryId: "marine",
    product: "Cooked / breaded IQF retail-pack shrimp",
    target: "Japan",
    emoji: "🦐",
    thesisLine: "Buy India's raw shrimp advantage, sell Japan's value-added premium.",
    entrantFit: "Asset-light: a single IQF + cooking line near Andhra ponds. No brand needed for B2B private-label into Japanese retail. Fast to cash-flow.",
    unitName: "kg",
    drivers: [
      { key: "price", label: "Realised export price", unit: "US$/kg", min: 10, base: 12.5, max: 15.5, step: 0.5, basis: "Raw HOSO ~US$7–8/kg; cooked/breaded value-add ~US$11–16/kg (MPEDA, Japan import price bands)." },
      { key: "rawCost", label: "All-in variable cost (COGS)", unit: "US$/kg", min: 9, base: 10.6, max: 12.5, step: 0.1, basis: "Farm-gate vannamei + processing labour + batter/pack + cold-chain freight to Japan + ~10% yield loss (MPEDA + logistics benchmarks). This is the full variable cost, not just raw shrimp — why contribution is ~15%, realistic for seafood." },
      { key: "util", label: "Capacity utilisation (steady)", unit: "%", min: 45, base: 70, max: 92, step: 1, basis: "Seafood processing typically 60–80% given seasonality; ramp-limited early." },
    ],
    capex: [
      { item: "IQF freezer + cooking/breading line", cr: 14, note: "Spiral IQF, cooker, batter/breader, blast freezer" },
      { item: "Cold-store + pre-processing hall", cr: 9, note: "−25°C store, peeling/dressing area, HACCP fit-out" },
      { item: "Certifications & approvals", cr: 1.5, note: "BRC/BAP/ASC, Japan-JAS, EU-approval optional" },
      { item: "Working-capital float (initial)", cr: 16, note: "60–75 day cash cycle; receivables + inventory" },
    ],
    fixedOpexCr: 15,
    fixedOpexNote: "Plant overhead, QC lab, admin, SG&A, insurance, financing — over and above the variable COGS above.",
    ramp: [0.35, 0.55, 0.7, 0.8, 0.85],
    capacityUnitsPerYr: 4_000_000, // 4,000 t/yr
    incentives: "RoDTEP ~1.5–2.5% + MPEDA market-access & freight assistance; interest-subvention on export credit.",
    keyRisks: ["US tariff spillover depressing global raw prices", "Disease events (EHP/WSSV) hitting farm supply", "Yen volatility", "Japan's exacting spec/rejection standards"],
  },
  {
    id: "lgd",
    name: "Branded LGD Jewellery → USA",
    industryId: "jewellery",
    product: "Certified lab-grown-diamond finished jewellery (DTC + B2B)",
    target: "United States of America",
    emoji: "💎",
    thesisLine: "Surat already cuts the stones. Capture the retail margin instead of shipping it to New York.",
    entrantFit: "Highest margin-uplift of any play. Forward-integration on an existing Surat supply base; brand + e-commerce is the moat, capex is modest.",
    unitName: "piece",
    drivers: [
      { key: "price", label: "Avg realised price / piece", unit: "US$", min: 220, base: 420, max: 750, step: 10, basis: "Finished LGD jewellery ASP US$300–800 retail; B2B/DTC blended (retail-benchmark triangulation)." },
      { key: "rawCost", label: "Variable cost (stone+gold+making+ship)", unit: "US$", min: 210, base: 310, max: 470, step: 10, basis: "LGD polished (deflating ~15–20%/yr) + gold + setting labour + certification + fulfilment/returns. Contribution ~26% — branded jewellery is gross-rich but marketing-heavy (see fixed opex)." },
      { key: "util", label: "Order-book fill (steady)", unit: "%", min: 40, base: 68, max: 90, step: 1, basis: "Demand-led; DTC ramp + B2B private-label off-take." },
    ],
    capex: [
      { item: "Jewellery mfg unit + CAD/CAM + casting", cr: 6, note: "Casting, laser, setting benches, CAD studio" },
      { item: "Brand, e-commerce & content build", cr: 8, note: "DTC site, photography, launch marketing, IGI/GIA tie-ups" },
      { item: "Certification & hallmarking setup", cr: 1, note: "IGI/GIA grading pipeline, BIS hallmark" },
      { item: "Working-capital (inventory float)", cr: 24, note: "Gold + stone inventory (months of holding) + receivables" },
    ],
    fixedOpexCr: 24,
    fixedOpexNote: "Digital-marketing burn (the real cost of a brand), design team, US fulfilment/returns, karigar wages, platform & payment fees.",
    ramp: [0.3, 0.5, 0.68, 0.8, 0.88],
    capacityUnitsPerYr: 120_000, // 120k pieces/yr
    incentives: "GJEPC market-access; RoDTEP on jewellery; India–UAE CEPA duty-free routing for Gulf leg.",
    keyRisks: ["LGD price deflation compressing ASP faster than cost", "Brand-build cost overrun", "US consumer-discretionary cycle", "Natural-diamond lobby / disclosure rules"],
  },
  {
    id: "techtex",
    name: "Technical Textiles → USA/EU",
    industryId: "textiles",
    product: "Meltblown & spunbond medical/industrial nonwovens",
    target: "United States of America",
    emoji: "🧵",
    thesisLine: "Same fibre India already spins — 5–8× the margin, tariff-light, China-vacated.",
    entrantFit: "Leverages India's polymer + textile base. One meltblown/spunbond line; buyers are hospitals, filtration & hygiene OEMs hunting a non-China source.",
    unitName: "kg",
    drivers: [
      { key: "price", label: "Realised price", unit: "US$/kg", min: 3.5, base: 6.0, max: 9.5, step: 0.25, basis: "Meltblown/technical nonwoven US$4–10/kg vs commodity fabric ~US$2 (industry price bands)." },
      { key: "rawCost", label: "All-in variable cost (COGS)", unit: "US$/kg", min: 2.8, base: 4.7, max: 6.8, step: 0.1, basis: "PP/PET resin + extrusion energy + additives + packaging + export freight (resin index FY25 + logistics). Contribution ~22% — healthy for technical nonwovens vs ~8% for commodity fabric." },
      { key: "util", label: "Capacity utilisation (steady)", unit: "%", min: 45, base: 72, max: 92, step: 1, basis: "Nonwoven lines run 70–90% once qualified with anchor buyers." },
    ],
    capex: [
      { item: "Meltblown + spunbond line", cr: 22, note: "Reifenhäuser/Chinese-alt line, slitting, winding" },
      { item: "Cleanroom & lab (medical grade)", cr: 6, note: "ISO-class room, QC, sterilisation tie-up" },
      { item: "Certifications (ISO 13485, Nelson, EU)", cr: 2, note: "Medical-device & filtration approvals" },
      { item: "Working-capital float", cr: 13, note: "Resin inventory + export receivables (60–90d)" },
    ],
    fixedOpexCr: 16,
    fixedOpexNote: "Power base-load, skilled operators, QC, maintenance, SG&A, compliance — over and above variable COGS.",
    ramp: [0.3, 0.52, 0.7, 0.82, 0.88],
    capacityUnitsPerYr: 6_000_000, // 6,000 t/yr
    incentives: "National Technical Textiles Mission (NTTM) grants + PLI for MMF/technical textiles; RoDTEP.",
    keyRisks: ["Post-COVID meltblown oversupply on commodity grades", "Long medical-buyer qualification cycles (12–18m)", "Resin price spikes", "US tariff regime shifts"],
  },
  {
    id: "biologicals",
    name: "Agri-Biologicals → Brazil",
    industryId: "agrochem",
    product: "Microbial bio-pesticides & bio-stimulants",
    target: "Brazil",
    emoji: "🌾",
    thesisLine: "India's fermentation cost base into the world's fastest-adopting biologicals market.",
    entrantFit: "Fermentation + formulation, not synthesis — lower capex, greener regulatory path. Brazil's MAPA registration is faster than EU; partner with a local distributor.",
    unitName: "litre-eq",
    drivers: [
      { key: "price", label: "Realised price", unit: "US$/L-eq", min: 6, base: 11, max: 18, step: 0.5, basis: "Branded biologicals US$8–20/L; India export/contract band (biologicals price surveys)." },
      { key: "rawCost", label: "All-in variable cost (COGS)", unit: "US$/L-eq", min: 4.5, base: 7.9, max: 11, step: 0.25, basis: "Substrate + fermentation energy + carriers + fill + freight + distributor margin share (fermentation cost benchmarks). Contribution ~28% before heavy R&D/registration fixed cost." },
      { key: "util", label: "Capacity utilisation (steady)", unit: "%", min: 40, base: 65, max: 88, step: 1, basis: "Registration-gated in Y1–2; ramps as MAPA approvals clear." },
    ],
    capex: [
      { item: "Fermentation + downstream + fill line", cr: 16, note: "Bioreactors, centrifuge, formulation, packaging" },
      { item: "R&D + strain library + QC lab", cr: 5, note: "Microbial strain bank, efficacy trials" },
      { item: "Brazil (MAPA) registrations + trials", cr: 6, note: "Field-trial dossiers, in-country registration — multi-year" },
      { item: "Working-capital + channel float", cr: 12, note: "Distributor credit terms in Brazil are long" },
    ],
    fixedOpexCr: 16,
    fixedOpexNote: "Scientists, agronomists, ongoing R&D, Brazil field team/distributor support, cold-chain, compliance.",
    ramp: [0.2, 0.4, 0.62, 0.78, 0.86],
    capacityUnitsPerYr: 3_500_000, // 3.5M L-eq/yr
    incentives: "DoC agri-export incentives; RoDTEP; India–Mercosur PTA on select lines; state biotech grants.",
    keyRisks: ["Long, uncertain MAPA registration timelines", "Efficacy variance across Brazilian agro-climates", "BRL/real volatility & distributor credit risk", "Multinational (Syngenta/Bayer) biologicals push"],
  },
];

// ---------- Financial engine (pure, deterministic) ----------
export type Assump = { price: number; rawCost: number; util: number };
export type YearRow = { year: number; volume: number; revenueCr: number; grossCr: number; ebitdaCr: number; cumCashCr: number };
export type ModelOut = {
  years: YearRow[];
  totalCapexCr: number;
  peakFundingCr: number;   // most negative cumulative cash = capital needed
  paybackYr: number | null;
  npvCr: number;
  irr: number | null;
  steadyEbitdaMarginPct: number;
  breakevenUtilPct: number;
  y5RevenueCr: number;
};

export function runModel(v: Venture, a: Assump, fx: number, discount = 0.15): ModelOut {
  const totalCapex = v.capex.reduce((s, c) => s + c.cr, 0);
  const contributionPerUnitCr = ((a.price - a.rawCost) * fx) / 1e7; // ₹ per unit → Cr
  const years: YearRow[] = [];
  let cum = -totalCapex; // capex at t0
  const cashByYear: number[] = [-totalCapex];
  for (let i = 0; i < 5; i++) {
    const util = a.util / 100;
    const vol = v.capacityUnitsPerYr * v.ramp[i] * util;
    const revenueCr = (vol * a.price * fx) / 1e7;
    const grossCr = vol * contributionPerUnitCr;
    const ebitdaCr = grossCr - v.fixedOpexCr * (0.7 + 0.3 * v.ramp[i]); // opex scales partly with ramp
    cum += ebitdaCr;
    cashByYear.push(ebitdaCr);
    years.push({ year: i + 1, volume: Math.round(vol), revenueCr: +revenueCr.toFixed(1), grossCr: +grossCr.toFixed(1), ebitdaCr: +ebitdaCr.toFixed(1), cumCashCr: +cum.toFixed(1) });
  }
  // peak funding requirement
  let running = 0, peak = 0;
  for (const c of cashByYear) { running += c; if (running < peak) peak = running; }
  // payback (year cumulative turns positive)
  let payback: number | null = null;
  for (const y of years) { if (y.cumCashCr >= 0) { payback = y.year; break; } }
  // NPV
  let npv = -totalCapex;
  years.forEach((y, i) => { npv += y.ebitdaCr / Math.pow(1 + discount, i + 1); });
  // IRR (bisection on cashflows [-capex, ebitda1..5]) with terminal value = 4x final EBITDA
  const flows = [-totalCapex, ...years.map((y) => y.ebitdaCr)];
  flows[flows.length - 1] += Math.max(0, years[4].ebitdaCr) * 3.0; // exit multiple terminal value (conservative)
  const irr = solveIRR(flows);
  const steadyEbitda = years[4].ebitdaCr;
  const steadyRev = years[4].revenueCr;
  const steadyMargin = steadyRev > 0 ? (steadyEbitda / steadyRev) * 100 : 0;
  // break-even utilisation (util where steady-yr EBITDA = 0), holding price/cost
  const cprCr = contributionPerUnitCr;
  const volAt100 = v.capacityUnitsPerYr * v.ramp[4];
  const beUtil = cprCr > 0 ? (v.fixedOpexCr / (volAt100 * cprCr)) * 100 : 999;
  return {
    years, totalCapexCr: +totalCapex.toFixed(1), peakFundingCr: +Math.abs(peak).toFixed(1),
    paybackYr: payback, npvCr: +npv.toFixed(1), irr, steadyEbitdaMarginPct: +steadyMargin.toFixed(1),
    breakevenUtilPct: +Math.min(beUtil, 100).toFixed(0), y5RevenueCr: +steadyRev.toFixed(1),
  };
}

function solveIRR(flows: number[]): number | null {
  const npvAt = (r: number) => flows.reduce((s, f, i) => s + f / Math.pow(1 + r, i), 0);
  let lo = -0.9, hi = 3;
  if (npvAt(lo) * npvAt(hi) > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const v = npvAt(mid);
    if (Math.abs(v) < 0.001) return mid;
    if (npvAt(lo) * v < 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}
