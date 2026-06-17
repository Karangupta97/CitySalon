"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react"
import { salonsList, type SalonListItem } from "@/data/salons-list"

const serviceCategories = [
  "All",
  "Hair",
  "Skin",
  "Makeup",
  "Nails",
  "Spa",
  "Color",
  "Bridal",
  "Treatments",
  "Waxing",
  "Body",
]

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Most Reviewed", value: "reviews-desc" },
  { label: "Distance: Nearest", value: "distance" },
  { label: "Hygiene Score", value: "hygiene" },
]

const statusConfig = {
  available: { label: "Walk-in Available", color: "bg-emerald-500", textColor: "text-emerald-700" },
  "short-wait": { label: "Short Wait", color: "bg-amber-400", textColor: "text-amber-700" },
  busy: { label: "Busy", color: "bg-orange-400", textColor: "text-orange-700" },
  "fully-booked": { label: "Fully Booked", color: "bg-red-400", textColor: "text-red-700" },
}

export function SalonsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("cat") || "All"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
  )
  const [sortBy, setSortBy] = useState("recommended")
  const [showFilters, setShowFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [openNowFilter, setOpenNowFilter] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const gridRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll reveal for grid
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.05 }
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  // Re-trigger animation on filter change
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [selectedCategory, searchQuery, sortBy, openNowFilter, minRating])

  const filteredSalons = useMemo(() => {
    let results = [...salonsList]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.services.some((svc) => svc.toLowerCase().includes(q)) ||
          s.tagline.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      results = results.filter((s) =>
        s.services.some((svc) => svc.toLowerCase() === selectedCategory.toLowerCase())
      )
    }

    // Open now filter
    if (openNowFilter) {
      results = results.filter((s) => s.openNow)
    }

    // Minimum rating
    if (minRating > 0) {
      results = results.filter((s) => s.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case "rating-desc":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "reviews-desc":
        results.sort((a, b) => b.reviews - a.reviews)
        break
      case "distance":
        results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        break
      case "hygiene":
        results.sort((a, b) => b.hygieneScore - a.hygieneScore)
        break
      default:
        // Recommended: featured first, then by rating
        results.sort((a, b) => {
          if (a.badge === "Featured" && b.badge !== "Featured") return -1
          if (b.badge === "Featured" && a.badge !== "Featured") return 1
          return b.rating - a.rating
        })
    }

    return results
  }, [searchQuery, selectedCategory, sortBy, openNowFilter, minRating])

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <div className="pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2 sm:mb-3 block animate-blur-in">
              Explore
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 animate-blur-in opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <span className="italic">Discover salons</span> near you
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto animate-blur-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Browse verified salons, compare services, and find your perfect match.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 animate-blur-in opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <div className="relative">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search salons, services, or locations..."
                className="w-full pl-11 sm:pl-13 pr-4 sm:pr-5 py-3.5 sm:py-4 rounded-full bg-card border border-border/50 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 boty-shadow boty-transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground boty-transition"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-blur-in opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium boty-transition ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground/70 hover:text-foreground boty-shadow hover:bg-card/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredSalons.length} {filteredSalons.length === 1 ? "salon" : "salons"} found
              </span>
              {/* Active filter indicators */}
              {(openNowFilter || minRating > 0) && (
                <div className="hidden sm:flex items-center gap-2">
                  {openNowFilter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      Open Now
                      <button type="button" onClick={() => setOpenNowFilter(false)} aria-label="Remove open now filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {minRating}+ ★
                      <button type="button" onClick={() => setMinRating(0)} aria-label="Remove rating filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter button */}
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-foreground/70 hover:text-foreground bg-card boty-shadow boty-transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-foreground/70 hover:text-foreground bg-card boty-shadow boty-transition"
                >
                  <span className="hidden sm:inline">
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className={`w-3.5 h-3.5 boty-transition ${showSortDropdown ? "rotate-180" : ""}`} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border/50 rounded-xl boty-shadow-lg py-2 z-20 animate-fade-in">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm boty-transition ${
                          sortBy === option.value
                            ? "text-primary font-medium bg-primary/5"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Salon Grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredSalons.map((salon, index) => (
              <SalonCard key={salon.id} salon={salon} index={index} isVisible={isVisible} />
            ))}
          </div>

          {/* Empty state */}
          {filteredSalons.length === 0 && (
            <div className="text-center py-16 sm:py-24">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">No salons found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Try adjusting your search or filters to discover more salons.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setOpenNowFilter(false)
                  setMinRating(0)
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium boty-transition hover:bg-primary/90"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer (Mobile/Desktop overlay) */}
      {showFilters && (
        <FilterDrawer
          openNowFilter={openNowFilter}
          setOpenNowFilter={setOpenNowFilter}
          minRating={minRating}
          setMinRating={setMinRating}
          onClose={() => setShowFilters(false)}
        />
      )}
    </main>
  )
}


function SalonCard({
  salon,
  index,
  isVisible,
}: {
  salon: SalonListItem
  index: number
  isVisible: boolean
}) {
  const status = statusConfig[salon.liveStatus]

  return (
    <Link
      href={`/salon/${salon.id}`}
      className={`group rounded-2xl sm:rounded-3xl overflow-hidden bg-card boty-transition hover:-translate-y-1.5 hover:shadow-xl transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={salon.image}
          alt={salon.name}
          fill
          className="object-cover group-hover:scale-105 boty-transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        {salon.badge && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm ${salon.badgeColor}`}
            >
              {salon.badge}
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 boty-transition hover:bg-background"
          aria-label="Add to favorites"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-4 h-4 text-foreground/60 hover:text-destructive boty-transition" />
        </button>

        {/* Live status indicator */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[10px] sm:text-[11px] font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${status.color} animate-pulse`} />
            <span className={status.textColor}>{status.label}</span>
          </span>
        </div>

        {/* Distance */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[10px] sm:text-[11px] text-foreground/80">
            <MapPin className="w-3 h-3" />
            {salon.distance}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name & Tagline */}
        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-0.5 line-clamp-1 group-hover:text-primary boty-transition">
          {salon.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-3 line-clamp-1 italic">
          {salon.tagline}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{salon.location}</span>
          {salon.openNow && (
            <>
              <span className="text-border mx-1">·</span>
              <span className="text-emerald-600 font-medium">Open</span>
            </>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1 mb-3">
          {salon.services.slice(0, 4).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-md bg-primary/8 text-primary/80 font-medium"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer: Rating, Hygiene, Price */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">{salon.rating}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                ({salon.reviews.toLocaleString()})
              </span>
            </div>
            {/* Hygiene */}
            <div className="hidden sm:flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary/70" />
              <span className="text-[10px] text-primary/80 font-medium">{salon.hygieneScore}%</span>
            </div>
          </div>
          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 boty-transition" />
        </div>
      </div>
    </Link>
  )
}

function FilterDrawer({
  openNowFilter,
  setOpenNowFilter,
  minRating,
  setMinRating,
  onClose,
}: {
  openNowFilter: boolean
  setOpenNowFilter: (v: boolean) => void
  minRating: number
  setMinRating: (v: number) => void
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-background border-l border-border/40 animate-fade-in overflow-y-auto">
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-xl sm:text-2xl text-foreground">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted boty-transition"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Open Now */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-foreground mb-3">Availability</h3>
            <button
              type="button"
              onClick={() => setOpenNowFilter(!openNowFilter)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm boty-transition ${
                openNowFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground/70 boty-shadow hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              Open Now
            </button>
          </div>

          {/* Minimum Rating */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-foreground mb-3">Minimum Rating</h3>
            <div className="flex gap-2">
              {[0, 4.0, 4.3, 4.5, 4.7].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm boty-transition ${
                    minRating === rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground/70 boty-shadow hover:text-foreground"
                  }`}
                >
                  {rating === 0 ? (
                    "Any"
                  ) : (
                    <>
                      <Star className="w-3 h-3" />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hygiene Score info */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-foreground mb-3">About Hygiene Score</h3>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Verified Hygiene Rating</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each salon is scored on autoclave sterilization, fresh towels, licensed staff,
                    disposable kits, sanitization, and air purification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor promo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium mb-1">Need help choosing?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Our AI Advisor can recommend salons based on your specific needs.
                </p>
                <Link
                  href="/advisor"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 boty-transition"
                  onClick={onClose}
                >
                  Try AI Advisor
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <div className="mt-8 pt-5 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium boty-transition hover:bg-primary/90"
            >
              Show {salonsList.length} salons
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
