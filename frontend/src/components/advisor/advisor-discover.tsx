"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Scissors, MapPin, IndianRupee, Calendar, Sparkles, AlertCircle,
  Loader2, Star, CheckCircle, X, Frown, Search,
} from "lucide-react";
import { useAdvisor, DiscoveryIntent, SalonResult } from "./advisor-context";
import { salons } from "@/data/salons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const EXAMPLE_QUERIES = [
  "Bridal in Bandra under \u20B98000 this Saturday",
  "Keratin treatment in Andheri under \u20B94000",
  "Men's haircut in Juhu tomorrow",
  "Oily skin facial in Worli under \u20B91000",
];

const INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /system\s+prompt/i,
  /\[INST\]/i,
  /forget\s+everything/i,
];

type SortOption = "match" | "rating" | "price";

export function AdvisorDiscover() {
  const {
    discoveryQuery, setDiscoveryQuery,
    discoveryResults, setDiscoveryResults,
    extractedIntent, setExtractedIntent,
    isLoading, setIsLoading,
  } = useAdvisor();

  const [toast, setToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestTimesRef = useRef<number[]>([]);

  const validateInput = (text: string): { valid: boolean; reason?: string } => {
    const trimmed = text.trim();
    if (trimmed.length < 3) return { valid: false, reason: "Please describe what you need" };
    if (trimmed.length > 500) return { valid: false, reason: "Query too long" };
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) return { valid: false, reason: "Please ask a beauty-related question." };
    }
    return { valid: true };
  };

  const checkClientRateLimit = (): boolean => {
    const now = Date.now();
    const recent = requestTimesRef.current.filter((t) => now - t < 60000);
    requestTimesRef.current = recent;
    return recent.length >= 5;
  };

  const matchSalons = useCallback((intent: DiscoveryIntent): SalonResult[] => {
    const results: SalonResult[] = [];
    for (const salon of salons) {
      let score = 0;
      const matchReasons: string[] = [];
      const unmatchedReasons: string[] = [];

      const areaLower = intent.area.toLowerCase();
      const salonArea = salon.area.toLowerCase();
      if (salonArea.includes(areaLower) || areaLower.includes(salonArea.split(" ")[0])) {
        score += areaLower === salonArea ? 2 : 1;
        matchReasons.push(`Located in ${salon.area}`);
      }

      const serviceLower = intent.service.toLowerCase();
      const matchedServices = salon.services.filter(
        (s) => s.name.toLowerCase().includes(serviceLower) || s.category.toLowerCase().includes(serviceLower) || serviceLower.includes(s.category.toLowerCase())
      );
      if (matchedServices.length > 0) { score += 2; matchReasons.push(`Offers ${matchedServices[0].name}`); }

      if (intent.budget !== null) {
        const cheapestMatch = matchedServices.length > 0 ? Math.min(...matchedServices.map((s) => s.price)) : salon.startingPrice;
        if (cheapestMatch <= intent.budget) { score += 2; matchReasons.push("Within budget"); }
        else { unmatchedReasons.push("Slightly over budget"); }
      }

      if (intent.date) {
        const hasDate = Object.keys(salon.availableSlots).some((d) => d.includes(intent.date!) || intent.date!.includes(d));
        if (hasDate) { score += 3; matchReasons.push("Available on requested date"); }
      }

      if (salon.rating > 4.7) score += 3;
      if (salon.specialties.some((s) => serviceLower.includes(s) || s.includes(serviceLower))) { score += 2; matchReasons.push("Specialist in this service"); }

      if (score > 0) {
        const relevantServices = matchedServices.length > 0
          ? matchedServices.slice(0, 3).map((s) => ({ name: s.name, price: s.price }))
          : salon.services.slice(0, 2).map((s) => ({ name: s.name, price: s.price }));

        let slots: string[] = [];
        if (intent.date) {
          const dateKey = Object.keys(salon.availableSlots).find((d) => d.includes(intent.date!) || intent.date!.includes(d));
          if (dateKey) slots = salon.availableSlots[dateKey].slice(0, 3);
        }
        if (slots.length === 0) {
          const firstDate = Object.keys(salon.availableSlots)[0];
          if (firstDate) slots = salon.availableSlots[firstDate].slice(0, 3);
        }

        results.push({
          id: salon.id, name: salon.name, area: salon.area, rating: salon.rating,
          reviewCount: salon.reviewCount,
          startingPrice: matchedServices.length > 0 ? Math.min(...matchedServices.map((s) => s.price)) : salon.startingPrice,
          distanceKm: salon.distanceKm, matchScore: score, matchReasons, unmatchedReasons,
          relevantServices, availableSlots: slots,
        });
      }
    }
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, []);

  const handleDiscover = async () => {
    const validation = validateInput(discoveryQuery);
    if (!validation.valid) { setToast(validation.reason || "Invalid input"); setTimeout(() => setToast(null), 4000); return; }
    if (checkClientRateLimit()) { setToast("Slow down — you're sending messages too quickly."); setTimeout(() => setToast(null), 4000); return; }

    requestTimesRef.current.push(Date.now());
    setIsLoading(true);
    setExtractedIntent(null);
    setDiscoveryResults([]);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${API_URL}/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Request-ID": crypto.randomUUID() },
        body: JSON.stringify({ query: discoveryQuery.trim() }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) { setToast("Too many requests. Please wait a moment."); setTimeout(() => setToast(null), 4000); setIsLoading(false); return; }
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      if (data.error) { setExtractedIntent({ service: "", area: "", budget: null, date: null, requirements: [], confidence: 0, searchSummary: "" }); setDiscoveryResults([]); setIsLoading(false); return; }

      const intent: DiscoveryIntent = data.intent;
      setExtractedIntent(intent);
      setDiscoveryResults(matchSalons(intent));
    } catch {
      setToast("Something went wrong. Please try again.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedResults = [...discoveryResults].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.startingPrice - b.startingPrice;
    return b.matchScore - a.matchScore;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50" style={{ background: "#1A1A1A", color: "#FFFFFF", borderRadius: "10px", padding: "10px 18px", fontFamily: "Inter, sans-serif", fontSize: "12px" }}>
          {toast}
        </div>
      )}

      <div className="max-w-[740px] mx-auto w-full px-4 sm:px-6 py-5">
        {/* Search Section */}
        <div className="mb-5">
          <div style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "14px", padding: "14px 16px" }}>
            <textarea
              ref={textareaRef}
              value={discoveryQuery}
              onChange={(e) => setDiscoveryQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDiscover(); } }}
              placeholder="Describe what you need... e.g. Bridal makeup in Bandra under ₹8000 this Saturday"
              style={{ width: "100%", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A", minHeight: "60px", resize: "none", outline: "none", border: "none", background: "transparent" }}
            />
            <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "0.5px solid rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9E958A" }}>
                Area + budget + date + service = best results
              </p>
              <button
                onClick={handleDiscover}
                disabled={!discoveryQuery.trim() || isLoading}
                style={{
                  background: !discoveryQuery.trim() || isLoading ? "#D4CFC7" : "#3D4A35",
                  color: "#FFFFFF", borderRadius: "10px", padding: "8px 18px",
                  fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500,
                  border: "none", cursor: !discoveryQuery.trim() || isLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "6px", transition: "all 150ms ease",
                }}
              >
                {isLoading ? <><Loader2 size={14} className="animate-spin" /> Finding...</> : <><Search size={13} /> Discover</>}
              </button>
            </div>
          </div>

          {/* Example Pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setDiscoveryQuery(q)}
                style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "6px 12px", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6B6459", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "border-color 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3D4A35")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Intent Display */}
        {extractedIntent && <IntentDisplay intent={extractedIntent} onEdit={() => textareaRef.current?.focus()} />}

        {/* Results */}
        {extractedIntent && discoveryResults.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-baseline gap-2">
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", fontSize: "24px", color: "#1A1A1A" }}>
                  Top matches
                </h2>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9E958A" }}>
                  ({sortedResults.length} found)
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(["match", "rating", "price"] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    style={{
                      background: sortBy === option ? "#1A1A1A" : "transparent",
                      color: sortBy === option ? "#FFFFFF" : "#9E958A",
                      borderRadius: "8px", padding: "4px 10px",
                      fontFamily: "Inter, sans-serif", fontSize: "10px",
                      border: sortBy === option ? "none" : "0.5px solid rgba(0,0,0,0.08)",
                      cursor: "pointer", transition: "all 150ms ease",
                    }}
                  >
                    {option === "match" ? "Best match" : option === "rating" ? "Top rated" : "Lowest price"}
                  </button>
                ))}
              </div>
            </div>
            {sortedResults.map((salon, idx) => (
              <SalonCard key={salon.id} salon={salon} rank={idx + 1} />
            ))}
          </div>
        )}

        {/* No Results */}
        {extractedIntent && discoveryResults.length === 0 && !isLoading && <NoResultsState />}
      </div>
    </div>
  );
}

function IntentDisplay({ intent, onEdit }: { intent: DiscoveryIntent; onEdit: () => void }) {
  return (
    <div className="mb-5" style={{ background: "#EDE8E0", borderRadius: "12px", padding: "14px 16px" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "#9E958A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
        UNDERSTOOD
      </p>
      <div className="flex flex-wrap gap-2">
        {intent.service && <IntentTag icon={<Scissors size={12} color="#3D4A35" />} label="Service" value={intent.service} />}
        {intent.area && <IntentTag icon={<MapPin size={12} color="#3D4A35" />} label="Area" value={intent.area} />}
        {intent.budget !== null && <IntentTag icon={<IndianRupee size={12} color="#3D4A35" />} label="Budget" value={`under \u20B9${intent.budget.toLocaleString("en-IN")}`} />}
        {intent.date && <IntentTag icon={<Calendar size={12} color="#3D4A35" />} label="Date" value={intent.date} />}
        {intent.requirements.map((req, i) => <IntentTag key={i} icon={<Sparkles size={12} color="#3D4A35" />} label="Special" value={req} />)}
      </div>
      {intent.confidence < 0.6 && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle size={12} color="#C4996A" />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6B6459" }}>Results may be broad. Try adding area and budget.</p>
        </div>
      )}
      <button onClick={onEdit} style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#3D4A35", background: "none", border: "none", cursor: "pointer", marginTop: "8px", padding: 0 }}>
        Edit query
      </button>
    </div>
  );
}

function IntentTag({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1" style={{ background: "#FFFFFF", borderRadius: "8px", padding: "4px 10px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
      {icon}
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9E958A" }}>{label}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, color: "#1A1A1A" }}>{value}</span>
    </div>
  );
}

function SalonCard({ salon, rank }: { salon: SalonResult; rank: number }) {
  return (
    <div className="mb-3 overflow-hidden" style={{ background: "#FFFFFF", borderRadius: "14px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
      {/* Rank */}
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: "#3D4A35" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "#FFFFFF" }}>#{rank} Best Match</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>
          {salon.matchReasons.slice(0, 2).join(" · ")}
        </span>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "19px", color: "#1A1A1A", marginBottom: "3px" }}>
            {salon.name}
          </h3>
          <div className="flex items-center flex-wrap gap-1 mb-2" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9E958A" }}>
            <Star size={11} color="#C4996A" fill="#C4996A" />
            <span>{salon.rating} ({salon.reviewCount})</span>
            <span>&middot;</span>
            <MapPin size={10} />
            <span>{salon.area}</span>
            <span>&middot;</span>
            <span>{salon.distanceKm} km</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {salon.matchReasons.map((r, i) => (
              <span key={i} className="flex items-center gap-1" style={{ background: "#F5F0EA", borderRadius: "6px", padding: "3px 8px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#6B6459" }}>
                <CheckCircle size={10} color="#3D7A35" />{r}
              </span>
            ))}
            {salon.unmatchedReasons.map((r, i) => (
              <span key={`u-${i}`} className="flex items-center gap-1" style={{ background: "#F5F0EA", borderRadius: "6px", padding: "3px 8px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#D94F4F" }}>
                <X size={10} color="#D94F4F" />{r}
              </span>
            ))}
          </div>
          {salon.relevantServices.map((svc, i) => (
            <div key={i} className="flex justify-between py-1" style={{ borderBottom: i < salon.relevantServices.length - 1 ? "0.5px solid rgba(0,0,0,0.04)" : "none" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#1A1A1A" }}>{svc.name}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "13px", color: "#1A1A1A" }}>\u20B9{svc.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
        <div className="sm:min-w-[150px] flex flex-col items-stretch gap-2">
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "22px", color: "#1A1A1A" }}>from \u20B9{salon.startingPrice.toLocaleString("en-IN")}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9E958A" }}>for this service</p>
          </div>
          <a href={`/salon/${salon.id}`} style={{ display: "block", background: "#3D4A35", color: "#FFFFFF", borderRadius: "10px", padding: "10px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
            Book salon →
          </a>
          <a href={`/salon/${salon.id}`} style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#3D4A35", textDecoration: "none" }}>
            View profile
          </a>
          {salon.availableSlots.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {salon.availableSlots.map((slot, i) => (
                <span key={i} style={{ border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "6px", padding: "3px 8px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#1A1A1A" }}>
                  {slot}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="text-center py-10">
      <Frown size={36} color="#9E958A" className="mx-auto mb-3" />
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", fontSize: "20px", color: "#1A1A1A", marginBottom: "6px" }}>
        Couldn't find an exact match
      </h3>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9E958A", marginBottom: "16px" }}>
        Try being more specific about your area or service.
      </p>
      <button style={{ background: "transparent", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "8px 20px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#3D4A35", cursor: "pointer" }}>
        Try a broader search
      </button>
    </div>
  );
}
