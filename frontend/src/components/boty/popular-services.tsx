"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const services = [
  { name: "Haircut & Styling", price: "₹299", tag: "Popular" },
  { name: "Hair Coloring", price: "₹999", tag: "Popular" },
  { name: "Bridal Makeup", price: "₹4,999", tag: "Premium" },
  { name: "Facial Treatment", price: "₹499", tag: null },
  { name: "Keratin Treatment", price: "₹2,499", tag: null },
  { name: "Manicure & Pedicure", price: "₹399", tag: null },
]

export function PopularServices() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-12 sm:py-14 md:py-18 lg:py-24 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-8 sm:mb-12 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2 block">Services</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
              Popular services
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary boty-transition group"
          >
            All services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <Link
              key={service.name}
              href="/services"
              className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:bg-card hover:shadow-lg boty-transition active:scale-[0.98] hover:-translate-y-0.5 scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary boty-transition flex-shrink-0" />
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary boty-transition truncate">
                  {service.name}
                </h3>
                {service.tag && (
                  <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold flex-shrink-0">
                    {service.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span className="text-sm font-bold text-foreground">
                  {service.price}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 boty-transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
