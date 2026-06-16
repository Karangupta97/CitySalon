"use client"

import { useState } from "react"
import { Sparkles, Send, X, MapPin, Star, ArrowRight } from "lucide-react"

const suggestions = [
  "Bridal makeup in Bandra, budget ₹8000",
  "Best keratin near Vashi under ₹3000",
  "Hair color + spa in Andheri this weekend",
]

const mockResults = [
  {
    name: "Glamour Studio",
    area: "Bandra West",
    rating: 4.9,
    match: 98,
    reason: "Offers bridal trial packages from ₹2,500. 3 slots available.",
  },
  {
    name: "The Bridal Room",
    area: "Khar West",
    rating: 4.8,
    match: 94,
    reason: "Free trial session included. Available Dec 14–16.",
  },
  {
    name: "Radiance Makeovers",
    area: "Bandra East",
    rating: 4.7,
    match: 89,
    reason: "Budget-friendly at ₹6,800 with trial included.",
  },
]

export function AISearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsThinking(true)
    setShowResults(false)
    await new Promise((r) => setTimeout(r, 1800))
    setIsThinking(false)
    setShowResults(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery("")
    setShowResults(false)
    setIsThinking(false)
  }

  return (
    <>
      {/* Floating AI button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center boty-shadow hover:scale-105 active:scale-95 boty-transition group"
        aria-label="AI-Powered Search"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 boty-transition" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm boty-transition"
          onClick={handleClose}
        />
      )}

      {/* Panel — full-width bottom sheet on mobile, centered modal on desktop */}
      <div
        className={`fixed z-[70] inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-[calc(100%-2rem)] sm:rounded-2xl rounded-t-2xl bg-background border border-border/50 boty-shadow overflow-hidden boty-transition ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full sm:translate-y-[calc(-50%+20px)] opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Search</p>
              <p className="text-[11px] text-muted-foreground">Describe what you need</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 70px)' }}>
          {/* Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-full border border-border/30">
              <Sparkles className="w-4 h-4 text-primary/60 ml-2 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Bridal makeup in Bandra..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 px-1 min-w-0"
                autoFocus={isOpen}
              />
              <button
                type="submit"
                disabled={!query.trim() || isThinking}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 boty-transition disabled:opacity-40 flex-shrink-0"
                aria-label="Search"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Suggestions */}
          {!showResults && !isThinking && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQuery(s); setShowResults(false) }}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 boty-transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Thinking */}
          {isThinking && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="text-xs text-muted-foreground ml-2">Finding matches...</span>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="mt-4 space-y-2">
              {mockResults.map((salon) => (
                <div
                  key={salon.name}
                  className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-border/30 hover:border-primary/20 hover:bg-muted/20 boty-transition cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{salon.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/8 text-primary font-medium flex-shrink-0">{salon.match}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />{salon.area}
                      <Star className="w-3 h-3 fill-primary text-primary flex-shrink-0" />{salon.rating}
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-1">{salon.reason}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 ml-3 boty-transition" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
