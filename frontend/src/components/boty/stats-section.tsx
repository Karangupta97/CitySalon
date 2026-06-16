"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { AnimatedCounter } from "./animated-counter"

const stats = [
  { value: 500, suffix: "+", label: "Verified Salons" },
  { value: 12000, suffix: "+", label: "Happy Customers" },
  { value: 50000, suffix: "+", label: "Bookings Completed" },
  { value: 4.8, suffix: "★", label: "Average Rating" },
]

export function StatsSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-16 bg-background border-y border-border/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-1">
                {stat.value >= 100 ? (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                ) : (
                  <AnimatedCounter target={stat.value * 10} suffix={stat.suffix} duration={2500} />
                )}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
