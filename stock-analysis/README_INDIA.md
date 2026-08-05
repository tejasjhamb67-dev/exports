# India AI-Adopter Toolkit

Thesis: **India won't own foundation-model AI, but it will be one of the world's biggest ADOPTERS.**
These two files help find where that adoption re-rates listed Indian equities over ~10 years.

## Deliverables

### 1. `AI_Adoption_India_Repository.xlsx` — the literature repository
A filterable index of **real, published sources** (news, press releases, filings, consulting/industry
reports) on AI adoption by listed Indian companies. **Raw sources, not analysis.**

- **`Read Me`** — how to use + caveats.
- **`All Sources`** — every source as one row: Sector · Industry · Company · Ticker · AI Category ·
  Title · Publisher · Date · AI-application summary · **clickable Link**. Filter the header row.
- **`Summary`** — counts by sector, AI category, and top companies.

**Status this pass: 405 unique verified links** across 7 sector clusters (IT, BFSI, Telecom, Energy,
Metals, FMCG, Industrials, Auto, Capital-markets, Agri, Cross-sector). Every URL is real — none fabricated.

### 2. `India_AI_Adopter_Screener.xlsx` — the screening template
- **`Read Me`** — legend and workflow.
- **`Screener`** — blank template: Ticker · Company · Sector · Industry · a full financials block
  (CMP, Mkt Cap, Revenue, Rev CAGR, EBITDA margin, PAT, EPS, P/E, P/B, ROE, ROCE, D/E, Promoter %,
  Div yield, Target, **Upside % auto-calc**) · then the AI block (Business Use of AI · AI Category ·
  Adoption Stage · AI Potential Upside · Where Value Is Created · Value Lever · 10-Yr Industry Impact ·
  AI Impact 1-5 · Long Conviction · Key Risk · Sources).
- **`Examples`** — 25 real Indian AI-adopters filled in as worked rows (financials left blank for you).
- **`Sector AI-Impact Map`** — 19 sectors scored 1-5 for how much AI reshapes them by ~2035, with the
  primary value lever, adoption maturity, a 10-year thesis, and representative long ideas per sector.

## Why "thousands of links" needs more than one session

This environment caps **web search at 200 queries per session** (shared across all research agents) and
**blocks direct page-fetching** by network policy. So one session has a hard ceiling — this pass used a
single 200-query budget across 8 sector agents. Two agents (pharma/healthcare, and part of the
cross-sector pass) were cut off by a session limit, so **pharma/healthcare is the main gap**.

### How to grow it toward thousands (append-only, no duplicates)

Each **fresh session** gets a new 200-query budget. The compiler de-duplicates by URL, so just keep adding:

```bash
# In a fresh session, re-run the sector research agents (esp. the gaps:
# pharma/healthcare, cement, chemicals, retail, media, defence, logistics, new-age platforms).
# They write JSONL into repo_data/ using the same 10-key schema:
#   {"sector","industry","company","ticker","title","publisher","date","url","ai_category","summary"}
python3 build_repository.py     # merges all repo_data/*.jsonl -> AI_Adoption_India_Repository.xlsx
```

New unique links merge in automatically; duplicates are ignored. Alternatively, ask your org to raise
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` and/or allow-list news domains for fetching.

## Regeneration

```bash
pip install openpyxl
python3 build_india_template.py   # -> India_AI_Adopter_Screener.xlsx
python3 build_repository.py        # -> AI_Adoption_India_Repository.xlsx (from repo_data/*.jsonl)
```

`india_template_data.py` holds the worked examples + sector map. `repo_data/*.jsonl` holds the raw
gathered sources (one JSON object per line).

## Caveats

Qualitative content in the screener is a **starting frame** (knowledge as of early 2026), not investment
advice. The repository is a reading list — verify every source and figure before acting.
