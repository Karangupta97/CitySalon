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
    <section className="py-12 sm:py-16 lg:py-20 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
            What our users say
          </h2>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              className={`flex-shrink-0 w-[280px] sm:w-[300px] md:w-auto snap-start group p-5 sm:p-6 rounded-2xl border border-border/30 hover:border-primary/20 hover:shadow-md boty-transition hover:-translate-y-1 scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4 sm:mb-5 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/30">
                <span className="text-sm font-medium text-foreground">{review.name}</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">{review.salon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
