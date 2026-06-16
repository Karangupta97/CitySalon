"use client"

import { CheckCircle2, Star, Users, ShieldCheck } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const items = [
  { icon: CheckCircle2, label: "Verified Salons", value: "500+" },
  { icon: Star, label: "Avg. Rating", value: "4.8★" },
  { icon: Users, label: "Happy Customers", value: "12K+" },
  { icon: ShieldCheck, label: "No Hidden Charges", value: "100%" },
]

export function TrustBar() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-4 sm:py-6 bg-card/50 border-y border-border/30" ref={ref}>
      <div className={`max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 sm:gap-3 justify-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-none">{item.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
