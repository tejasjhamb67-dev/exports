// ============================================================
//  BHARAT EXPORT ATLAS — Strategic data layer
//  Every macro figure is sourced (see `provenance`). Company-level
//  figures come from BS1000 (see supply.ts). Strategic judgements
//  (white-space, target market, unit economics) are stated as RANGES
//  with an explicit basis note, never as false precision.
// ============================================================

export const META = {
  title: "Bharat Export Atlas",
  subtitle: "A supply–demand intelligence model of India's export economy, and a white-space entry thesis",
  fy: "FY2024–25",
  authoredFor: "Investment Committee review — new-entrant export venture",
};

// USD→INR assumption used wherever a global TAM is bridged to rupee economics.
export const FX = 86; // ₹/US$, FY25 average band ₹83–₹87

export const PROVENANCE = [
  { tag: "Supply / players", src: "Business Standard BS1000 (FY25) — 1,000 listed + 500 unlisted + mid-cap league tables. Revenue, market-cap, sector, HQ city are as-reported.", conf: "Hard data" },
  { tag: "India export totals", src: "Ministry of Commerce & Industry / DGCI&S; PIB releases (Apr 2025). Merchandise US$437.4B; goods+services US$820.9B.", conf: "Official" },
  { tag: "Commodity & country mix", src: "DGCI&S QRMFT; Invest India; sector export councils (EEPC, Pharmexcil, GJEPC, MPEDA, AEPC).", conf: "Official / council" },
  { tag: "Global TAM & CAGR", src: "Named market-research houses (Precedence, Fortune BI, Grand View, MarketsandMarkets) — cited per figure. Triangulated; shown as ranges.", conf: "Estimate — range" },
  { tag: "Unit economics", src: "Bottom-up build from published realised prices, DGFT duty-drawback/RoDTEP rates, EXIM Bank & sector-council cost benchmarks. Ranges, not point estimates.", conf: "Modelled — range" },
];

// ---------- Macro KPIs ----------
export const KPIS = [
  { label: "Merchandise exports", val: "437", unit: "US$B", sub: "FY25 · +0.08% YoY · flat = the problem", tone: "" },
  { label: "Goods + services", val: "821", unit: "US$B", sub: "FY25 · +5.5% · services doing the lifting", tone: "teal" },
  { label: "Companies analysed", val: "2,000", unit: "", sub: "BS1000 listed + unlisted + mid-cap", tone: "green" },
  { label: "Export concentration", val: "~52", unit: "%", sub: "top-10 destinations = half of exports", tone: "violet" },
];

// ---------- Commodity mix (US$B, FY25) ----------
// Basis: DGCI&S / sector councils. Values are FY25 or latest-available, rounded.
export const EXPORT_MIX = [
  { cat: "Engineering goods", usd: 116.7, share: 26.7, growth: 6.7, note: "auto parts, machinery, iron & steel articles, electricals" },
  { cat: "Petroleum products", usd: 60.1, share: 13.7, growth: -20, note: "refined fuels; volatile with crude & Russian-crude arbitrage" },
  { cat: "Electronic goods", usd: 38.6, share: 8.8, growth: 32, note: "smartphones now #1 line item; PLI-driven, fastest riser" },
  { cat: "Chemicals (organic+inorganic)", usd: 30.1, share: 6.9, growth: 3, note: "intermediates, dyes, agro-actives" },
  { cat: "Pharmaceuticals", usd: 30.5, share: 7.0, growth: 9.4, note: "generics & formulations; 'pharmacy of the world'" },
  { cat: "Gems & jewellery", usd: 28.5, share: 6.5, growth: -12, note: "cut diamonds weak; lab-grown the bright spot" },
  { cat: "Textiles & apparel", usd: 36.0, share: 8.2, growth: 6, note: "cotton yarn, RMG, home textiles" },
  { cat: "Agri & processed food", usd: 48.2, share: 11.0, growth: 4, note: "rice, marine, spices, sugar, coffee, buffalo meat" },
  { cat: "Others", usd: 48.8, share: 11.2, growth: 2, note: "plastics, leather, ores, ceramics, misc" },
];

// ---------- Top destinations (US$B, FY25) ----------
export const DESTINATIONS = [
  { c: "United States of America", short: "USA", usd: 86.5, growth: 11.6, note: "largest market; pharma, gems, engineering, electronics, textiles" },
  { c: "United Arab Emirates", short: "UAE", usd: 37.0, growth: 7, note: "CEPA tailwind; re-export hub, jewellery, cereals, refined fuel" },
  { c: "Netherlands", short: "Netherlands", usd: 25.0, growth: 12, note: "EU gateway (Rotterdam); fuels, chemicals, electronics" },
  { c: "China", short: "China", usd: 14.3, growth: -3, note: "ores, organic chemicals, cotton — raw, low value-add" },
  { c: "United Kingdom", short: "UK", usd: 14.5, growth: 12, note: "FTA signed 2025 — apparel, footwear, marine set to unlock" },
  { c: "Singapore", short: "Singapore", usd: 14.4, growth: 5, note: "electronics, fuel, machinery; ASEAN pivot" },
  { c: "Germany", short: "Germany", usd: 10.5, growth: 5, note: "engineering, textiles, chemicals, auto parts" },
  { c: "Saudi Arabia", short: "KSA", usd: 11.6, growth: 3, note: "rice, engineering, ceramics, chemicals" },
  { c: "Bangladesh", short: "Bangladesh", usd: 9.0, growth: -10, note: "cotton, machinery; political risk elevated" },
  { c: "Japan", short: "Japan", usd: 5.1, growth: 2, note: "marine, chemicals, ores — under-penetrated, premium" },
];

// ============================================================
//  INDUSTRIES — one white-space product per industry.
//  Each: where India plays today, real players (BS1000), current
//  destinations, the underserved product, target country, the logic,
//  and a sized-range opportunity.
// ============================================================
export type Industry = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  exportToday: string;         // what India exports now
  indiaExportUsd: string;      // current export scale
  players: string[];           // real, from BS1000
  clusters: string[];          // where in India
  destNow: string[];           // current destinations
  whitespace: string;          // the underserved product
  whyGap: string;              // why it's a gap / why now
  target: string;              // target country
  targetWhy: string;           // why that country
  tam: string;                 // global TAM range
  tamCagr: string;
  indiaShareNow: string;
  marginUplift: string;        // margin vs commodity baseline
  score: { supply: number; demand: number; gap: number; margin: number; ease: number }; // 0-100
};

export const INDUSTRIES: Industry[] = [
  {
    id: "specialty-chem",
    name: "Specialty & Fine Chemicals",
    emoji: "⚗️",
    color: "#9b8cff",
    exportToday: "Bulk intermediates, dyes & pigments, basic organics",
    indiaExportUsd: "US$30B chemicals (mostly commodity-grade)",
    players: ["Deepak Nitrite", "Aarti Industries", "PCBL Chemical", "Pidilite", "SRF (mid)"],
    clusters: ["Gujarat (Vadodara–Bharuch)", "Maharashtra"],
    destNow: ["USA", "China", "Netherlands", "Germany"],
    whitespace: "Electronic-grade & battery-grade specialty chemicals (high-purity solvents, electrolyte salts, semiconductor process chemicals)",
    whyGap: "India makes the molecule but not the purity. >90% of high-purity electronic chemicals are imported (Japan/Korea/Germany). China+1 + global fab build-out (US CHIPS, EU Chips Act) is de-risking this supply chain right now.",
    target: "South Korea",
    targetWhy: "World's densest semiconductor + battery manufacturing base (Samsung, SK, LG), actively diversifying purity-critical inputs away from Japan/China after 2019 export controls.",
    tam: "US$85–95B (electronic chemicals)",
    tamCagr: "6–8%",
    indiaShareNow: "<2%",
    marginUplift: "+18–28 pts vs bulk",
    score: { supply: 78, demand: 88, gap: 90, margin: 82, ease: 42 },
  },
  {
    id: "agrochem",
    name: "Agrochemicals & Crop Science",
    emoji: "🌾",
    color: "#47cf8f",
    exportToday: "Off-patent technicals, generic formulations, contract manufacturing",
    indiaExportUsd: "~US$5.5B agrochemicals",
    players: ["UPL", "PI Industries", "Rallis India", "Sharda Cropchem", "Bayer CropScience"],
    clusters: ["Gujarat", "Maharashtra", "Telangana"],
    destNow: ["USA", "Brazil", "EU", "Australia"],
    whitespace: "Biological crop protection — bio-pesticides, bio-stimulants, microbial & fermentation-based actives",
    whyGap: "India exports synthetic generics into a market that is regulating them out. Biologicals are the fastest-growing crop-input segment and India has the fermentation capacity + cost base but almost no branded export presence.",
    target: "Brazil",
    targetWhy: "Largest agri-input market on earth and the fastest-adopting biologicals market (~25% CAGR); registration pathway (MAPA) friendlier to biologicals than EU; year-round cropping.",
    tam: "US$14–17B (agri-biologicals), →US$35B by 2030",
    tamCagr: "13–15%",
    indiaShareNow: "~1–2%",
    marginUplift: "+15–25 pts",
    score: { supply: 72, demand: 84, gap: 80, margin: 70, ease: 58 },
  },
  {
    id: "pharma",
    name: "Pharmaceuticals",
    emoji: "💊",
    color: "#4aa3ff",
    exportToday: "Generic formulations, APIs, drug intermediates",
    indiaExportUsd: "US$30.5B (world's #1 generics by volume)",
    players: ["Sun Pharma", "Dr Reddy's", "Aurobindo", "Cipla", "Zydus", "Lupin"],
    clusters: ["Telangana (Hyderabad)", "Gujarat", "Maharashtra"],
    destNow: ["USA", "EU", "Africa", "UK"],
    whitespace: "GLP-1 & peptide APIs + complex injectables (biosimilars, depot/long-acting formulations)",
    whyGap: "India owns small-molecule generics but under-indexes on peptides/biologics. The GLP-1 (semaglutide/Ozempic-class) patent cliff opens 2026 in key markets — a once-in-a-decade generic wave India is racing to supply, not lead.",
    target: "United States of America",
    targetWhy: "Largest, highest-price pharma market; GLP-1 demand structurally supply-short; USFDA-approved Indian sites already the largest ex-US base — regulatory moat already built.",
    tam: "US$150B GLP-1 by 2030; peptide-API US$25–30B",
    tamCagr: "10–24% (GLP-1 class)",
    indiaShareNow: "Small-molecule ~20%; peptide <5%",
    marginUplift: "+20–35 pts vs oral generics",
    score: { supply: 90, demand: 92, gap: 74, margin: 85, ease: 35 },
  },
  {
    id: "marine",
    name: "Marine & Processed Food",
    emoji: "🦐",
    color: "#38c7cc",
    exportToday: "Frozen raw shrimp (HOSO/HLSO), basmati & non-basmati rice, buffalo meat",
    indiaExportUsd: "US$7.4B marine; ~US$11B rice",
    players: ["Avanti Feeds", "Hatsun Agro", "LT Foods", "KRBL", "HMA Agro"],
    clusters: ["Andhra Pradesh (shrimp)", "Gujarat", "Punjab (rice)"],
    destNow: ["USA", "China", "EU", "Middle East"],
    whitespace: "Value-added / ready-to-eat seafood — breaded, cooked, marinated, retail-pack IQF shrimp & fish",
    whyGap: "India exports the cheapest link — raw frozen block — while Vietnam/Thailand capture the cooked-&-branded margin. US anti-dumping + 2025 tariff risk on Indian raw shrimp makes value-add + market diversification a survival move, not just upside.",
    target: "Japan",
    targetWhy: "World's premium seafood market, pays 30–50% more for cooked/value-added, culturally shrimp-heavy, and actively diversifying away from Chinese supply post-Fukushima water dispute.",
    tam: "US$55–65B (global shrimp), value-added ~40%",
    tamCagr: "5–7%",
    indiaShareNow: "~raw leader; value-add <5%",
    marginUplift: "+12–20 pts vs raw block",
    score: { supply: 82, demand: 78, gap: 85, margin: 68, ease: 66 },
  },
  {
    id: "auto",
    name: "Auto Components",
    emoji: "⚙️",
    color: "#eab24a",
    exportToday: "ICE drivetrain, forgings, castings, wiring, batteries, lighting",
    indiaExportUsd: "~US$21B auto components",
    players: ["Samvardhana Motherson", "Bosch", "Bharat Forge", "Uno Minda", "Exide"],
    clusters: ["Delhi-NCR (Gurugram)", "Maharashtra (Pune)", "Tamil Nadu (Chennai)"],
    destNow: ["USA", "Germany", "UK", "Japan"],
    whitespace: "EV drivetrain — traction motors, e-axles, battery management systems (BMS), power electronics, magnetics",
    whyGap: "India's US$21B component base is 80% ICE-legacy. As global OEMs electrify, the value migrates to motors/electronics India barely exports — a cliff for incumbents and an open field for entrants.",
    target: "Germany",
    targetWhy: "Europe's OEM heartland (VW, BMW, Mercedes, Bosch) electrifying under EU 2035 ICE ban; aggressively re-sourcing EV parts to low-cost, China-alternative bases with engineering depth.",
    tam: "US$120–160B (EV components) by 2030",
    tamCagr: "18–22%",
    indiaShareNow: "<3% of EV parts",
    marginUplift: "+10–18 pts vs ICE parts",
    score: { supply: 80, demand: 86, gap: 82, margin: 64, ease: 48 },
  },
  {
    id: "defence",
    name: "Aerospace & Defence",
    emoji: "🛡️",
    color: "#f0645f",
    exportToday: "Ammunition, explosives, sub-systems, shipbuilding, avionics parts",
    indiaExportUsd: "US$2.6B defence exports (FY25 record)",
    players: ["Solar Industries", "Bharat Electronics", "HAL", "Bharat Forge", "Mazagon Dock"],
    clusters: ["Karnataka (Bengaluru)", "Maharashtra (Nagpur)"],
    destNow: ["USA", "France", "Armenia", "SE Asia"],
    whitespace: "Loitering munitions, tactical UAVs/drones, and precision ammunition for non-aligned buyers",
    whyGap: "India's defence exports are sub-systems & components going into others' platforms. Complete, affordable, combat-relevant systems (drones, munitions) are the fastest-growing global demand — and India has cost + a neutral-supplier positioning the West and Russia lack.",
    target: "Philippines / SE Asia",
    targetWhy: "BrahMos deal already opened the door; ASEAN nations arming against regional pressure want capable, affordable, politically-neutral suppliers — India fits where US is costly and Russia is sanctioned.",
    tam: "US$12–14B (military drones) by 2030",
    tamCagr: "14–16%",
    indiaShareNow: "<1%",
    marginUplift: "+25–40 pts (systems vs parts)",
    score: { supply: 66, demand: 80, gap: 88, margin: 88, ease: 30 },
  },
  {
    id: "electronics",
    name: "Electronics & EMS",
    emoji: "📱",
    color: "#4aa3ff",
    exportToday: "Smartphones (assembly), chargers, wearables, PCB assembly",
    indiaExportUsd: "US$38.6B electronics (+32%)",
    players: ["Dixon Technologies", "Amber Enterprises", "Polycab", "Havells", "LG India"],
    clusters: ["Tamil Nadu", "Delhi-NCR (Noida)", "Karnataka"],
    destNow: ["USA", "UAE", "Netherlands", "Italy"],
    whitespace: "Components & high-mix EMS — precision enclosures, magnetics, hearables, medical & industrial electronics (not just phone assembly)",
    whyGap: "India assembles but imports ~85% of the bill-of-materials. The value (and the resilience premium) sits in components and higher-mix industrial/medical EMS, where China+1 demand is desperate for a second source.",
    target: "United States of America",
    targetWhy: "Apple's India build-out proves the corridor; US buyers (Big Tech, medical, defence-adjacent) are under explicit board mandates to de-risk from China — willing to pay a resilience premium.",
    tam: "US$1.0–1.1T (global EMS)",
    tamCagr: "7–9%",
    indiaShareNow: "~4% of EMS",
    marginUplift: "+8–15 pts (components vs assembly)",
    score: { supply: 74, demand: 90, gap: 78, margin: 60, ease: 52 },
  },
  {
    id: "jewellery",
    name: "Gems & Jewellery",
    emoji: "💎",
    color: "#6fe0e3",
    exportToday: "Cut & polished natural diamonds, gold jewellery, LGD rough/polished",
    indiaExportUsd: "US$28.5B (natural diamond weak, LGD +growth)",
    players: ["Titan", "Renaissance Global", "Vaibhav Global", "Asian Star", "Kalyan"],
    clusters: ["Gujarat (Surat)", "Maharashtra (Mumbai)"],
    destNow: ["USA", "UAE", "Hong Kong", "Belgium"],
    whitespace: "Branded, certified lab-grown-diamond FINISHED jewellery (DTC / retail-grade), not loose stones",
    whyGap: "Surat already cuts ~15% of the world's LGD rough — but India ships loose stones and lets US/EU brands capture the retail margin. Owning certified, branded finished LGD jewellery is the value India is leaving on the table.",
    target: "United States of America",
    targetWhy: "~80% of global LGD retail demand; price-elastic millennial/Gen-Z buyers who've de-stigmatised lab-grown; India already supplies the stones — forward-integration, not a cold start.",
    tam: "US$30B LGD (2025) →US$55–90B by 2033",
    tamCagr: "13–14%",
    indiaShareNow: "Rough ~15%; finished-brand <2%",
    marginUplift: "+30–45 pts (branded vs loose)",
    score: { supply: 84, demand: 82, gap: 84, margin: 90, ease: 60 },
  },
  {
    id: "textiles",
    name: "Textiles — Technical",
    emoji: "🧵",
    color: "#9b8cff",
    exportToday: "Cotton yarn, RMG, home textiles (towels, bedsheets)",
    indiaExportUsd: "US$36B textiles & apparel",
    players: ["Welspun Living", "Vardhman", "Arvind", "KPR Mill", "Trident (mid)"],
    clusters: ["Tamil Nadu (Tiruppur)", "Gujarat", "Punjab (Ludhiana)"],
    destNow: ["USA", "EU", "UK", "UAE"],
    whitespace: "Technical & performance textiles — medical nonwovens, meltblown, geo/agro-textiles, industrial filtration",
    whyGap: "India competes on the world's most commoditised, tariff-exposed textile lines. Technical textiles are 5–8x the margin, tariff-light, and China-dominated — a segment India's textile base can pivot into with the fibre it already spins.",
    target: "United States of America",
    targetWhy: "Largest technical-textiles importer; post-COVID medical-nonwoven reshoring + explicit 'not-from-China' procurement in medical & defence supply chains.",
    tam: "US$220–250B (technical textiles)",
    tamCagr: "5–6%",
    indiaShareNow: "~4–5%",
    marginUplift: "+15–25 pts vs cotton RMG",
    score: { supply: 76, demand: 74, gap: 80, margin: 72, ease: 62 },
  },
  {
    id: "ceramics",
    name: "Ceramics & Surfaces",
    emoji: "🏺",
    color: "#eab24a",
    exportToday: "Ceramic tiles, sanitaryware (Morbi cluster)",
    indiaExportUsd: "~US$4–5B ceramics",
    players: ["Kajaria Ceramics", "Cera Sanitaryware", "Somany", "Asian Granito"],
    clusters: ["Gujarat (Morbi)", "Delhi-NCR"],
    destNow: ["USA", "Gulf", "Africa", "SE Asia"],
    whitespace: "Engineered quartz & large-format porcelain slabs (countertops/surfaces) — not commodity floor tiles",
    whyGap: "Morbi is the world's 2nd-largest tile cluster but exports low-value floor tiles. Engineered quartz surfaces carry 3–4x the value; US anti-dumping on Chinese quartz (330%+) has vacated a multi-billion-dollar slot India can fill.",
    target: "United States of America",
    targetWhy: "US quartz-surface demand surged as Chinese supply was tariffed out; India already has the raw quartz, the kilns, and the cluster labour — a duty-arbitrage white space.",
    tam: "US$20–25B (engineered stone)",
    tamCagr: "5–7%",
    indiaShareNow: "~5–7%",
    marginUplift: "+15–22 pts vs floor tile",
    score: { supply: 70, demand: 72, gap: 78, margin: 66, ease: 64 },
  },
  {
    id: "greentech",
    name: "Green-Energy Equipment",
    emoji: "🔋",
    color: "#47cf8f",
    exportToday: "Cables, transformers, some solar modules",
    indiaExportUsd: "Emerging (module exports ~US$2B, rising fast)",
    players: ["Polycab", "Apar Industries", "Havells", "Siemens", "Waaree (mid)"],
    clusters: ["Gujarat", "Maharashtra", "Tamil Nadu"],
    destNow: ["USA", "EU", "Africa", "Middle East"],
    whitespace: "Solar modules & balance-of-system for the US market (UFLPA-compliant, non-China supply chain)",
    whyGap: "The US UFLPA effectively bans Chinese-linked solar; the IRA is subsidising domestic + allied supply. India is the only scaled, allied, non-China module base — a policy-created white space with a closing window.",
    target: "United States of America",
    targetWhy: "IRA + UFLPA = a subsidised, protected, China-excluded market with 40+ GW/yr of unmet demand and Indian modules already qualifying (Waaree/Premier's US order books prove it).",
    tam: "US$60–80B (global modules)",
    tamCagr: "8–12%",
    indiaShareNow: "~3–4% of US imports, rising",
    marginUplift: "policy-premium +10–20 pts",
    score: { supply: 68, demand: 88, gap: 76, margin: 62, ease: 50 },
  },
];

// ---------- White-space composite score ----------
export function composite(s: Industry["score"]) {
  // weighted: gap 0.28, demand 0.24, margin 0.22, supply 0.16, ease 0.10
  return Math.round(s.gap * 0.28 + s.demand * 0.24 + s.margin * 0.22 + s.supply * 0.16 + s.ease * 0.10);
}
