# Bharat Export Atlas

An interactive **supply × demand intelligence model** of India's export economy, and a
data-grounded **white-space entry thesis** for a new exporter — built to be read by an
investment committee, not graded as a class project.

> India makes **US$437B** of merchandise exports. The money is in the *next link up*.
> This model maps who makes what and where, matches it to structural global demand, isolates
> the white-space product × target country a new entrant can win — then prices it.

## What's inside (9 tabs)

| Tab | What it does |
|-----|--------------|
| **Cover** | The thesis, FY25 export mix, and where every number comes from |
| **Supply Map** | Interactive map of India — hover a state, click to zoom into its cities, players & products. Built from **2,000 real companies** (BS1000) |
| **Demand Map** | Interactive world map — demand intensity choropleth + India→market flow arcs |
| **Niche** | 5-axis white-space scoring engine (gap · demand · margin · supply · ease) across 11 industries |
| **Product** | One white-space product per industry: today → white space → target country, with the logic |
| **The Plan** | Decision funnel, recommended flagship, and a risk register |
| **Financial Model** | A **live** model — drag the drivers, IRR/payback/J-curve recompute; bear→bull ranges |
| **GTM** | Entry modes, buyer-acquisition channels, and the compliance spine |
| **Phases** | Five-phase build order, each with a decision gate |

## Data provenance

- **Supply / players / market caps** — Business Standard **BS1000** (FY25): 1,000 listed +
  500 unlisted + mid-cap companies. Revenue, market cap, sector and HQ city are *as reported*;
  state supply is the summed financials of real, named firms (985/1000 geo-located).
- **India export totals & mix** — Ministry of Commerce / DGCI&S; PIB (Apr 2025).
- **Global TAM & CAGR** — named research houses, triangulated and shown as ranges.
- **Unit economics** — bottom-up builds from published realised prices, DGFT incentive
  schedules and sector-council benchmarks. Ranges, never false precision.

Maps are rendered from real GeoJSON (India state boundaries dissolved from Census districts;
world from Natural Earth), pre-projected to SVG paths at build time — **no runtime map or
chart library**, so the build is dependency-light and deploys clean.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production
```

## Deploy to Vercel

This is a standard **Next.js (App Router)** app — Vercel auto-detects everything.

1. Push this branch to GitHub (already connected).
2. In Vercel → **New Project** → import the `exports` repo (or, if already imported, it will
   deploy on push). No environment variables, no build config needed.
3. Framework preset: **Next.js**. Build command `next build`, output handled automatically.

Every push to the connected branch triggers a fresh deployment.

## Stack

Next.js 14 · React 18 · TypeScript · a hand-built CSS design system and hand-rendered SVG
maps/charts. Zero external UI, map, or chart dependencies.

---
*Figures are shown as ranges for feasibility screening. Not investment advice.*
