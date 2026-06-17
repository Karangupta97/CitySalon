"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { BotMessageSquare, ArrowUp, Sparkles } from "lucide-react";
import DOMPurify from "dompurify";
import { useAdvisor } from "./advisor-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const SUGGESTED_PROMPTS = [
  "My hair is damaged from bleaching, what treatment first?",
  "Best facial for oily skin?",
  "How to prep skin for bridal makeup?",
  "What's the difference between Olaplex and keratin?",
  "How often should I get a haircut?",
  "Is waxing or threading better for face?",
];

const INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /system\s+prompt/i,
  /\[INST\]/i,
  /forget\s+everything/i,
];

export function AdvisorChat() {
  const {
    chatMessages,
    addChatMessage,
    isLoading,
    setIsLoading,
    setMode,
    setDiscoveryQuery,
  } = useAdvisor();

  const [input, setInput] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestTimesRef = useRef<number[]>([]);
  const lastSendRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isLoading]);

  useEffect(() => {
    if (rateLimitCountdown <= 0) { setRateLimited(false); return; }
    const timer = setTimeout(() => setRateLimitCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [rateLimitCountdown]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 80) + "px";
    }
  }, [input]);

  const sanitizeResponse = (text: string): string => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const validateInput = (text: string): { valid: boolean; reason?: string } => {
    const trimmed = text.trim();
    if (trimmed.length < 3) return { valid: false, reason: "Message too short" };
    if (trimmed.length > 500) return { valid: false, reason: "Message too long" };
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

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText || input).trim();
      if (!text || isLoading || rateLimited) return;

      const now = Date.now();
      if (now - lastSendRef.current < 800) return;
      lastSendRef.current = now;

      const validation = validateInput(text);
      if (!validation.valid) { setToast(validation.reason || "Invalid input"); return; }
      if (checkClientRateLimit()) { setToast("Slow down — you're sending messages too quickly."); return; }

      requestTimesRef.current.push(now);
      setInput("");
      setIsLoading(true);

      addChatMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      });

      try {
        const historyForApi = chatMessages.slice(-6).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          content: m.content,
        }));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`${API_URL}/advisor`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Request-ID": crypto.randomUUID() },
          body: JSON.stringify({ message: text, history: historyForApi }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429) {
          setRateLimited(true);
          setRateLimitCountdown(30);
          setToast("Too many requests. Please wait a moment.");
          setIsLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        addChatMessage({
          id: crypto.randomUUID(),
          role: "ai",
          content: sanitizeResponse(data.reply || ""),
          timestamp: new Date(),
        });
      } catch {
        addChatMessage({
          id: crypto.randomUUID(),
          role: "ai",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
          isError: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, rateLimited, chatMessages, addChatMessage, setIsLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const charCount = input.trim().length;
  const canSend = charCount >= 3 && !isLoading && !rateLimited;

  return (
    <div className="flex flex-col h-full">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
          style={{ background: "#1A1A1A", color: "#FFFFFF", borderRadius: "10px", padding: "10px 18px", fontFamily: "Inter, sans-serif", fontSize: "12px" }}
        >
          {toast}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        aria-busy={isLoading}
      >
        <div className="max-w-[680px] mx-auto py-4">
          {chatMessages.length === 0 && !isLoading ? (
            <EmptyState onSuggestionClick={(p) => { setInput(p); sendMessage(p); }} />
          ) : (
            <>
              {chatMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onFindSalons={(query) => { setDiscoveryQuery(query); setMode("discover"); }}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 px-4 sm:px-6 pb-3 pt-2" style={{ borderTop: "0.5px solid rgba(0,0,0,0.05)" }}>
        <div className="max-w-[680px] mx-auto">
          <div
            className="flex items-end gap-2"
            style={{
              background: "#FFFFFF",
              border: "0.5px solid rgba(0,0,0,0.1)",
              borderRadius: "14px",
              padding: "8px 10px 8px 14px",
            }}
          >
            <textarea
              ref={textareaRef}
              value={rateLimited ? `Try again in ${rateLimitCountdown}s...` : input}
              onChange={(e) => !rateLimited && setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={rateLimited}
              placeholder="Ask about any beauty treatment..."
              aria-label="Ask your beauty question"
              rows={1}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: rateLimited ? "#9E958A" : "#1A1A1A",
                border: "none",
                outline: "none",
                background: "transparent",
                resize: "none",
                flex: 1,
                lineHeight: 1.5,
                maxHeight: "80px",
              }}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              {charCount > 400 && (
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: charCount > 480 ? "#D94F4F" : "#9E958A" }}>
                  {charCount}/500
                </span>
              )}
              <button
                onClick={() => sendMessage()}
                disabled={!canSend}
                aria-label="Send message"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: canSend ? "#3D4A35" : "#EDE8E0",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canSend ? "pointer" : "not-allowed",
                  transition: "background 150ms ease",
                }}
              >
                <ArrowUp size={15} color={canSend ? "#FFFFFF" : "#9E958A"} />
              </button>
            </div>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9E958A", textAlign: "center", marginTop: "5px" }}>
            AI advice is for guidance only. Always consult a professional for skin/hair concerns.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] px-4">
      <div
        className="mb-4 flex items-center justify-center"
        style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(61,74,53,0.08)" }}
      >
        <Sparkles size={22} color="#3D4A35" />
      </div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "22px",
          color: "#1A1A1A",
          textAlign: "center",
          marginBottom: "4px",
        }}
      >
        Ask me anything about beauty
      </h2>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9E958A", textAlign: "center", marginBottom: "24px", maxWidth: "320px" }}>
        Hair treatments, skincare, bridal prep, grooming — I know it all.
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSuggestionClick(prompt)}
            className="text-left"
            style={{
              background: "#FFFFFF",
              border: "0.5px solid rgba(0,0,0,0.08)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              color: "#6B6459",
              cursor: "pointer",
              lineHeight: 1.4,
              transition: "border-color 150ms ease, background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3D4A35"; e.currentTarget.style.background = "#FAFAF7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.background = "#FFFFFF"; }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onFindSalons,
}: {
  message: { id: string; role: "user" | "ai"; content: string; timestamp: Date; isError?: boolean };
  onFindSalons: (query: string) => void;
}) {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const mentionsTreatments = !isUser && !message.isError && /treatment|facial|keratin|olaplex|spa|salon|service/i.test(message.content);

  return (
    <div role="article" className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="flex-shrink-0 mr-2 mt-1"
          style={{ width: "26px", height: "26px", borderRadius: "8px", background: "#3D4A35", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <BotMessageSquare size={13} color="#FFFFFF" />
        </div>
      )}
      <div style={{ maxWidth: isUser ? "72%" : "78%" }}>
        <div
          style={{
            background: isUser ? "#3D4A35" : "#FFFFFF",
            color: isUser ? "#FFFFFF" : "#1A1A1A",
            borderRadius: isUser ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
            padding: "10px 14px",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            lineHeight: 1.6,
            border: isUser ? "none" : message.isError ? "0.5px solid rgba(217,79,79,0.3)" : "0.5px solid rgba(0,0,0,0.07)",
          }}
        >
          {message.content}
          {mentionsTreatments && (
            <button
              onClick={() => onFindSalons(message.content)}
              style={{ display: "block", marginTop: "6px", fontFamily: "Inter, sans-serif", fontSize: "11px", color: isUser ? "rgba(255,255,255,0.8)" : "#3D4A35", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Find salons offering this →
            </button>
          )}
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#9E958A", marginTop: "2px", textAlign: isUser ? "right" : "left" }}>
          {time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div
        className="flex-shrink-0 mr-2 mt-1"
        style={{ width: "26px", height: "26px", borderRadius: "8px", background: "#3D4A35", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <BotMessageSquare size={13} color="#FFFFFF" />
      </div>
      <div
        className="flex items-center gap-[5px]"
        style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: "14px 14px 14px 3px", padding: "10px 14px" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "5px", height: "5px", borderRadius: "50%", background: "#9E958A", display: "inline-block",
              animation: "typingPulse 1s ease-in-out infinite", animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
