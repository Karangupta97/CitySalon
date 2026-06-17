"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type AdvisorMode = "advisor" | "discover";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface DiscoveryIntent {
  service: string;
  area: string;
  budget: number | null;
  date: string | null;
  requirements: string[];
  confidence: number;
  searchSummary: string;
}

export interface SalonResult {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  distanceKm: number;
  matchScore: number;
  matchReasons: string[];
  unmatchedReasons: string[];
  relevantServices: { name: string; price: number }[];
  availableSlots: string[];
}

interface AdvisorContextType {
  mode: AdvisorMode;
  setMode: (mode: AdvisorMode) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  discoveryQuery: string;
  setDiscoveryQuery: (q: string) => void;
  discoveryResults: SalonResult[];
  setDiscoveryResults: (results: SalonResult[]) => void;
  extractedIntent: DiscoveryIntent | null;
  setExtractedIntent: (intent: DiscoveryIntent | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const AdvisorContext = createContext<AdvisorContextType | null>(null);

export function AdvisorProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AdvisorMode>("advisor");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [discoveryResults, setDiscoveryResults] = useState<SalonResult[]>([]);
  const [extractedIntent, setExtractedIntent] = useState<DiscoveryIntent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMode = useCallback((newMode: AdvisorMode) => {
    setModeState(newMode);
    setError(null);
    setIsLoading(false);
    // Reset state per mode switch is handled in the component with confirmation
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev.slice(-19), msg]); // Keep last 20 messages (10 pairs)
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  return (
    <AdvisorContext.Provider
      value={{
        mode,
        setMode,
        chatMessages,
        addChatMessage,
        clearChat,
        discoveryQuery,
        setDiscoveryQuery,
        discoveryResults,
        setDiscoveryResults,
        extractedIntent,
        setExtractedIntent,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AdvisorContext.Provider>
  );
}

export function useAdvisor() {
  const ctx = useContext(AdvisorContext);
  if (!ctx) throw new Error("useAdvisor must be used within AdvisorProvider");
  return ctx;
}
