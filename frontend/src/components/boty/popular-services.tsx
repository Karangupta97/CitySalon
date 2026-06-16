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
    <section className="py-12 sm:py-16 lg:py-20 bg-card/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-6 sm:mb-10 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
            Popular services
          </h2>
          <Link
            href="/services"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground boty-transition group"
          >
            All services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {services.map((service, index) => (
            <Link
              key={service.name}
              href="/services"
              className={`group flex items-center justify-between p-4 sm:p-5 rounded-xl bg-background border border-border/30 hover:border-primary/20 hover:shadow-md boty-transition active:scale-[0.98] hover:-translate-y-0.5 scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary boty-transition truncate">
                  {service.name}
                </h3>
                {service.tag && (
                  <span className="hidden xs:inline text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium flex-shrink-0">
                    {service.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                <span className="text-sm font-semibold text-foreground">
                  {service.price}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 boty-transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
