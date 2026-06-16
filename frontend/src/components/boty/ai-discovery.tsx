"use client"

import { useState } from "react"
import { Sparkles, Send, MapPin, Star, ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

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
    reason: "Offers bridal trial packages from ₹2,500. 3 slots available on your date.",
  },
  {
    name: "The Bridal Room",
    area: "Khar West",
    rating: 4.8,
    match: 94,
    reason: "Free trial session included in bridal packages. Available Dec 14–16.",
  },
  {
    name: "Radiance Makeovers",
    area: "Bandra East",
    rating: 4.7,
    match: 89,
    reason: "Budget-friendly at ₹6,800 with trial. 2 km from preferred area.",
  },
]

export function AIDiscovery() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const { ref, isVisible } = useScrollReveal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsThinking(true)
    setShowResults(false)
    await new Promise((r) => setTimeout(r, 1800))
    setIsThinking(false)
    setShowResults(true)
  }

  return (
    <section className="py-20 bg-card/50" ref={ref}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            AI-Powered Search
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic mb-2">
            Tell us what you need
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Describe your requirements in plain language. We&apos;ll find the perfect match.
          </p>
        </div>

        {/* Input */}
        <div className={`scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-2`}>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 p-2 bg-background rounded-full border border-border/50 boty-shadow">
              <Sparkles className="w-4 h-4 text-primary ml-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Bridal makeup in Bandra, budget ₹8000..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 px-1"
              />
              <button
                type="submit"
                disabled={!query.trim() || isThinking}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 boty-transition disabled:opacity-40 flex-shrink-0"
                aria-label="Search"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
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
        </div>

        {/* Thinking */}
        {isThinking && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="text-xs text-muted-foreground ml-2">Finding matches...</span>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="mt-6 space-y-2">
            {mockResults.map((salon) => (
              <div
                key={salon.name}
                className="group flex items-center justify-between p-4 rounded-xl bg-background border border-border/30 hover:border-primary/20 hover:shadow-sm boty-transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary boty-transition">{salon.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/8 text-primary font-medium">{salon.match}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />{salon.area}
                    <Star className="w-3 h-3 fill-primary text-primary" />{salon.rating}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">{salon.reason}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 ml-3 group-hover:translate-x-0.5 boty-transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
