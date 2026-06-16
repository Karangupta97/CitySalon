"use client"

import { Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const reviews = [
  {
    name: "Priya S.",
    text: "Found my perfect stylist. The booking was seamless and the salon was exactly as described.",
    rating: 5,
    salon: "Akreations, Bandra",
  },
  {
    name: "Ananya R.",
    text: "I love how easy it is to compare prices and read real reviews. No more guessing about quality.",
    rating: 5,
    salon: "Hair Masters, Andheri",
  },
  {
    name: "Meera P.",
    text: "Booked bridal makeup stress-free. The artist was incredible and everything was transparent.",
    rating: 5,
    salon: "The Bridal Room, Khar",
  },
]

export function Testimonials() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-12 sm:py-14 md:py-18 lg:py-24 bg-card/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className={`text-center mb-10 sm:mb-14 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2 block">Testimonials</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
            What our users say
          </h2>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              className={`flex-shrink-0 w-[300px] sm:w-[320px] md:w-auto snap-start group p-6 sm:p-7 rounded-2xl bg-background border border-border/20 hover:border-primary/20 hover:shadow-lg boty-transition hover:-translate-y-1 scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-5 sm:mb-6">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{review.name[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{review.name}</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">{review.salon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
