"use client"

import { Search, CalendarCheck, Sparkles } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse top-rated salons near you. Filter by service, price, ratings, and availability.",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description: "Pick your preferred time slot and book instantly. No calls, no waiting.",
    gradient: "from-accent/15 to-accent/5",
  },
  {
    icon: Sparkles,
    title: "Enjoy",
    description: "Show up, relax, and enjoy premium beauty services. Leave a review to help others.",
    gradient: "from-secondary/40 to-secondary/20",
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={ref}>
        <div className={`text-center mb-16 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            Simple & easy
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`group text-center p-8 rounded-3xl bg-card boty-shadow hover:shadow-lg hover:-translate-y-2 boty-transition hover-glow scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="relative mb-6 inline-block">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 boty-transition`}>
                  <step.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                {/* Step number */}
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold boty-shadow">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-primary boty-transition">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connector line (desktop only) */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-border" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-24 h-px bg-border" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-24 h-px bg-border" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>
      </div>
    </section>
  )
}
