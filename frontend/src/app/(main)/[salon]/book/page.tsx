"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Calendar,
  User,
  Scissors,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Phone,
  Info,
  Check,
  CreditCard,
} from "lucide-react"
import { type SalonService } from "@/data/salons"
import { useSalon } from "@/lib/useSalon"

// Default static stylists backup
const defaultStylists = [
  { id: "1", name: "Priya Sharma", specialty: "Hair & Color", rating: 4.9, image: "/placeholder-user.jpg" },
  { id: "2", name: "Rahul Verma", specialty: "Hair Styling", rating: 4.8, image: "/placeholder-user.jpg" },
  { id: "3", name: "Anita Desai", specialty: "Skin & Facial", rating: 4.9, image: "/placeholder-user.jpg" },
  { id: "4", name: "Meera Patel", specialty: "Makeup & Nails", rating: 4.7, image: "/placeholder-user.jpg" },
  { id: "5", name: "Vikram Singh", specialty: "Hair & Beard", rating: 4.8, image: "/placeholder-user.jpg" },
]

// Time slots
const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
]

const steps = [
  { id: 1, label: "Services", icon: Scissors },
  { id: 2, label: "Date & Time", icon: Calendar },
  { id: 3, label: "Stylist", icon: User },
  { id: 4, label: "Confirm", icon: CheckCircle2 },
]

export default function BookNowPage() {
  const params = useParams()
  const idOrSlug = params.salon as string
  const { salon, isLoading } = useSalon(idOrSlug)

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<SalonService[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isBooked, setIsBooked] = useState(false)

  // Generate next 14 days for date selection
  const availableDates = useMemo(() => {
    const dates: Date[] = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [])

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, service) => {
      const numericPrice = parseInt(service.price.replace(/[₹,]/g, ""))
      return sum + numericPrice
    }, 0)
  }, [selectedServices])

  const totalDuration = useMemo(() => {
    let totalMinutes = 0
    selectedServices.forEach((service) => {
      const durationStr = service.duration
      if (durationStr.includes("hr")) {
        const hrs = parseFloat(durationStr)
        totalMinutes += hrs * 60
      } else {
        totalMinutes += parseInt(durationStr)
      }
    })
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hr`
    return `${hours} hr ${mins} min`
  }, [selectedServices])

  const toggleService = (service: SalonService) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.name === service.name)
      if (exists) return prev.filter((s) => s.name !== service.name)
      return [...prev, service]
    })
  }

  const isServiceSelected = (service: SalonService) => {
    return selectedServices.some((s) => s.name === service.name)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedServices.length > 0
      case 2: return selectedDate !== null && selectedTime !== null
      case 3: return selectedStylist !== null
      case 4: return customerName.trim() !== "" && customerPhone.trim() !== ""
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
    else handleBooking()
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleBooking = () => {
    setIsBooked(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-IN", { weekday: "short" })
  }

  const getDayNumber = (date: Date) => {
    return date.getDate()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Loading booking options...</p>
        </div>
      </main>
    )
  }

  if (!salon) {
    return (
      <main className="min-h-screen">
        <div className="pt-28 pb-20 text-center max-w-7xl mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-3">Salon not found</h1>
          <p className="text-muted-foreground mb-8">The salon you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/salons" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm">
            <ChevronLeft className="w-4 h-4" /> Browse Salons
          </Link>
        </div>
      </main>
    )
  }

  // Use DB stylists if available, fallback to mock stylists
  const stylists = ((salon.stylists && salon.stylists.length > 0)
    ? salon.stylists
    : defaultStylists) as any[];

  const serviceCategories = ["All", ...Array.from(new Set(salon.services.map((s) => s.category)))]
  const filteredServices = activeCategory === "All"
    ? salon.services
    : salon.services.filter((s) => s.category === activeCategory)

  // Booking Success Screen
  if (isBooked) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your appointment has been successfully booked. We&apos;ve sent a confirmation to your phone.
            </p>

            <div className="bg-card/70 border border-border/20 rounded-3xl p-6 sm:p-8 text-left mb-8 boty-shadow">
              <h3 className="font-serif text-xl text-foreground mb-5">Booking Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Salon</span>
                  <span className="font-medium text-foreground">{salon.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Stylist</span>
                  <span className="font-medium text-foreground">
                    {selectedStylist === "any"
                      ? "Any Available Stylist"
                      : stylists.find((s) => s.id === selectedStylist)?.name || "Selected Stylist"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium text-foreground text-right">
                    {selectedServices.map((s) => s.name).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-serif text-xl text-primary font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${idOrSlug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium boty-transition hover:bg-primary/90"
              >
                Back to Salon
              </Link>
              <Link
                href="/salons"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium text-foreground boty-transition hover:bg-card"
              >
                Explore More Salons
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">

      <div className="pt-20 sm:pt-24 md:pt-28 pb-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href={`/${idOrSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary boty-transition mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 boty-transition" />
            Back to Salon
          </Link>

          {/* Page Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-2">
              Book Your Appointment
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {salon.name} · {salon.location}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center boty-transition ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isActive
                            ? "bg-primary text-primary-foreground boty-shadow"
                            : "bg-card border border-border/40 text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                          isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] mx-2 sm:mx-4 rounded-full mt-[-18px] ${
                          currentStep > step.id ? "bg-primary" : "bg-border/50"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-foreground mb-2">Choose Your Services</h2>
                    <p className="text-muted-foreground text-sm">Select one or more services for your appointment</p>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
                    {serviceCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap boty-transition ${
                          activeCategory === category
                            ? "bg-primary text-primary-foreground font-medium"
                            : "bg-card text-muted-foreground hover:text-foreground border border-border/30"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Service List Container */}
                  <div className="rounded-2xl border border-border/20 overflow-hidden bg-card/30">
                    <div className="max-h-[420px] sm:max-h-[480px] overflow-y-auto scrollbar-thin">
                      {filteredServices.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground text-center">No services found in this category.</p>
                      ) : (
                        filteredServices.map((service, index) => {
                          const selected = isServiceSelected(service)
                          return (
                            <button
                              key={service.name}
                              type="button"
                              onClick={() => toggleService(service)}
                              className={`w-full flex items-center gap-3 sm:gap-4 py-4 sm:py-5 px-4 sm:px-5 text-left boty-transition ${
                                index !== filteredServices.length - 1 ? "border-b border-border/15" : ""
                              } ${selected ? "bg-primary/5" : "hover:bg-card/80"}`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 boty-transition ${
                                  selected ? "border-primary bg-primary" : "border-border"
                                }`}
                              >
                                {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
                                  {service.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />{service.duration}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-xs text-primary/70 font-medium">{service.category}</span>
                                </div>
                              </div>
                              <span className="font-bold text-foreground text-sm sm:text-base flex-shrink-0">
                                {service.price}
                              </span>
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {filteredServices.length > 7 && (
                    <p className="text-[11px] text-muted-foreground/60 mt-3 text-center">↕ Scroll to see all {filteredServices.length} services</p>
                  )}
                </div>
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-foreground mb-2">Pick a Date & Time</h2>
                    <p className="text-muted-foreground text-sm">Choose your preferred appointment slot</p>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date
                    </h3>
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-3">
                      {availableDates.map((date) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString()
                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[72px] py-3 sm:py-4 px-3 sm:px-4 rounded-2xl boty-transition ${
                              isSelected
                                ? "bg-primary text-primary-foreground boty-shadow"
                                : "bg-card/70 border border-border/20 text-foreground hover:border-primary/30"
                            }`}
                          >
                            <span className={`text-[10px] sm:text-xs uppercase font-medium ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {getDayName(date)}
                            </span>
                            <span className="text-lg sm:text-xl font-semibold mt-0.5">
                              {getDayNumber(date)}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm font-medium boty-transition ${
                              isSelected
                                ? "bg-primary text-primary-foreground boty-shadow"
                                : "bg-card/70 border border-border/20 text-foreground hover:border-primary/30"
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Stylist Selection */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-foreground mb-2">Choose Your Stylist</h2>
                    <p className="text-muted-foreground text-sm">Select a stylist or let us assign the best available</p>
                  </div>

                  {/* Any Stylist Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedStylist("any")}
                    className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl mb-3 boty-transition ${
                      selectedStylist === "any"
                        ? "bg-primary/5 border-2 border-primary/30 boty-shadow"
                        : "bg-card/70 border border-border/20 hover:border-primary/20"
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">Any Available Stylist</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">We&apos;ll assign the best stylist for your services</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto flex-shrink-0 ${
                      selectedStylist === "any" ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {selectedStylist === "any" && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>

                  {/* Individual Stylists */}
                  <div className="space-y-3">
                    {stylists.map((stylist) => {
                      const isSelected = selectedStylist === stylist.id
                      return (
                        <button
                          key={stylist.id}
                          type="button"
                          onClick={() => setSelectedStylist(stylist.id)}
                          className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl boty-transition ${
                            isSelected
                              ? "bg-primary/5 border-2 border-primary/30 boty-shadow"
                              : "bg-card/70 border border-border/20 hover:border-primary/20"
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                            {stylist.image || stylist.photo ? (
                              <Image
                                src={stylist.image || stylist.photo || "/placeholder-user.jpg"}
                                alt={stylist.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-base font-bold text-primary">{stylist.name.split(" ").map((n: string) => n[0]).join("")}</span>
                            )}
                          </div>
                          <div className="text-left min-w-0">
                            <h3 className="font-medium text-foreground">{stylist.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{stylist.specialty || stylist.role}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-accent text-accent" />
                              <span className="text-xs text-muted-foreground">{stylist.rating}</span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation & Contact */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-foreground mb-2">Confirm Your Details</h2>
                    <p className="text-muted-foreground text-sm">Fill in your contact information to complete the booking</p>
                  </div>

                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl bg-card/70 border border-border/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                        Phone Number <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-card/70 border border-border/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email (optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-card/70 border border-border/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition"
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label htmlFor="requests" className="block text-sm font-medium text-foreground mb-1.5">
                        Special Requests (optional)
                      </label>
                      <textarea
                        id="requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special preferences or notes for your stylist..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-card/70 border border-border/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 boty-transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/10">
                      <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">Secure booking</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/10">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">Pay at salon</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/10">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">Free cancellation</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                {/* Salon Info Card */}
                <div className="bg-card/70 border border-border/20 rounded-3xl p-5 sm:p-6 boty-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={salon.heroImage}
                        alt={salon.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">{salon.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{salon.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span>{salon.rating} ({salon.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card/70 border border-border/20 rounded-3xl p-5 sm:p-6 boty-shadow">
                  <h3 className="font-serif text-lg text-foreground mb-4">Booking Summary</h3>

                  {selectedServices.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedServices.map((service) => (
                        <div key={service.name} className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-sm text-foreground truncate">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.duration}</p>
                          </div>
                          <span className="text-sm font-medium text-foreground flex-shrink-0">{service.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">No services selected yet</p>
                  )}

                  {selectedServices.length > 0 && (
                    <>
                      <div className="border-t border-border/30 pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="text-sm font-medium text-foreground">{totalDuration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">Total</span>
                          <span className="font-serif text-lg text-primary font-semibold">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Date & Time Summary */}
                  {selectedDate && (
                    <div className="border-t border-border/30 pt-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground">{formatDate(selectedDate)}</span>
                        {selectedTime && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-foreground">{selectedTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stylist Summary */}
                  {selectedStylist && (
                    <div className="border-t border-border/30 pt-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground">
                          {selectedStylist === "any"
                            ? "Any Available Stylist"
                            : stylists.find((s) => s.id === selectedStylist)?.name || "Selected Stylist"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Policies Info */}
                <div className="bg-card/70 border border-border/20 rounded-3xl p-5 sm:p-6">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Good to Know
                  </h4>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Free cancellation up to 4 hours before your appointment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Payment accepted at the salon (cash, card, UPI)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Please arrive 5 minutes before your scheduled time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Confirmation SMS will be sent to your phone</span>
                    </li>
                  </ul>
                </div>

                {/* Desktop Navigation Buttons */}
                <div className="hidden sm:flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-full text-sm font-medium text-foreground boty-transition hover:bg-card"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium boty-transition ${
                      canProceed()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 boty-shadow"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {currentStep === 4 ? "Confirm Booking" : "Continue"}
                    {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-background/95 backdrop-blur-xl border-t border-border/30 p-4 z-50">
        <div className="flex items-center justify-between gap-3">
          {selectedServices.length > 0 && (
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-serif text-lg text-primary font-semibold">₹{totalPrice.toLocaleString()}</p>
            </div>
          )}
          <div className="flex gap-2 flex-shrink-0">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-full text-foreground boty-transition"
                aria-label="Go back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium boty-transition ${
                canProceed()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {currentStep === 4 ? "Confirm" : "Next"}
              {currentStep < 4 && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
