"use client";
import React, { useState, useEffect } from "react";
import Cover from "@/components/tabs/Cover";
import Mapping from "@/components/tabs/Mapping";
import Niche from "@/components/tabs/Niche";
import Product from "@/components/tabs/Product";
import Explore from "@/components/tabs/Explore";
import Plan from "@/components/tabs/Plan";
import Countries from "@/components/tabs/Countries";
import Financial from "@/components/tabs/Financial";
import GTMTab from "@/components/tabs/GTM";
import Phases from "@/components/tabs/Phases";
import FlowNav from "@/components/FlowNav";
import { FLOW } from "@/lib/flow";

export default function Home() {
  const [tab, setTab] = useState("cover");
  const go = (t: string) => { setTab(t); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const h = () => { const id = window.location.hash.replace("#", ""); if (FLOW.find((t) => t.id === id)) setTab(id); };
    h(); window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  useEffect(() => { if (typeof window !== "undefined") { try { window.history.replaceState(null, "", `#${tab}`); } catch { /* sandboxed iframe */ } } }, [tab]);

  const curIdx = FLOW.findIndex((t) => t.id === tab);
  const cur = FLOW[curIdx] || FLOW[0];

  return (
    <div className="app">
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand" onClick={() => go("cover")} style={{ cursor: "pointer" }}>
            <div className="brand-mark">भ</div>
            <div className="brand-txt">Bharat Export Atlas<small>Supply × Demand × White-space</small></div>
          </div>
          <nav className="tabs">
            {FLOW.map((t, i) => {
              const newAct = i > 0 && t.act !== FLOW[i - 1].act;
              return (
                <React.Fragment key={t.id}>
                  {newAct ? <span className="nav-sep" /> : null}
                  <div className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => go(t.id)}>
                    <span className="tab-i">{t.i}</span>{t.label}
                  </div>
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* persistent flow context strip */}
      <div className="flowstrip">
        <div className="wrap flowstrip-inner">
          <span className="act-tag">{cur.actN ? <span className="n">Act {cur.actN}</span> : null}{cur.act}</span>
          <div className="steps">
            {FLOW.map((t, i) => (
              <span key={t.id} className={`step-dot ${i === curIdx ? "cur" : i < curIdx ? "done" : ""}`} onClick={() => go(t.id)} title={t.label} />
            ))}
          </div>
          <span className="step-count">{String(curIdx).padStart(2, "0")} / {String(FLOW.length - 1).padStart(2, "0")}</span>
        </div>
      </div>

      {tab === "cover" && <Cover go={go} />}
      {tab === "mapping" && <Mapping />}
      {tab === "countries" && <Countries />}
      {tab === "niche" && <Niche go={go} />}
      {tab === "product" && <Product go={go} />}
      {tab === "explore" && <Explore go={go} />}
      {tab === "plan" && <Plan go={go} />}
      {tab === "financial" && <Financial />}
      {tab === "gtm" && <GTMTab />}
      {tab === "phases" && <Phases />}

      <FlowNav current={tab} go={go} />

      <footer className="footer">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>Bharat Export Atlas · built on Business Standard BS1000 (FY25) + DGCI&amp;S / Dept. of Commerce trade data.</div>
          <div>Figures shown as ranges for feasibility screening. Not investment advice.</div>
        </div>
      </footer>
    </div>
  );
}
