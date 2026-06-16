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
  Tag,
  HelpCircle,
  Users,
  Image as ImageIcon,
  Scissors,
  Package,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { salons } from "@/data/salons"

type AccordionSection = "about" | "design" | "zones" | null

const salonNavItems = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "stylists", label: "Stylists" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "offers", label: "Offers" },
  { id: "products", label: "Products" },
  { id: "faqs", label: "FAQs" },
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
  const [openAccordion, setOpenAccordion] = useState<AccordionSection>("about")
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isNavSticky, setIsNavSticky] = useState(false)

  const salonNavRef = useRef<HTMLDivElement>(null)
  const activeIndicatorRef = useRef<HTMLDivElement>(null)
  const tabButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [salonId])

  // Sticky detection
  useEffect(() => {
    const handleScroll = () => {
      if (salonNavRef.current) {
        const navTop = salonNavRef.current.getBoundingClientRect().top
        setIsNavSticky(navTop <= 72)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animate active indicator
  useEffect(() => {
    const activeButton = tabButtonsRef.current[activeTab]
    const indicator = activeIndicatorRef.current
    if (activeButton && indicator) {
      const { offsetLeft, offsetWidth } = activeButton
      indicator.style.left = `${offsetLeft}px`
      indicator.style.width = `${offsetWidth}px`
    }
  }, [activeTab])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    // Scroll content area to top when switching tabs
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
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-0">
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

          {/* Secondary Navigation Bar */}
          <div
            ref={salonNavRef}
            className={`sticky top-[56px] sm:top-[64px] lg:top-[68px] z-40 -mx-5 sm:-mx-6 lg:-mx-8 transition-all duration-300 ${
              isNavSticky
                ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                : "bg-background border-b border-border/20"
            }`}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
              <nav className="relative flex items-center overflow-x-auto scrollbar-hide" aria-label="Salon sections">
                <div className="flex items-center gap-0 min-w-max relative">
                  {/* Sliding active indicator */}
                  <div
                    ref={activeIndicatorRef}
                    className="absolute bottom-0 h-[2px] bg-foreground rounded-full transition-all duration-300 ease-out"
                  />
                  {salonNavItems.map((item) => (
                    <button
                      key={item.id}
                      ref={(el) => { tabButtonsRef.current[item.id] = el }}
                      type="button"
                      onClick={() => handleTabChange(item.id)}
                      className={`relative px-4 sm:px-5 lg:px-6 py-4 text-sm tracking-wide whitespace-nowrap boty-transition ${
                        activeTab === item.id
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground/80"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8 sm:mt-10 lg:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {/* Left Column - Tab Content */}
              <div className="lg:col-span-2 min-h-[60vh]">

                {/* ─── OVERVIEW TAB ─── */}
                {activeTab === "overview" && (
                  <div className="animate-fade-in">
                    <p className="font-serif text-lg sm:text-xl text-foreground/80 italic mb-6 sm:mb-8">
                      &ldquo;{salon.tagline}&rdquo;
                    </p>

                    {/* About */}
                    <div className="border-t border-border/50 mb-8">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("about")}
                        className="w-full flex items-center justify-between py-5 text-left"
                      >
                        <span className="font-serif text-lg font-medium text-foreground">About the Salon</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground boty-transition ${openAccordion === "about" ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden boty-transition ${openAccordion === "about" ? "max-h-[600px] pb-5" : "max-h-0"}`}>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                          {salon.description}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {salon.highlights.map((highlight) => (
                            <div key={highlight} className="flex items-start gap-2 p-3 rounded-lg bg-card">
                              <Star className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-foreground/80">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Design Story */}
                    <div className="border-t border-border/50 mb-8">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("design")}
                        className="w-full flex items-center justify-between py-5 text-left"
                      >
                        <span className="font-serif text-lg font-medium text-foreground">
                          Design Story — by {salon.designFirm}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground boty-transition ${openAccordion === "design" ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden boty-transition ${openAccordion === "design" ? "max-h-[400px] pb-5" : "max-h-0"}`}>
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

                    {/* Zones */}
                    <div className="border-t border-b border-border/50 mb-8">
                      <button
                        type="button"
                        onClick={() => toggleAccordion("zones")}
                        className="w-full flex items-center justify-between py-5 text-left"
                      >
                        <span className="font-serif text-lg font-medium text-foreground">Salon Zones & Spaces</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground boty-transition ${openAccordion === "zones" ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden boty-transition ${openAccordion === "zones" ? "max-h-[1200px] pb-5" : "max-h-0"}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {salon.zones.map((zone) => (
                            <div key={zone.name} className="rounded-xl overflow-hidden bg-card">
                              <div className="relative aspect-[16/10]">
                                <Image src={zone.image} alt={zone.name} fill className="object-cover" />
                              </div>
                              <div className="p-4">
                                <h4 className="font-medium text-foreground text-sm mb-1">{zone.name}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{zone.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="font-serif text-lg font-medium text-foreground mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {salon.amenities.map((amenity) => {
                          const IconComp = amenityIcons[amenity] || ShieldCheck
                          return (
                            <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-lg bg-card">
                              <IconComp className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-xs text-foreground/80">{amenity}</span>
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
                    <div className="flex items-center gap-3 mb-6">
                      <Scissors className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Services & Pricing</h2>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-5 scrollbar-hide">
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
                          className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-card/80 boty-transition group"
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
                              className="block mt-1 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 boty-transition"
                            >
                              Book Now →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground mt-6 text-center">
                      Prices may vary based on hair length and complexity. GST applicable on all services.
                    </p>
                  </div>
                )}

                {/* ─── STYLISTS TAB ─── */}
                {activeTab === "stylists" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Our Stylists</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Our team of experienced professionals is dedicated to making you look and feel your best.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "Priya Sharma", role: "Senior Hair Stylist", experience: "8 years", speciality: "Balayage & Color", clients: "2,400+" },
                        { name: "Rahul Desai", role: "Creative Director", experience: "12 years", speciality: "Precision Cuts", clients: "4,200+" },
                        { name: "Sneha Patel", role: "Skin Specialist", experience: "6 years", speciality: "Hydra Facials", clients: "1,800+" },
                        { name: "Ananya Mehta", role: "Makeup Artist", experience: "10 years", speciality: "Bridal Makeup", clients: "3,100+" },
                        { name: "Vikram Joshi", role: "Hair Stylist", experience: "5 years", speciality: "Keratin & Smoothening", clients: "1,500+" },
                        { name: "Divya Nair", role: "Nail Artist", experience: "4 years", speciality: "Gel Extensions & Art", clients: "1,200+" },
                      ].map((stylist) => (
                        <div key={stylist.name} className="group flex items-start gap-4 p-5 rounded-xl bg-card hover:shadow-md boty-transition">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <span className="text-base font-semibold text-primary">
                              {stylist.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground mb-0.5">{stylist.name}</h4>
                            <p className="text-xs text-primary font-medium mb-2">{stylist.role}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                              <span>{stylist.experience} experience</span>
                              <span>{stylist.clients} clients served</span>
                            </div>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                                {stylist.speciality}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── REVIEWS TAB ─── */}
                {activeTab === "reviews" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <Star className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Customer Reviews</h2>
                    </div>

                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 p-5 rounded-xl bg-card mb-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{salon.rating}</p>
                        <div className="flex gap-0.5 justify-center mt-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(salon.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{salon.reviews.toLocaleString()} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[
                          { label: "Ambience", value: 98 },
                          { label: "Service Quality", value: 96 },
                          { label: "Hygiene", value: 99 },
                          { label: "Value for Money", value: 92 },
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center gap-3">
                            <span className="text-[11px] text-muted-foreground w-24">{metric.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${metric.value}%` }} />
                            </div>
                            <span className="text-[11px] text-foreground font-medium w-8 text-right">{metric.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Cards */}
                    <div className="space-y-4">
                      {[
                        { name: "Meera K.", rating: 5, date: "2 weeks ago", service: "Balayage", text: "Absolutely stunning salon! The ambience is unlike anything in Navi Mumbai. Got a balayage done by Priya and it turned out perfect. The maroon and green interiors make you feel so relaxed." },
                        { name: "Rohit S.", rating: 5, date: "1 month ago", service: "Haircut", text: "Best haircut experience I've had. The double-height mirrors and crystal chandelier really elevate the vibe. Rahul understood exactly what I wanted." },
                        { name: "Anita D.", rating: 4, date: "1 month ago", service: "Bridal Trial", text: "Came for a bridal trial and was blown away by the makeup room on the first floor. Ananya is incredibly talented. The skin room is so calming — will definitely return for facials." },
                        { name: "Prachi V.", rating: 5, date: "3 weeks ago", service: "Spa Pedicure", text: "The pedicure station is so luxurious! Love the green walls and murals. Staff is professional and hygienic. Complimentary chai was a nice touch." },
                        { name: "Kavita R.", rating: 5, date: "1 week ago", service: "Hydra Facial", text: "Sneha really knows her stuff. My skin felt amazing after the hydra facial. The skin room with tropical wallpaper is so peaceful, felt like a mini vacation." },
                        { name: "Arjun M.", rating: 5, date: "5 days ago", service: "Keratin Treatment", text: "Got keratin done by Vikram. Excellent results — my hair has never been this smooth. Love that they use premium products. Will definitely be a regular." },
                      ].map((review) => (
                        <div key={review.name + review.date} className="p-5 rounded-xl bg-card">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">{review.name[0]}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{review.name}</p>
                                <p className="text-[11px] text-muted-foreground">{review.date} • {review.service}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── GALLERY TAB ─── */}
                {activeTab === "gallery" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Gallery</h2>
                    </div>

                    {/* Main Image */}
                    <div className="relative rounded-2xl overflow-hidden mb-4">
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={salon.galleryImages[activeGalleryIndex].src}
                          alt={salon.galleryImages[activeGalleryIndex].alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-sm text-white/90 font-medium">
                          {salon.galleryImages[activeGalleryIndex].caption}
                        </p>
                        <p className="text-[11px] text-white/60 mt-1">
                          {activeGalleryIndex + 1} of {salon.galleryImages.length}
                        </p>
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {salon.galleryImages.map((img, index) => (
                        <button
                          key={img.src}
                          type="button"
                          onClick={() => setActiveGalleryIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden boty-transition ${
                            index === activeGalleryIndex
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={img.src} alt={img.alt} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── OFFERS TAB ─── */}
                {activeTab === "offers" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <Tag className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Offers & Packages</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Bridal Glow Package",
                          description: "Complete bridal prep — facial, hair spa, mani-pedi, and trial makeup",
                          originalPrice: "₹24,999",
                          offerPrice: "₹18,999",
                          badge: "Save 24%",
                          validity: "Valid till Dec 2026",
                        },
                        {
                          title: "First Visit Special",
                          description: "20% off on any single service for first-time customers",
                          originalPrice: null,
                          offerPrice: "20% OFF",
                          badge: "New Customer",
                          validity: "No expiry",
                        },
                        {
                          title: "Hair Transformation",
                          description: "Global color + keratin treatment + hair spa combo",
                          originalPrice: "₹12,499",
                          offerPrice: "₹8,999",
                          badge: "Popular",
                          validity: "Valid till Sep 2026",
                        },
                        {
                          title: "Weekend Pamper",
                          description: "Hydra facial + spa pedicure + head massage — every Saturday",
                          originalPrice: "₹5,499",
                          offerPrice: "₹3,999",
                          badge: "Weekends",
                          validity: "Saturdays only",
                        },
                        {
                          title: "Loyalty Rewards",
                          description: "Every 5th visit — get a complimentary hair spa or basic facial",
                          originalPrice: null,
                          offerPrice: "FREE",
                          badge: "Members",
                          validity: "Ongoing",
                        },
                        {
                          title: "Couple's Package",
                          description: "His & hers haircut + styling + head massage combo",
                          originalPrice: "₹2,998",
                          offerPrice: "₹1,999",
                          badge: "Save 33%",
                          validity: "Valid till Oct 2026",
                        },
                      ].map((offer) => (
                        <div key={offer.title} className="relative p-5 rounded-xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-sm boty-transition">
                          <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary">
                            {offer.badge}
                          </span>
                          <h4 className="font-medium text-foreground text-sm mb-1.5 pr-20">{offer.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{offer.description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-foreground">{offer.offerPrice}</span>
                            {offer.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">{offer.originalPrice}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{offer.validity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── PRODUCTS TAB ─── */}
                {activeTab === "products" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <Package className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Products We Use</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      We use only premium, salon-grade products for all our treatments. Each brand is carefully selected for quality, performance, and results.
                    </p>
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
                        <div key={product.name} className="flex items-start gap-4 p-4 rounded-xl bg-card">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-foreground/50">{product.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground">{product.name}</h4>
                            <p className="text-[11px] text-primary font-medium mb-1">{product.category}</p>
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
                    <div className="flex items-center gap-3 mb-6">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h2 className="font-serif text-xl sm:text-2xl text-foreground">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { q: "Do I need to book an appointment in advance?", a: "Walk-ins are welcome, but we recommend booking in advance especially on weekends and for bridal services to ensure availability of your preferred stylist." },
                        { q: "What safety and hygiene measures are followed?", a: "All tools are sterilized after each use. We maintain sanitized workstations, disposable capes and towels for certain services, and regular deep-cleaning of the entire salon." },
                        { q: "Is parking available?", a: "Yes, we have dedicated parking space for our customers right outside the salon premises. Two-wheeler and four-wheeler parking available." },
                        { q: "What is the cancellation policy?", a: "Free cancellation up to 4 hours before your appointment. Cancellations within 4 hours may be charged 25% of the service fee." },
                        { q: "Do you offer bridal packages?", a: "Yes! We offer comprehensive bridal packages including trial sessions, pre-wedding skin prep, and day-of bridal makeup. Contact us for a custom package tailored to your needs." },
                        { q: "Are your products cruelty-free?", a: "We prioritize brands that are cruelty-free and ethically sourced. Most of our product partners follow sustainable and cruelty-free practices." },
                        { q: "What payment methods do you accept?", a: "We accept cash, all major credit/debit cards, UPI (GPay, PhonePe, Paytm), and bank transfers. EMI options available for packages above ₹5,000." },
                        { q: "How do I earn loyalty points?", a: "Every ₹100 spent earns you 5 loyalty points. Accumulate 500 points and redeem them for a free service of your choice from our starter menu." },
                      ].map((faq, index) => (
                        <details key={index} className="group rounded-xl bg-card overflow-hidden border border-transparent hover:border-border/30 boty-transition">
                          <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                            <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 boty-transition" />
                          </summary>
                          <div className="px-5 pb-5 -mt-1">
                            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                          </div>
                        </details>
                      ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/10 text-center">
                      <p className="text-sm text-foreground mb-2">Still have questions?</p>
                      <p className="text-xs text-muted-foreground mb-4">Our team is happy to help with any queries.</p>
                      <a
                        href={`tel:${salon.phone}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium boty-transition hover:bg-primary/90"
                      >
                        <Phone className="w-4 h-4" />
                        Call Us
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-36 space-y-6">
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
                      <a href={`tel:${salon.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition">
                        <Phone className="w-4 h-4 text-primary" />
                        {salon.phone}
                      </a>
                      <a href={`mailto:${salon.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition">
                        <Mail className="w-4 h-4 text-primary" />
                        {salon.email}
                      </a>
                      <a href={salon.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition">
                        <Globe className="w-4 h-4 text-primary" />
                        Website
                      </a>
                      <a href={salon.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground boty-transition">
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
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(salon.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
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
                            <div className="h-full rounded-full bg-primary" style={{ width: `${metric.value}%` }} />
                          </div>
                          <span className="text-[11px] text-foreground font-medium w-8 text-right">{metric.value}%</span>
                        </div>
                      ))}
                    </div>
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
