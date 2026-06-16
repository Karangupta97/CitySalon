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
    <section className="py-5 sm:py-6 md:py-8 bg-card/60 border-y border-border/20" ref={ref}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 sm:gap-3 justify-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-foreground leading-none">{item.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
