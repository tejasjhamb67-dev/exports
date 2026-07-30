// Single source of truth for the guided narrative: order, labels, and act grouping.
export type FlowStep = { id: string; label: string; i: string; act: string; actShort: string; actN: string };

export const FLOW: FlowStep[] = [
  { id: "cover",     label: "Cover",           i: "00", act: "Overview",         actShort: "Overview", actN: "" },
  { id: "mapping",   label: "Supply Map",      i: "01", act: "Diagnose",         actShort: "Diagnose", actN: "I" },
  { id: "countries", label: "Demand Map",      i: "02", act: "Diagnose",         actShort: "Diagnose", actN: "I" },
  { id: "niche",     label: "Niche",           i: "03", act: "Decide",           actShort: "Decide",   actN: "II" },
  { id: "product",   label: "Product",         i: "04", act: "Decide",           actShort: "Decide",   actN: "II" },
  { id: "plan",      label: "The Plan",        i: "05", act: "Decide",           actShort: "Decide",   actN: "II" },
  { id: "financial", label: "Financial Model", i: "06", act: "Price",            actShort: "Price",    actN: "III" },
  { id: "gtm",       label: "GTM",             i: "07", act: "Execute",          actShort: "Execute",  actN: "IV" },
  { id: "phases",    label: "Phases",          i: "08", act: "Execute",          actShort: "Execute",  actN: "IV" },
];

// the four acts for the cover journey map
export const ACTS = [
  { n: "I",   title: "Diagnose",  desc: "Map where India makes things, and where the world wants to buy.", tabs: "Supply · Demand", go: "mapping" },
  { n: "II",  title: "Decide",    desc: "Score the white spaces, then pick one product and one country.", tabs: "Niche · Product · Plan", go: "niche" },
  { n: "III", title: "Price",     desc: "Model the money — capex, IRR, payback, ranges — live.", tabs: "Financial model", go: "financial" },
  { n: "IV",  title: "Execute",   desc: "How to enter, and the phased build order to start.", tabs: "GTM · Phases", go: "gtm" },
];
