# AI & Ancillary Sectors — Stock Analysis Toolkit

Two Excel deliverables for tracking and analysing AI-value-chain equities.

## Deliverables

### 1. `AI_Sector_Stock_Tracker.xlsx` — the 60-stock watchlist
An at-a-glance, replicable tracker for the whole AI value chain.

- **`Read Me`** — legend and conventions.
- **`MASTER`** — every name on one line (60 companies), with blank quant columns and an auto-calculating `Upside %`.
- **9 sector tabs** — `Hardware`, `Infrastructure`, `Networking`, `Software`, `Cybersecurity`, `Industrial AI`, `Mobility AI`, `Healthcare AI`, `China AI` (grouping taken directly from the source watchlist). Each stock is one row with **qualitative fields pre-filled** (Business, AI Role, Markets & Demand, Country/Geo, Deals & Partnerships, Capital & Money Flows, Moat & Competitors, Risks, Catalysts, Thesis, ESG) and **quant + technical fields left blank** (yellow) for you to populate.

> The source watchlist had 64 rows, but 4 were duplicates (Symbotic, Tempus AI, IQVIA, Recursion). These were removed, leaving **60 unique companies**.

### 2. `Stock_Analysis_Template.xlsx` — the deep single-stock template
A reusable, sophisticated one-stock research template. Duplicate the `Analysis` + `Financials`
tabs per name, or overwrite for a fresh write-up.

- **`How to Use`** — legend, colour code, workflow.
- **`Analysis`** — the hero one-pager: recommendation snapshot, basic info/liquidity/float,
  business, markets & demand, country/geo exposure, competitive positioning (Porter's Five
  Forces mini + moat), deals, capital & money flows, investment thesis, valuation (relative
  multiples + quick DCF), risks, ESG, and a light technical strip.
- **`Financials`** — 3-year history + 3-year forecast skeleton; growth, margins, per-share and
  valuation lines auto-calculate.
- **`Peer Comps`** — small relative-valuation table with an auto-average to anchor the target.

## Conventions

- **Blue text / yellow fill** = your inputs. **Black** = formulas (don't overwrite). **Grey italic** = prompts.
- Percentages are stored as fractions — type `0.25` for 25%.
- The analysis structure follows the **CFA Institute "Equity Research Report Essentials"** sections,
  biased throughout toward the priorities: **markets · flows · deals · country**.

## Regeneration

```bash
pip install openpyxl
python3 build_tracker.py     # -> AI_Sector_Stock_Tracker.xlsx
python3 build_template.py    # -> Stock_Analysis_Template.xlsx
```

`company_data.py` holds the 60-company universe and all analyst-authored qualitative content.

## Caveats

Qualitative content is analyst-authored (knowledge as of early 2026) as a **starting frame**, not
a substitute for primary filings. Nothing here is investment advice — verify every figure before acting.
