"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronDown,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Instagram,
  Heart,
  Share2,
  Wifi,
  Car,
  CreditCard,
  Wind,
  Accessibility,
  Calendar,
  ShieldCheck,
  Coffee,
  Send,
  ThumbsUp,
  Navigation,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { salons } from "@/data/salons"

const salonNavItems = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "stylists", label: "Stylists" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "offers", label: "Offers" },
  { id: "products", label: "Products" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
]

const amenityIcons: Record<string, typeof Wifi> = {
  "Free WiFi": Wifi,
  "Complimentary Beverages": Coffee,
  "Dedicated Parking": Car,
  "Air Conditioned": Wind,
  "Wheelchair Accessible": Accessibility,
  "Online Booking": Calendar,
  "Card Payment Accepted": CreditCard,
  "Sanitized Equipment": ShieldCheck,
}

export default function SalonPage() {
  const params = useParams()
  const salonId = params.id as string
  const salon = salons[salonId]

  const [activeCategory, setActiveCategory] = useState("All")
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewName, setReviewName] = useState("")
  const [reviewService, setReviewService] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  const salonNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [salonId])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (salonNavRef.current) {
      const navBottom = salonNavRef.current.getBoundingClientRect().bottom
      if (navBottom < 0) {
        salonNavRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  if (!salon) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 text-center max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl text-foreground mb-4">Salon not found</h1>
          <p className="text-muted-foreground mb-8">
            The salon you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const serviceCategories = ["All", ...Array.from(new Set(salon.services.map((s) => s.category)))]
  const filteredServices =
    activeCategory === "All"
      ? salon.services
      : salon.services.filter((s) => s.category === activeCategory)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-10 sm:pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary boty-transition mb-5 sm:mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 boty-transition" />
            Back to Explore
          </Link>

          {/* Hero Section */}
          <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mb-0 group">
            <div className="relative aspect-[16/9] sm:aspect-[18/8] md:aspect-[21/8]">
              <Image src={salon.heroImage} alt={salon.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 md:p-8 lg:p-12">
              <div className="flex items-end justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground">
                      Featured
                    </span>
                  </div>
                  <h1 className="font-serif text-lg sm:text-2xl md:text-4xl lg:text-5xl text-white mb-1.5 sm:mb-2 md:mb-3 leading-tight">
                    {salon.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-5 text-white/80 text-[11px] sm:text-xs md:text-sm">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[150px] sm:max-w-none">{salon.fullAddress}</span>
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-accent text-accent flex-shrink-0" />
                      {salon.rating} ({salon.reviews.toLocaleString()})
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button type="button" onClick={() => setIsFavorited(!isFavorited)} className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center boty-transition border ${isFavorited ? "bg-red-500 border-red-500 text-white" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`} aria-label="Add to favorites">
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 boty-transition" aria-label="Share salon">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Navigation Bar */}
          <div
            ref={salonNavRef}
            className="sticky top-[62px] sm:top-[74px] md:top-[82px] lg:top-[90px] z-40 mt-4 sm:mt-6 md:mt-8"
          >
            <div className="rounded-full bg-background/95 backdrop-blur-xl border border-border/30">
              <div className="flex items-center justify-between px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5">
                <nav className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-hide" aria-label="Salon sections">
                  <div className="flex items-center gap-0.5 sm:gap-1 min-w-max">
                    {salonNavItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabChange(item.id)}
                        className={`relative px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 text-[11px] sm:text-xs md:text-sm rounded-full whitespace-nowrap boty-transition ${
                          activeTab === item.id
                            ? "text-primary-foreground bg-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </nav>
                <button type="button" className="flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-foreground text-background rounded-full text-[11px] sm:text-xs md:text-sm font-medium boty-transition hover:bg-foreground/90">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Book Now</span>
                  <span className="sm:hidden">Book</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            <div className="max-w-5xl mx-auto">

                {/* ─── OVERVIEW TAB ─── */}
                {activeTab === "overview" && (
                  <div className="animate-fade-in">
                    <div className="mb-8 sm:mb-10 pl-4 border-l-2 border-accent/50">
                      <p className="font-serif text-xl sm:text-2xl text-foreground/80 italic leading-relaxed">
                        &ldquo;{salon.tagline}&rdquo;
                      </p>
                    </div>

                    <div className="mb-10 sm:mb-12">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-px bg-primary/40" />
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">About</h3>
                      </div>
                      <h4 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-4">Welcome to {salon.name}</h4>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{salon.description}</p>
                    </div>

                    <div className="mb-10 sm:mb-12">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-px bg-primary/40" />
                          <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Gallery</h3>
                        </div>
                        <button type="button" onClick={() => handleTabChange("gallery")} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:text-primary/70 boty-transition">
                          View all photos
                          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {salon.galleryImages.slice(0, 6).map((img, index) => (
                          <button key={img.src} type="button" onClick={() => { setActiveGalleryIndex(index); handleTabChange("gallery") }} className={`relative rounded-xl sm:rounded-2xl overflow-hidden group ${index === 0 ? "col-span-2 sm:col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                            <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 boty-transition" />
                            {index === 5 && salon.galleryImages.length > 6 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-sm sm:text-base font-medium">+{salon.galleryImages.length - 5} more</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-10 sm:mb-12">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="w-5 h-px bg-primary/40" />
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Highlights</h3>
                      </div>
                      <h4 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-5">What Sets Us Apart</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {salon.highlights.map((highlight, index) => (
                          <div key={highlight} className="flex items-start gap-3 p-4 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                              <span className="text-[11px] font-bold text-primary">{index + 1}</span>
                            </div>
                            <span className="text-sm text-foreground/80 leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="w-5 h-px bg-primary/40" />
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Facilities</h3>
                      </div>
                      <h4 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-5">Amenities & Facilities</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {salon.amenities.map((amenity) => {
                          const IconComp = amenityIcons[amenity] || ShieldCheck
                          return (
                            <div key={amenity} className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 text-center hover:border-primary/30 hover:shadow-md boty-transition group">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/12 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 boty-transition">
                                <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              </div>
                              <span className="text-[11px] sm:text-xs text-foreground/80 leading-tight font-medium">{amenity}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── SERVICES TAB ─── */}
                {activeTab === "services" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Menu</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground mb-1.5">Services & Pricing</h2>
                      <p className="text-sm text-muted-foreground">{salon.services.length} curated services for your beauty needs</p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-hide -mx-1 px-1">
                      {serviceCategories.map((cat) => {
                        const count = cat === "All" ? salon.services.length : salon.services.filter((s) => s.category === cat).length
                        return (
                          <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium boty-transition ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-card/70 text-muted-foreground border border-border/30 hover:border-primary/30 hover:text-foreground"}`}>
                            {cat} ({count})
                          </button>
                        )
                      })}
                    </div>

                    <div className="rounded-2xl border border-border/20 overflow-hidden">
                      <div className="max-h-[500px] sm:max-h-[550px] overflow-y-auto scrollbar-thin">
                        {filteredServices.map((service, index) => (
                          <div key={service.name} className={`group flex items-center justify-between gap-4 py-4 sm:py-5 px-4 sm:px-5 hover:bg-card/60 boty-transition ${index !== filteredServices.length - 1 ? "border-b border-border/20" : ""}`}>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-medium text-foreground truncate group-hover:text-primary boty-transition">{service.name}</h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{service.duration}</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-xs text-primary/70 font-medium">{service.category}</span>
                              </div>
                            </div>
                            <span className="text-sm sm:text-base font-bold text-foreground whitespace-nowrap">{service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {filteredServices.length > 7 && (
                      <p className="text-[11px] text-muted-foreground/60 mt-3 text-center">↕ Scroll to see all {filteredServices.length} services</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-6 text-center leading-relaxed">Prices may vary based on hair length and complexity. GST applicable on all services.</p>
                  </div>
                )}

                {/* ─── STYLISTS TAB ─── */}
                {activeTab === "stylists" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Team</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Our Stylists</h2>
                      <p className="text-sm text-muted-foreground mt-2">Our team of experienced professionals is dedicated to making you look and feel your best.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "Priya Sharma", role: "Senior Hair Stylist", experience: "8 years", speciality: "Balayage & Color", clients: "2,400+" },
                        { name: "Rahul Desai", role: "Creative Director", experience: "12 years", speciality: "Precision Cuts", clients: "4,200+" },
                        { name: "Sneha Patel", role: "Skin Specialist", experience: "6 years", speciality: "Hydra Facials", clients: "1,800+" },
                        { name: "Ananya Mehta", role: "Makeup Artist", experience: "10 years", speciality: "Bridal Makeup", clients: "3,100+" },
                        { name: "Vikram Joshi", role: "Hair Stylist", experience: "5 years", speciality: "Keratin & Smoothening", clients: "1,500+" },
                        { name: "Divya Nair", role: "Nail Artist", experience: "4 years", speciality: "Gel Extensions & Art", clients: "1,200+" },
                      ].map((stylist) => (
                        <div key={stylist.name} className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-lg boty-transition">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-base font-bold text-primary">{stylist.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-foreground mb-0.5">{stylist.name}</h4>
                            <p className="text-xs text-primary font-medium mb-2.5">{stylist.role}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground mb-2.5">
                              <span>{stylist.experience} experience</span>
                              <span>{stylist.clients} clients served</span>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] bg-primary/8 text-primary font-medium">{stylist.speciality}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── REVIEWS TAB ─── */}
                {activeTab === "reviews" && (
                  <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-5 h-px bg-primary/40" />
                          <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Feedback</span>
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Customer Reviews</h2>
                      </div>
                      <button type="button" onClick={() => setShowReviewForm(!showReviewForm)} className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-foreground text-background rounded-full text-xs sm:text-sm font-medium hover:bg-foreground/90 boty-transition self-start sm:self-auto">
                        <Send className="w-3.5 h-3.5" />
                        Write a Review
                      </button>
                    </div>

                    {showReviewForm && (
                      <div className="mb-8 p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border/40 animate-fade-in">
                        <h3 className="font-serif text-base sm:text-lg font-medium text-foreground mb-5">Share Your Experience</h3>
                        <div className="mb-5">
                          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)} className="p-0.5 boty-transition">
                                <Star className={`w-6 h-6 sm:w-7 sm:h-7 boty-transition ${star <= (reviewHover || reviewRating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
                            <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="e.g. Priya S." className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition" />
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Service Availed</label>
                            <input type="text" value={reviewService} onChange={(e) => setReviewService(e.target.value)} placeholder="e.g. Haircut, Facial" className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition" />
                          </div>
                        </div>
                        <div className="mb-5">
                          <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Your Review</label>
                          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us about your experience..." rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition resize-none" />
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                          <button type="button" onClick={() => setShowReviewForm(false)} className="px-5 py-2.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground boty-transition">Cancel</button>
                          <button type="button" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 boty-transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!reviewRating || !reviewText.trim()}>
                            <Send className="w-3.5 h-3.5" />
                            Submit Review
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border/30 mb-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                        <div className="flex items-center gap-4 sm:gap-5">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-foreground flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold text-background">{salon.rating}</span>
                          </div>
                          <div>
                            <div className="flex gap-0.5 mb-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(salon.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
                              ))}
                            </div>
                            <p className="text-sm sm:text-base font-medium text-foreground">{salon.reviews.toLocaleString()} reviews</p>
                          </div>
                        </div>
                        <div className="hidden sm:block w-px h-16 bg-border/50" />
                        <div className="flex-1 w-full space-y-2.5">
                          {[{ label: "Ambience", value: 98 }, { label: "Service Quality", value: 96 }, { label: "Hygiene", value: 99 }, { label: "Value for Money", value: 92 }].map((metric) => (
                            <div key={metric.label} className="flex items-center gap-3">
                              <span className="text-xs sm:text-sm text-muted-foreground w-28 sm:w-32">{metric.label}</span>
                              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary" style={{ width: `${metric.value}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-foreground w-9 text-right">{metric.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {[
                        { name: "Meera K.", rating: 5, date: "2 weeks ago", service: "Balayage", text: "Absolutely stunning salon! The ambience is unlike anything in Navi Mumbai. Got a balayage done by Priya and it turned out perfect.", helpful: 12 },
                        { name: "Rohit S.", rating: 5, date: "1 month ago", service: "Haircut", text: "Best haircut experience I've had. Rahul understood exactly what I wanted.", helpful: 8 },
                        { name: "Anita D.", rating: 4, date: "1 month ago", service: "Bridal Trial", text: "Came for a bridal trial and was blown away. Ananya is incredibly talented.", helpful: 15 },
                        { name: "Prachi V.", rating: 5, date: "3 weeks ago", service: "Spa Pedicure", text: "The pedicure station is so luxurious! Staff is professional and hygienic.", helpful: 6 },
                        { name: "Kavita R.", rating: 5, date: "1 week ago", service: "Hydra Facial", text: "Sneha really knows her stuff. My skin felt amazing after the hydra facial.", helpful: 9 },
                        { name: "Arjun M.", rating: 5, date: "5 days ago", service: "Keratin Treatment", text: "Got keratin done by Vikram. Excellent results — my hair has never been this smooth.", helpful: 4 },
                      ].map((review) => (
                        <div key={review.name + review.date} className="p-5 sm:p-6 rounded-2xl bg-card border border-border/20 hover:border-border/40 boty-transition">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-primary">{review.name[0]}</span>
                              </div>
                              <div>
                                <p className="text-sm sm:text-base font-medium text-foreground">{review.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{review.date}</p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/80 text-[11px] sm:text-xs font-medium text-foreground/70">{review.service}</span>
                          </div>
                          <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`} />))}
                          </div>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">{review.text}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-border/20">
                            <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground boty-transition">
                              <ThumbsUp className="w-3.5 h-3.5" />Helpful ({review.helpful})
                            </button>
                            <span className="text-[11px] text-muted-foreground/60">Verified visit</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── GALLERY TAB ─── */}
                {activeTab === "gallery" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Photos</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Gallery</h2>
                    </div>
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-5 group">
                      <div className="relative aspect-[16/9]">
                        <Image src={salon.galleryImages[activeGalleryIndex].src} alt={salon.galleryImages[activeGalleryIndex].alt} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <p className="text-sm sm:text-base text-white font-medium">{salon.galleryImages[activeGalleryIndex].caption}</p>
                        <p className="text-[11px] text-white/60 mt-1">{activeGalleryIndex + 1} of {salon.galleryImages.length}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {salon.galleryImages.map((img, index) => (
                        <button key={img.src} type="button" onClick={() => setActiveGalleryIndex(index)} className={`relative aspect-square rounded-xl overflow-hidden boty-transition ${index === activeGalleryIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-95" : "opacity-60 hover:opacity-100 hover:scale-95"}`}>
                          <Image src={img.src} alt={img.alt} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── OFFERS TAB ─── */}
                {activeTab === "offers" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-accent/50" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium">Deals</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Offers & Packages</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Bridal Glow Package", description: "Complete bridal prep — facial, hair spa, mani-pedi, and trial makeup", originalPrice: "₹24,999", offerPrice: "₹18,999", badge: "Save 24%", validity: "Valid till Dec 2026" },
                        { title: "First Visit Special", description: "20% off on any single service for first-time customers", originalPrice: null, offerPrice: "20% OFF", badge: "New Customer", validity: "No expiry" },
                        { title: "Hair Transformation", description: "Global color + keratin treatment + hair spa combo", originalPrice: "₹12,499", offerPrice: "₹8,999", badge: "Popular", validity: "Valid till Sep 2026" },
                        { title: "Weekend Pamper", description: "Hydra facial + spa pedicure + head massage — every Saturday", originalPrice: "₹5,499", offerPrice: "₹3,999", badge: "Weekends", validity: "Saturdays only" },
                        { title: "Loyalty Rewards", description: "Every 5th visit — get a complimentary hair spa or basic facial", originalPrice: null, offerPrice: "FREE", badge: "Members", validity: "Ongoing" },
                        { title: "Couple's Package", description: "His & hers haircut + styling + head massage combo", originalPrice: "₹2,998", offerPrice: "₹1,999", badge: "Save 33%", validity: "Valid till Oct 2026" },
                      ].map((offer) => (
                        <div key={offer.title} className="relative p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 hover:border-accent/30 hover:shadow-lg boty-transition">
                          <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide bg-accent/15 text-accent">{offer.badge}</span>
                          <h4 className="font-medium text-foreground text-sm sm:text-base mb-1.5 pr-20">{offer.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{offer.description}</p>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-xl sm:text-2xl font-bold text-foreground">{offer.offerPrice}</span>
                            {offer.originalPrice && <span className="text-sm text-muted-foreground line-through">{offer.originalPrice}</span>}
                          </div>
                          <p className="text-[11px] text-muted-foreground/70">{offer.validity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── PRODUCTS TAB ─── */}
                {activeTab === "products" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Brands</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Products We Use</h2>
                      <p className="text-sm text-muted-foreground mt-2">We use only premium, salon-grade products for all our treatments.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "L'Oréal Professionnel", category: "Hair Color & Care", description: "Professional-grade hair color and care products trusted by stylists worldwide." },
                        { name: "Kérastase", category: "Hair Treatments", description: "Luxury hair treatments for deep conditioning, repair, and restoration." },
                        { name: "Dermalogica", category: "Skin Care", description: "Professional skin care backed by education and innovation." },
                        { name: "MAC Cosmetics", category: "Makeup", description: "Industry-leading makeup products for flawless looks." },
                        { name: "OPI", category: "Nail Care", description: "Salon-quality nail lacquers and care systems." },
                        { name: "Schwarzkopf", category: "Hair Styling", description: "Premium styling products for hold, volume, and texture." },
                        { name: "The Body Shop", category: "Body Treatments", description: "Ethically sourced body care and treatments." },
                        { name: "Moroccanoil", category: "Hair Oil & Serum", description: "Argan oil-infused products for smooth, shiny hair." },
                      ].map((product) => (
                        <div key={product.name} className="flex items-start gap-4 p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/12 to-accent/8 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-accent/15 boty-transition">
                            <span className="text-xs font-bold text-primary">{product.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-medium text-foreground">{product.name}</h4>
                            <p className="text-[11px] text-accent font-semibold mb-1.5">{product.category}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── FAQS TAB ─── */}
                {activeTab === "faqs" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Support</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { q: "Do I need to book an appointment in advance?", a: "Walk-ins are welcome, but we recommend booking in advance especially on weekends and for bridal services to ensure availability of your preferred stylist." },
                        { q: "What safety and hygiene measures are followed?", a: "All tools are sterilized after each use. We maintain sanitized workstations, disposable capes and towels for certain services, and regular deep-cleaning of the entire salon." },
                        { q: "Is parking available?", a: "Yes, we have dedicated parking space for our customers right outside the salon premises. Two-wheeler and four-wheeler parking available." },
                        { q: "What is the cancellation policy?", a: "Free cancellation up to 4 hours before your appointment. Cancellations within 4 hours may be charged 25% of the service fee." },
                        { q: "Do you offer bridal packages?", a: "Yes! We offer comprehensive bridal packages including trial sessions, pre-wedding skin prep, and day-of bridal makeup." },
                        { q: "Are your products cruelty-free?", a: "We prioritize brands that are cruelty-free and ethically sourced. Most of our product partners follow sustainable and cruelty-free practices." },
                        { q: "What payment methods do you accept?", a: "We accept cash, all major credit/debit cards, UPI (GPay, PhonePe, Paytm), and bank transfers. EMI options available for packages above ₹5,000." },
                        { q: "How do I earn loyalty points?", a: "Every ₹100 spent earns you 5 loyalty points. Accumulate 500 points and redeem them for a free service of your choice from our starter menu." },
                      ].map((faq, index) => (
                        <details key={index} className="group rounded-2xl bg-card/70 overflow-hidden border border-border/20 hover:border-primary/20 boty-transition">
                          <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none">
                            <span className="text-sm sm:text-base font-medium text-foreground pr-4">{faq.q}</span>
                            <ChevronDown className="w-4 h-4 text-primary/60 flex-shrink-0 group-open:rotate-180 boty-transition" />
                          </summary>
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                    <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/8 to-accent/5 border border-primary/10 text-center">
                      <p className="font-serif text-lg text-foreground mb-2">Still have questions?</p>
                      <p className="text-sm text-muted-foreground mb-5">Our team is happy to help with any queries.</p>
                      <a href={`tel:${salon.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium boty-transition hover:bg-primary/90 hover:shadow-md">
                        <Phone className="w-4 h-4" />
                        Call Us
                      </a>
                    </div>
                  </div>
                )}

                {/* ─── CONTACT TAB ─── */}
                {activeTab === "contact" && (
                  <div className="animate-fade-in">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-5 h-px bg-primary/40" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Get in Touch</span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground">Contact & Location</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                      <a href={`tel:${salon.phone}`} className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div><p className="text-xs text-muted-foreground mb-0.5">Phone</p><p className="text-sm font-medium text-foreground">{salon.phone}</p></div>
                      </a>
                      <a href={`mailto:${salon.email}`} className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div><p className="text-xs text-muted-foreground mb-0.5">Email</p><p className="text-sm font-medium text-foreground">{salon.email}</p></div>
                      </a>
                      <a href={salon.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div><p className="text-xs text-muted-foreground mb-0.5">Website</p><p className="text-sm font-medium text-foreground">Visit Website</p></div>
                      </a>
                      <a href={salon.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 hover:shadow-md boty-transition group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 boty-transition">
                          <Instagram className="w-5 h-5 text-primary" />
                        </div>
                        <div><p className="text-xs text-muted-foreground mb-0.5">Instagram</p><p className="text-sm font-medium text-foreground">@akshitashoanakstudio</p></div>
                      </a>
                    </div>

                    <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 mb-8">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div><p className="text-xs text-muted-foreground mb-1">Address</p><p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">{salon.fullAddress}</p></div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 mb-8">
                      <h3 className="font-medium text-foreground text-sm sm:text-base mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Opening Hours
                      </h3>
                      <div className="space-y-2.5">
                        {Object.entries(salon.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{day}</span>
                            <span className="text-foreground text-xs font-medium bg-muted/50 px-2.5 py-1 rounded-lg">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-border/20">
                      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px]">
                        <iframe
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(salon.fullAddress)}&zoom=15`}
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map showing ${salon.name} location`}
                        />
                      </div>
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{salon.fullAddress}</p>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const { latitude, longitude } = position.coords
                                  window.open(`https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(salon.fullAddress)}`, '_blank')
                                },
                                () => { window.open(`https://www.google.com/maps/dir//${encodeURIComponent(salon.fullAddress)}`, '_blank') }
                              )
                            } else {
                              window.open(`https://www.google.com/maps/dir//${encodeURIComponent(salon.fullAddress)}`, '_blank')
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium boty-transition hover:bg-primary/90 flex-shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
