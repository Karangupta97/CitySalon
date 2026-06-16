"use client"

import { Scissors, Sparkles, Flower2, Droplets, Heart, Palette } from "lucide-react"
import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const categories = [
  { name: "Hair", icon: Scissors, href: "/salons?cat=hair" },
  { name: "Spa", icon: Sparkles, href: "/salons?cat=spa" },
  { name: "Nails", icon: Flower2, href: "/salons?cat=nails" },
  { name: "Skin", icon: Droplets, href: "/salons?cat=skin" },
  { name: "Makeup", icon: Palette, href: "/salons?cat=makeup" },
  { name: "Bridal", icon: Heart, href: "/salons?cat=bridal" },
]

export function CategorySection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-12 sm:py-14 md:py-18 lg:py-24 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-8 sm:mb-12 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2 block">Explore</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
              Browse by category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group flex flex-col items-center gap-3 sm:gap-4 py-5 sm:py-7 px-3 sm:px-4 rounded-2xl sm:rounded-3xl bg-card/60 border border-border/30 hover:border-primary/40 hover:bg-primary/5 boty-transition active:scale-95 hover:-translate-y-1 hover:shadow-md scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                <cat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70 group-hover:text-primary boty-transition" strokeWidth={1.5} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground/80 group-hover:text-foreground boty-transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
