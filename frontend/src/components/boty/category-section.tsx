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
    <section className="py-20 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-10 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground italic">
            Browse by category
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/3 boty-transition hover:-translate-y-1 scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/8 boty-transition">
                <cat.icon className="w-5 h-5 text-foreground/60 group-hover:text-primary boty-transition" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground boty-transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
