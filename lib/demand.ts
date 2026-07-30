// ============================================================
//  DEMAND LAYER — world markets as import destinations.
//  `intensity` (0–100) drives the world choropleth: a blended read of
//  market size × India's head-room × strategic fit for a new entrant.
//  Names match WORLD geometry keys in geo.ts.
// ============================================================

export type DemandRow = {
  name: string;       // geometry key
  short: string;
  region: string;
  intensity: number;  // 0-100 for choropleth
  indiaExp: number;   // US$B India exports there today (FY25, approx)
  imports: string;    // total goods imports, context
  wants: string[];    // white-space products this market pulls
  share: string;      // India's current share of their imports
  hook: string;       // the one-line reason to target
};

export const DEMAND: DemandRow[] = [
  { name: "United States of America", short: "USA", region: "N. America", intensity: 100, indiaExp: 86.5, imports: "~US$3.2T", share: "~2.7%",
    wants: ["GLP-1 & peptide APIs", "Branded LGD jewellery", "Technical textiles", "Engineered quartz", "UFLPA-clean solar", "High-mix EMS"],
    hook: "Every China+1 mandate points here. Highest price, deepest pockets, most white-space pull — but tariff-watch." },
  { name: "Germany", short: "Germany", region: "Europe", intensity: 84, indiaExp: 10.5, imports: "~US$1.5T", share: "~0.7%",
    wants: ["EV drivetrain & e-axles", "Specialty chemicals", "Technical textiles"],
    hook: "OEM heartland electrifying under the 2035 ICE ban — re-sourcing EV parts to China-alternative bases." },
  { name: "Brazil", short: "Brazil", region: "LatAm", intensity: 82, indiaExp: 6.5, imports: "~US$240B", share: "~2.5%",
    wants: ["Agri-biologicals", "Generic agrochemicals", "Pharma", "Two-wheeler & auto parts"],
    hook: "Largest agri-input market on earth, fastest biologicals adoption; registration friendlier than EU." },
  { name: "Japan", short: "Japan", region: "Asia-Pac", intensity: 80, indiaExp: 5.1, imports: "~US$800B", share: "~0.6%",
    wants: ["Value-added seafood", "Specialty chemicals", "Generic pharma"],
    hook: "Pays 30–50% premium for cooked/value-added seafood; diversifying away from Chinese supply." },
  { name: "United Arab Emirates", short: "UAE", region: "MENA", intensity: 78, indiaExp: 37.0, imports: "~US$400B", share: "~9%",
    wants: ["LGD jewellery", "Processed food", "Ceramics", "Pharma"],
    hook: "CEPA in force → tariff-free; a re-export springboard into MENA & Africa." },
  { name: "Netherlands", short: "Netherlands", region: "Europe", intensity: 74, indiaExp: 25.0, imports: "~US$650B", share: "~3.8%",
    wants: ["Specialty chemicals", "Electronics", "Agri-processed"],
    hook: "Rotterdam = the EU's front door; a distribution beachhead for the whole bloc." },
  { name: "United Kingdom", short: "UK", region: "Europe", intensity: 76, indiaExp: 14.5, imports: "~US$700B", share: "~2%",
    wants: ["Apparel & technical textiles", "Footwear", "Value-added marine", "Pharma"],
    hook: "India–UK FTA (2025) zeroes tariffs on ~99% of lines — a step-change unlock." },
  { name: "Saudi Arabia", short: "KSA", region: "MENA", intensity: 66, indiaExp: 11.6, imports: "~US$180B", share: "~6%",
    wants: ["Ceramics & surfaces", "Rice & food", "Engineering goods"],
    hook: "Vision-2030 construction boom pulling surfaces, building materials, food." },
  { name: "Vietnam", short: "Vietnam", region: "Asia-Pac", intensity: 58, indiaExp: 8.5, imports: "~US$380B", share: "~2.2%",
    wants: ["Specialty chemicals", "Cotton & yarn", "Auto components"],
    hook: "The other 'China+1' factory floor — pulls intermediates India can feed." },
  { name: "Australia", short: "Australia", region: "Asia-Pac", intensity: 60, indiaExp: 8.0, imports: "~US$300B", share: "~2.6%",
    wants: ["Pharma", "Technical textiles", "Agrochemicals"],
    hook: "ECTA trade pact live; friendly market, low competitive intensity." },
  { name: "France", short: "France", region: "Europe", intensity: 56, indiaExp: 7.0, imports: "~US$850B", share: "~0.8%",
    wants: ["Specialty chemicals", "Textiles", "Aerospace parts"],
    hook: "Aerospace & luxury supply chains; strategic-partnership tailwind." },
  { name: "South Korea", short: "S. Korea", region: "Asia-Pac", intensity: 72, indiaExp: 6.5, imports: "~US$640B", share: "~1%",
    wants: ["Electronic-grade chemicals", "Battery materials", "Specialty chemicals"],
    hook: "Densest semiconductor + battery base; diversifying purity-critical inputs off Japan/China." },
  { name: "Nigeria", short: "Nigeria", region: "Africa", intensity: 48, indiaExp: 4.5, imports: "~US$100B", share: "~4%",
    wants: ["Generic pharma", "Two-wheelers", "Processed food"],
    hook: "Africa's largest market; India already the trusted generics supplier." },
  { name: "South Africa", short: "S. Africa", region: "Africa", intensity: 46, indiaExp: 5.0, imports: "~US$110B", share: "~4.5%",
    wants: ["Pharma", "Auto components", "Agrochemicals"],
    hook: "Gateway to sub-Saharan Africa; auto & pharma corridors established." },
  { name: "Mexico", short: "Mexico", region: "LatAm", intensity: 62, indiaExp: 5.5, imports: "~US$600B", share: "~0.9%",
    wants: ["Auto components", "Pharma", "Specialty chemicals"],
    hook: "Nearshoring hub for the US; auto-parts pull as OEMs relocate from Asia." },
  { name: "Indonesia", short: "Indonesia", region: "Asia-Pac", intensity: 52, indiaExp: 6.0, imports: "~US$240B", share: "~2.5%",
    wants: ["Agrochemicals", "Pharma", "Engineering goods"],
    hook: "Large agri economy; refined-fuel & buffalo-meat corridors already deep." },
  { name: "Bangladesh", short: "Bangladesh", region: "Asia-Pac", intensity: 40, indiaExp: 9.0, imports: "~US$90B", share: "~10%",
    wants: ["Cotton & yarn", "Machinery"],
    hook: "Huge apparel-input pull but political risk elevated — manage exposure." },
];

export const REGIONS = ["N. America", "Europe", "Asia-Pac", "MENA", "LatAm", "Africa"];
