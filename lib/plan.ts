// ============================================================
//  GTM + PHASED IMPLEMENTATION — the "how to actually start" layer.
// ============================================================

export const NICHE_FRAMEWORK = {
  intro: "White space ≠ empty market. It's the intersection where India's supply is real, global demand is structural, the current export is stuck at the low-value link, and a new entrant can plausibly enter. We score every industry on five axes and let the composite rank the field.",
  axes: [
    { k: "supply", label: "Supply strength", w: "16%", desc: "Does India already have the base — the fibre, the molecule, the cluster, the stones? De-risks execution." },
    { k: "demand", label: "Demand pull", w: "24%", desc: "Is global demand structural and growing, not cyclical? Size × momentum of the target market." },
    { k: "gap", label: "White-space gap", w: "28%", desc: "How far is India's current export from the value it could capture? Bigger gap = bigger prize. Highest weight." },
    { k: "margin", label: "Margin uplift", w: "22%", desc: "Points of gross margin the white-space product adds over India's commodity baseline. This is why you'd bother." },
    { k: "ease", label: "Entry feasibility", w: "10%", desc: "Capex intensity, regulatory friction, and time-to-first-cash for a NEW entrant (not an incumbent)." },
  ],
};

export const GTM = {
  modes: [
    { mode: "Merchant / trading-house", when: "Test demand before building. Buy from Indian producers, sell abroad on your paper.", capex: "₹1–3 Cr", risk: "Low", margin: "5–12%", note: "Fastest to first order; thin margins; no moat. Use to validate a corridor." },
    { mode: "Private-label converter", when: "Own the value-add step (cook, cut, formulate, finish) but not the brand.", capex: "₹15–45 Cr", risk: "Medium", margin: "18–30%", note: "The sweet spot for most white-spaces here — you capture the margin uplift without brand burn." },
    { mode: "Branded / DTC", when: "Own the customer. Highest margin, highest cost, slowest.", capex: "₹25–60 Cr", risk: "High", margin: "35–55%", note: "Only where brand is the moat (LGD jewellery). Otherwise premature." },
  ],
  channels: [
    { ch: "Anchor B2B off-take", desc: "Land 1–2 large private-label buyers before building capacity. De-risks utilisation and funds working capital.", weight: "Primary" },
    { ch: "Trade councils & buyer-seller meets", desc: "EEPC, GJEPC, MPEDA, Pharmexcil, AEPC organise subsidised delegations and buyer meets — the cheapest qualified-lead source.", weight: "High" },
    { ch: "In-market agent / JV", desc: "A local partner clears registration, distribution, and payment risk (essential for Brazil-MAPA, Japan-retail).", weight: "High" },
    { ch: "Certification-led inbound", desc: "The right certs (BRC/BAP, ISO 13485, IGI, UFLPA-clean) are themselves marketing — buyers filter suppliers on them.", weight: "Medium" },
    { ch: "Digital / marketplace", desc: "Alibaba/IndiaMART for discovery; DTC site only where brand is the play.", weight: "Situational" },
  ],
};

export type Phase = {
  n: string;
  title: string;
  window: string;
  spend: string;
  goal: string;
  steps: string[];
  gate: string;   // the decision gate to pass before the next phase
};

export const PHASES: Phase[] = [
  {
    n: "0", title: "Validate the corridor", window: "Month 0–3", spend: "₹15–40 L",
    goal: "Prove the demand is real and the price holds — before a rupee of capex.",
    steps: [
      "Pick ONE white-space × ONE country (the composite score does the shortlisting).",
      "Pull live HS-code trade data (DGCI&S, UN Comtrade, ITC Trade Map) — confirm import volume, growth, and price band.",
      "Secure IEC code, GST-LUT, AD-code, DGFT registration; open an EEFC account.",
      "Ship 2–3 sample/trial consignments as a merchant to test buyer response and landed cost.",
    ],
    gate: "≥1 credible buyer expresses repeat intent at a price that clears target margin. If not — re-pick, don't build.",
  },
  {
    n: "1", title: "Certify & secure off-take", window: "Month 3–9", spend: "₹1.5–4 Cr",
    goal: "Convert interest into a signed anchor and clear the compliance gates that gate the whole play.",
    steps: [
      "Obtain the certifications that unlock the buyer (BRC/BAP for seafood, ISO 13485 for medical textiles, IGI/GIA for LGD, MAPA dossiers for Brazil).",
      "Negotiate an anchor private-label off-take LOI — even non-binding — to underwrite utilisation.",
      "Lock raw-material supply (farm-gate contracts, Surat rough tie-ups, resin supply).",
      "Finalise site, apply for scheme benefits (RoDTEP, PLI/NTTM/MPEDA), model working-capital line with EXIM/bank.",
    ],
    gate: "Anchor LOI + certifications in hand + working-capital facility sanctioned. This is the capex go/no-go.",
  },
  {
    n: "2", title: "Build & qualify", window: "Month 9–18", spend: "Core capex (see model)",
    goal: "Install the value-add line and pass buyer qualification — the real bottleneck, not construction.",
    steps: [
      "Commission the line (IQF/cook, meltblown, casting, fermentation) — phased, not all capacity at once.",
      "Run buyer qualification / first-article approval; expect 3–18 months depending on sector (medical longest).",
      "Ship first commercial containers; instrument yield, rejection rate, and cash-cycle days obsessively.",
      "Hire the 6–10 roles that matter (QC head, export-docs, in-market agent) — keep everything else lean.",
    ],
    gate: "First commercial orders shipped and accepted at <target rejection rate; unit economics match the model within ±15%.",
  },
  {
    n: "3", title: "Ramp to steady-state", window: "Month 18–36", spend: "Working-capital scaling",
    goal: "Move from one buyer to a book; from ramp utilisation to steady-state; from break-even to cash generation.",
    steps: [
      "Add buyers 2–4 to lift utilisation toward the steady-state band (the model's biggest value lever).",
      "Tighten the cash cycle — export factoring, LC discounting, advance terms — this funds growth, not equity.",
      "Add a second shift / second line only once utilisation on line-1 clears ~75%.",
      "Layer a second country off the same asset (e.g., EU off a US-qualified line) to diversify tariff risk.",
    ],
    gate: "Positive operating cash flow, utilisation >70%, ≥3 active buyers, <1 customer >40% of revenue.",
  },
  {
    n: "4", title: "Compound & defend", window: "Year 3+", spend: "Reinvest EBITDA",
    goal: "Turn a working export into a defensible franchise — move up the value chain, not just out.",
    steps: [
      "Forward-integrate one more step (loose stone → brand; nonwoven → finished device; cooked → branded retail).",
      "Diversify corridors so no single tariff regime can break the business.",
      "Build proprietary IP / spec / brand equity — the only durable moat once others copy the corridor.",
      "Evaluate strategic exit vs. compounding: the terminal value in the model assumes a 3× EBITDA trade sale.",
    ],
    gate: "A franchise, not a factory: brand or spec ownership, multi-country book, EBITDA funding its own growth.",
  },
];

export const RISK_MATRIX = [
  { risk: "Tariff / trade-policy shock (esp. US)", likelihood: "High", impact: "High", mitigation: "Multi-country corridors from one asset; keep 1 market <40% of book; watch USTR/anti-dumping dockets." },
  { risk: "FX volatility (USD/JPY/BRL)", likelihood: "Medium", impact: "Medium", mitigation: "Forward cover 50–70% of receivables; price in hard currency; EEFC account to hold USD." },
  { risk: "Buyer qualification delay", likelihood: "High", impact: "Medium", mitigation: "Start certs in Phase 1; over-invest in QC; run parallel buyer pipelines so one delay ≠ zero revenue." },
  { risk: "Input price / supply shock", likelihood: "Medium", impact: "High", mitigation: "Farm-gate/rough/resin contracts; dual-source; pass-through clauses in buyer contracts." },
  { risk: "Working-capital squeeze", likelihood: "Medium", impact: "High", mitigation: "Export factoring + LC discounting + interest-subvention; the cash cycle is the real killer, not P&L." },
  { risk: "Value-chain deflation (e.g., LGD)", likelihood: "Medium", impact: "Medium", mitigation: "Compete on brand/spec not price; move up-chain faster than the commodity deflates." },
];
