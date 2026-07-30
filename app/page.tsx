"use client";
import React, { useState, useEffect } from "react";
import Cover from "@/components/tabs/Cover";
import Mapping from "@/components/tabs/Mapping";
import Niche from "@/components/tabs/Niche";
import Product from "@/components/tabs/Product";
import Plan from "@/components/tabs/Plan";
import Countries from "@/components/tabs/Countries";
import Financial from "@/components/tabs/Financial";
import GTMTab from "@/components/tabs/GTM";
import Phases from "@/components/tabs/Phases";

const TABS = [
  { id: "cover", label: "Cover", i: "00" },
  { id: "mapping", label: "Supply Map", i: "01" },
  { id: "countries", label: "Demand Map", i: "02" },
  { id: "niche", label: "Niche", i: "03" },
  { id: "product", label: "Product", i: "04" },
  { id: "plan", label: "The Plan", i: "05" },
  { id: "financial", label: "Financial Model", i: "06" },
  { id: "gtm", label: "GTM", i: "07" },
  { id: "phases", label: "Phases", i: "08" },
];

export default function Home() {
  const [tab, setTab] = useState("cover");
  const go = (t: string) => { setTab(t); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const h = () => { const id = window.location.hash.replace("#", ""); if (TABS.find((t) => t.id === id)) setTab(id); };
    h(); window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  useEffect(() => { if (typeof window !== "undefined") window.history.replaceState(null, "", `#${tab}`); }, [tab]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand" onClick={() => go("cover")} style={{ cursor: "pointer" }}>
            <div className="brand-mark">भ</div>
            <div className="brand-txt">Bharat Export Atlas<small>Supply × Demand × White-space</small></div>
          </div>
          <nav className="tabs">
            {TABS.map((t) => (
              <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => go(t.id)}>
                <span className="tab-i">{t.i}</span>{t.label}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {tab === "cover" && <Cover go={go} />}
      {tab === "mapping" && <Mapping />}
      {tab === "countries" && <Countries />}
      {tab === "niche" && <Niche go={go} />}
      {tab === "product" && <Product go={go} />}
      {tab === "plan" && <Plan go={go} />}
      {tab === "financial" && <Financial />}
      {tab === "gtm" && <GTMTab />}
      {tab === "phases" && <Phases />}

      <footer className="footer">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>Bharat Export Atlas · built on Business Standard BS1000 (FY25) + DGCI&amp;S / Dept. of Commerce trade data.</div>
          <div>Figures shown as ranges for feasibility screening. Not investment advice.</div>
        </div>
      </footer>
    </div>
  );
}
