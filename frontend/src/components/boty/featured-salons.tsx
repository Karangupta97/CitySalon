"use client"

import { Star, MapPin, ArrowRight, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const salons = [
  {
    id: "akshita-shoanak",
    name: "Akshita Shoanak Studio Salon",
    image: "/images/hero-model.jpg",
    rating: 4.9,
    reviews: 856,
    location: "Ulwe, Navi Mumbai",
    services: ["Hair", "Skin", "Makeup"],
    badge: "Featured",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    id: 1,
    name: "Akreations",
    image: "/images/hero-model.jpg",
    rating: 4.8,
    reviews: 1200,
    location: "Bandra West",
    services: ["Hair", "Skin", "Makeup"],
    badge: "Top Rated",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    id: 2,
    name: "Hair Masters",
    image: "/images/bento-skin-model.jpg",
    rating: 4.7,
    reviews: 980,
    location: "Andheri West",
    services: ["Hair", "Color", "Treatments"],
    badge: "Popular",
    badgeColor: "bg-foreground text-background",
  },
  {
    id: 3,
    name: "The Salon Co.",
    image: "/images/skincare-ritual.jpg",
    rating: 4.6,
    reviews: 756,
    location: "Lower Parel",
    services: ["Hair", "Skin", "Nails"],
    badge: "Trending",
    badgeColor: "bg-accent text-accent-foreground",
  },
  {
    id: 4,
    name: "Dessange Paris",
    image: "/images/natural-leaf.jpg",
    rating: 4.7,
    reviews: 542,
    location: "Juhu",
    services: ["Hair", "Color", "Spa"],
    badge: "New",
    badgeColor: "bg-destructive/90 text-destructive-foreground",
  },
  {
    id: 5,
    name: "Enrich Salon",
    image: "/images/products/cleanser.jpg",
    rating: 4.5,
    reviews: 1840,
    location: "Powai",
    services: ["Hair", "Skin", "Nails"],
    badge: "Popular",
    badgeColor: "bg-foreground text-background",
  },
  {
    id: 6,
    name: "Looks Salon",
    image: "/images/products/moisturizer.jpg",
    rating: 4.6,
    reviews: 920,
    location: "Vashi, Navi Mumbai",
    services: ["Hair", "Makeup", "Spa"],
    badge: "Top Rated",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    id: 7,
    name: "Jean-Claude Biguine",
    image: "/images/products/serum.jpg",
    rating: 4.8,
    reviews: 678,
    location: "Khar West",
    services: ["Hair", "Color", "Treatments"],
    badge: "Premium",
    badgeColor: "bg-accent text-accent-foreground",
  },
  {
    id: 8,
    name: "Bounce Salon",
    image: "/images/products/toner.jpg",
    rating: 4.5,
    reviews: 432,
    location: "Kharghar, Navi Mumbai",
    services: ["Hair", "Nails", "Waxing"],
    badge: "New",
    badgeColor: "bg-destructive/90 text-destructive-foreground",
  },
]

export function FeaturedSalons() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-12 sm:py-14 md:py-18 lg:py-24 bg-card/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-8 sm:mb-12 scroll-reveal ${isVisible ? "visible" : ""}`}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-2 block">Discover</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground italic">
              Featured salons
            </h2>
          </div>
          <Link
            href="/salons"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary boty-transition group"
          >
            View all salons
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on larger screens */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
          {salons.map((salon, index) => (
            <Link
              key={salon.id}
              href={`/salon/${salon.id}`}
              className={`group flex-shrink-0 w-[280px] sm:w-auto snap-start rounded-2xl overflow-hidden bg-card boty-transition hover:-translate-y-2 hover:shadow-xl scroll-reveal-scale ${isVisible ? "visible" : ""} stagger-${index + 1}`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={salon.image}
                  alt={salon.name}
                  fill
                  className="object-cover group-hover:scale-105 boty-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 boty-transition" />
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ${salon.badgeColor}`}>
                    {salon.badge}
                  </span>
                </div>
                {/* Favorite */}
                <button
                  type="button"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 boty-transition hover:bg-background"
                  aria-label="Add to favorites"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="w-4 h-4 text-foreground/60 hover:text-destructive boty-transition" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-sm sm:text-base font-medium text-foreground mb-1.5 line-clamp-1">
                  {salon.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{salon.location}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{salon.rating}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">({salon.reviews.toLocaleString()})</span>
                  </div>
                  <div className="hidden sm:flex gap-1">
                    {salon.services.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/8 text-primary/80 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/salons"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 boty-transition"
          >
            View all salons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
