"use client";
import React from "react";
import { FLOW } from "@/lib/flow";

export default function FlowNav({ current, go }: { current: string; go: (t: string) => void }) {
  const idx = FLOW.findIndex((f) => f.id === current);
  if (idx < 0) return null;
  const prev = idx > 0 ? FLOW[idx - 1] : null;
  const next = idx < FLOW.length - 1 ? FLOW[idx + 1] : null;
  return (
    <div className="flownav">
      <div className="flownav-inner">
        {prev ? (
          <button className="flownav-btn" onClick={() => go(prev.id)}>
            <span className="fn-arrow">←</span>
            <span style={{ minWidth: 0 }}>
              <span className="fn-dir">Back</span>
              <span className="fn-title" style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prev.label}</span>
            </span>
          </button>
        ) : <div style={{ flex: 1 }} />}
        {next ? (
          <button className="flownav-btn next" onClick={() => go(next.id)}>
            <span style={{ minWidth: 0 }}>
              <span className="fn-dir">Next · {next.actShort}</span>
              <span className="fn-title" style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next.label}</span>
            </span>
            <span className="fn-arrow">→</span>
          </button>
        ) : (
          <button className="flownav-btn next" onClick={() => go("cover")}>
            <span><span className="fn-dir">Full circle</span><span className="fn-title" style={{ display: "block" }}>Back to the cover</span></span>
            <span className="fn-arrow">↺</span>
          </button>
        )}
      </div>
    </div>
  );
}
