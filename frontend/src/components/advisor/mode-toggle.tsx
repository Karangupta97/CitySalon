"use client";

import React, { useState } from "react";
import { useAdvisor, AdvisorMode } from "./advisor-context";

export function ModeToggle() {
  const { mode, setMode, chatMessages, clearChat, setDiscoveryResults, setExtractedIntent, setDiscoveryQuery } = useAdvisor();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<AdvisorMode | null>(null);

  function handleModeSwitch(newMode: AdvisorMode) {
    if (newMode === mode) return;
    if (mode === "advisor" && chatMessages.length > 6) {
      setPendingMode(newMode);
      setShowConfirm(true);
      return;
    }
    doSwitch(newMode);
  }

  function doSwitch(newMode: AdvisorMode) {
    clearChat();
    setDiscoveryResults([]);
    setExtractedIntent(null);
    setDiscoveryQuery("");
    setMode(newMode);
    setShowConfirm(false);
    setPendingMode(null);
  }

  return (
    <>
      <div
        className="inline-flex items-center"
        role="tablist"
        style={{
          background: "#FFFFFF",
          border: "0.5px solid rgba(0,0,0,0.08)",
          borderRadius: "24px",
          padding: "3px",
        }}
      >
        <button
          role="tab"
          aria-selected={mode === "advisor"}
          onClick={() => handleModeSwitch("advisor")}
          style={{
            background: mode === "advisor" ? "#1A1A1A" : "transparent",
            color: mode === "advisor" ? "#FFFFFF" : "#6B6459",
            borderRadius: "20px",
            padding: "6px 16px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: mode === "advisor" ? 500 : 400,
            border: "none",
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          Beauty Advisor
        </button>
        <button
          role="tab"
          aria-selected={mode === "discover"}
          onClick={() => handleModeSwitch("discover")}
          style={{
            background: mode === "discover" ? "#1A1A1A" : "transparent",
            color: mode === "discover" ? "#FFFFFF" : "#6B6459",
            borderRadius: "20px",
            padding: "6px 16px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: mode === "discover" ? 500 : 400,
            border: "none",
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          Find My Salon
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            className="mx-4 p-5 max-w-xs w-full"
            style={{ background: "#FFFFFF", borderRadius: "14px" }}
          >
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A", marginBottom: "14px" }}>
              Switch mode? Your conversation will be cleared.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6B6459", padding: "6px 14px", border: "none", background: "transparent", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => pendingMode && doSwitch(pendingMode)}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#FFFFFF", background: "#1A1A1A", padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
