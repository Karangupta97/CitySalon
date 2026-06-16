"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { salons } from "@/data/salons"

type AccordionSection = "about" | "design" | "zones" | null

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
  const [openAccordion, setOpenAccordion] = useState<AccordionSection>("about")
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [salonId])

  if (!salon) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 text-center max-w-7xl mx-auto px-5">
          <h1 className="font-serif text-3xl text-foreground mb-4">Salon not found</h1>
          <p className="text-muted-foreground mb-8">
            The salon you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm"
          >
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

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-5 sm:mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          {/* Hero Section */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12">
            <div className="relative aspect-[21/9] sm:aspect-[21/8]">
              <Image
                src={salon.heroImage}
                alt={salon.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Hero Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground">
                      Featured
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm">
                      Studio Serif Design
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white mb-2 sm:mb-3">
                    {salon.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {salon.fullAddress}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {salon.rating} ({salon.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center boty-transition ${
                      isFavorited ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    aria-label="Add to favorites"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 boty-transition"
                    aria-label="Share salon"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tagline */}
              <p className="font-serif text-lg sm:text-xl text-foreground/80 italic mb-6 sm:mb-8">
                &ldquo;{salon.tagline}&rdquo;
              </p>

              {/* About Accordion */}
              <div className="border-t border-border/50 mb-8">
                <button
                  type="button"
                  onClick={() => toggleAccordion("about")}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-serif text-lg font-medium text-foreground">About the Salon</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground boty-transition ${
                      openAccordion === "about" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden boty-transition ${
                    openAccordion === "about" ? "max-h-[600px] pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                    {salon.description}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {salon.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-2 p-3 rounded-lg bg-card"
                      >
                        <Star className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-foreground/80">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Design Story Accordion */}
              <div className="border-t border-border/50 mb-8">
                <button
                  type="button"
                  onClick={() => toggleAccordion("design")}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-serif text-lg font-medium text-foreground">
                    Design Story — by {salon.designFirm}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground boty-transition ${
                      openAccordion === "design" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden boty-transition ${
                    openAccordion === "design" ? "max-h-[400px] pb-5" : "max-h-0"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-serif font-medium text-primary">SS</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{salon.principalDesigner}</p>
                      <p className="text-xs text-muted-foreground">Principal Designer, {salon.designFirm}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {salon.designPhilosophy}
                  </p>
                </div>
              </div>

              {/* Salon Zones Accordion */}
              <div className="border-t border-b border-border/50 mb-8 sm:mb-10">
                <button
                  type="button"
                  onClick={() => toggleAccordion("zones")}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-serif text-lg font-medium text-foreground">
                    Salon Zones & Spaces
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground boty-transition ${
                      openAccordion === "zones" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden boty-transition ${
                    openAccordion === "zones" ? "max-h-[1200px] pb-5" : "max-h-0"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {salon.zones.map((zone) => (
                      <div key={zone.name} className="rounded-xl overflow-hidden bg-card">
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={zone.image}
                            alt={zone.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-foreground text-sm mb-1">{zone.name}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {zone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="mb-8 sm:mb-10">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
                  Gallery
                </h2>
                <div className="relative rounded-2xl overflow-hidden mb-3">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={salon.galleryImages[activeGalleryIndex].src}
                      alt={salon.galleryImages[activeGalleryIndex].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm text-white/90">
                      {salon.galleryImages[activeGalleryIndex].caption}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {salon.galleryImages.map((img, index) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setActiveGalleryIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden boty-transition ${
                        index === activeGalleryIndex
                          ? "ring-2 ring-primary ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="mb-8 sm:mb-10">
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
                  Services & Pricing
                </h2>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm boty-transition ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground/70 hover:text-foreground hover:bg-card/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Service List */}
                <div className="space-y-2">
                  {filteredServices.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-card/80 boty-transition"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{service.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{service.duration}</span>
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                            {service.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">{service.price}</span>
                        <button
                          type="button"
                          className="block mt-1 text-[11px] text-primary hover:underline"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {salon.amenities.map((amenity) => {
                    const IconComp = amenityIcons[amenity] || ShieldCheck
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-card"
                      >
                        <IconComp className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs text-foreground/80">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Booking Card */}
                <div className="rounded-2xl bg-card p-5 sm:p-6 boty-shadow">
                  <h3 className="font-serif text-lg font-medium text-foreground mb-1">
                    Book an Appointment
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    Choose a service and pick your preferred time
                  </p>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium boty-transition hover:bg-primary/90"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </button>
                  <p className="text-[11px] text-center text-muted-foreground mt-3">
                    Instant confirmation • Free cancellation up to 4hrs before
                  </p>
                </div>

                {/* Contact Info */}
                <div className="rounded-2xl bg-card p-5 sm:p-6">
                  <h3 className="font-medium text-foreground text-sm mb-4">Contact & Location</h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${salon.phone}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      {salon.phone}
                    </a>
                    <a
                      href={`mailto:${salon.email}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      {salon.email}
                    </a>
                    <a
                      href={salon.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition"
                    >
                      <Globe className="w-4 h-4 text-primary" />
                      Website
                    </a>
                    <a
                      href={salon.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition"
                    >
                      <Instagram className="w-4 h-4 text-primary" />
                      @akshitashoanakstudio
                    </a>
                    <div className="flex items-start gap-3 text-sm text-muted-foreground pt-1">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{salon.fullAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="rounded-2xl bg-card p-5 sm:p-6">
                  <h3 className="font-medium text-foreground text-sm mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Opening Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(salon.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{day}</span>
                        <span className="text-foreground text-xs font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Summary */}
                <div className="rounded-2xl bg-card p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{salon.rating}</span>
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(salon.rating)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on {salon.reviews.toLocaleString()} reviews
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Ambience", value: 98 },
                      { label: "Service Quality", value: 96 },
                      { label: "Hygiene", value: 99 },
                      { label: "Value for Money", value: 92 },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-24">{metric.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-foreground font-medium w-8 text-right">
                          {metric.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
