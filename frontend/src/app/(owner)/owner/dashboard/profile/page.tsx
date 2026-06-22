"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/components/boty/auth-context"
import { apiFetch } from "@/lib/api"
import {
  Store, Check, ShieldCheck, Plus, X, Phone, Mail, Globe, MapPin,
  Sparkles, Wifi, Coffee, Clock, Instagram, Star, Camera, Upload,
  Calendar, ImagePlus, Trash2, GripVertical, ChevronDown, ChevronUp,
  MessageCircle, Tag, Package, HelpCircle, FileText, Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// ─── Types ───────────────────────────────────────────────────────
interface HygieneChecklist {
  autoclave: boolean
  freshTowels: boolean
  licensedStaff: boolean
  disposableKits: boolean
  sanitization: boolean
  airPurification: boolean
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
}

interface Offer {
  id: string
  title: string
  description: string
  originalPrice: string
  offerPrice: string
  badge: string
  validity: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Product {
  id: string
  name: string
  category: string
  description: string
}

// ─── Default Data ────────────────────────────────────────────────
const defaultProfile = {
  name: "Radiance Beauty Studio",
  username: "radiance_beauty",
  tagline: "Where beauty meets care, every day",
  description: "A premium salon specialising in hair, skin, and wellness services with over 8 years of trusted excellence in Mumbai.",
  phone: "+91 98765 43210",
  email: "hello@radiancebeauty.in",
  website: "https://radiancebeauty.in",
  instagram: "https://instagram.com/radiancebeauty",
  fullAddress: "12, Linking Road, Bandra West, Mumbai — 400050",
  city: "Mumbai",
  liveStatus: "available" as const,
  priceGuarantee: true,
  heroImage: "/hero/Hero.svg",
  hygiene: {
    autoclave: true, freshTowels: true, licensedStaff: true,
    disposableKits: true, sanitization: true, airPurification: false,
  } as HygieneChecklist,
  highlights: [
    "8+ years of premium service excellence",
    "Trained professionals, certified stylists",
    "Sourced from organic, cruelty-free brands",
  ],
  amenities: ["Free WiFi", "Complimentary Beverages", "Air Conditioned"],
  openingHours: {
    Monday: "10:00 AM – 8:00 PM",
    Tuesday: "10:00 AM – 8:00 PM",
    Wednesday: "10:00 AM – 8:00 PM",
    Thursday: "10:00 AM – 8:00 PM",
    Friday: "10:00 AM – 9:00 PM",
    Saturday: "9:00 AM – 9:00 PM",
    Sunday: "10:00 AM – 6:00 PM",
  } as Record<string, string>,
  gallery: [
    { id: "1", src: "/images/salons/akreations.jpg", alt: "Salon Interior", caption: "Our premium styling area" },
    { id: "2", src: "/images/salons/enrich-salon.jpg", alt: "Salon Exterior", caption: "Welcome to our studio" },
  ] as GalleryImage[],
  offers: [
    { id: "1", title: "Bridal Glow Package", description: "Complete bridal prep — facial, hair spa, mani-pedi, and trial makeup", originalPrice: "₹24,999", offerPrice: "₹18,999", badge: "Save 24%", validity: "Valid till Dec 2026" },
    { id: "2", title: "First Visit Special", description: "20% off on any single service for first-time customers", originalPrice: "", offerPrice: "20% OFF", badge: "New Customer", validity: "No expiry" },
  ] as Offer[],
  faqs: [
    { id: "1", question: "Do I need to book an appointment in advance?", answer: "Walk-ins are welcome, but we recommend booking in advance especially on weekends." },
    { id: "2", question: "What is the cancellation policy?", answer: "Free cancellation up to 4 hours before your appointment." },
  ] as FAQ[],
  products: [
    { id: "1", name: "L'Oréal Professionnel", category: "Hair Color & Care", description: "Professional-grade hair color and care." },
    { id: "2", name: "Dermalogica", category: "Skin Care", description: "Professional skin care backed by innovation." },
  ] as Product[],
}

const hygieneLabels: Record<keyof HygieneChecklist, string> = {
  autoclave: "Autoclave Sterilization",
  freshTowels: "Fresh Towels Every Client",
  licensedStaff: "Licensed & Certified Staff",
  disposableKits: "Disposable Kits",
  sanitization: "Regular Sanitization",
  airPurification: "Air Purification",
}

const liveStatusOptions = [
  { value: "available", label: "Walk-in Available", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  { value: "short-wait", label: "Short Wait (10m)", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  { value: "busy", label: "Busy (30m+ Wait)", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  { value: "fully-booked", label: "Fully Booked Today", color: "bg-red-500/10 text-red-700 border-red-500/20" },
]

type TabId = "info" | "media" | "hygiene" | "highlights" | "hours" | "offers" | "products" | "faqs"

const tabs: { id: TabId; label: string; icon: typeof Store }[] = [
  { id: "info", label: "Basic Info", icon: FileText },
  { id: "media", label: "Images", icon: Camera },
  { id: "hygiene", label: "Hygiene", icon: ShieldCheck },
  { id: "highlights", label: "Highlights", icon: Sparkles },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "products", label: "Products", icon: Package },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
]

// ─── Component ───────────────────────────────────────────────────
export default function SalonProfilePage() {
  const { user } = useAuth()
  const [salonId, setSalonId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [profile, setProfile] = useState(defaultProfile)
  const [saved, setSaved] = useState(false)
  const [newHighlight, setNewHighlight] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [activeTab, setActiveTab] = useState<TabId>("info")
  const heroInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [isCheckingDashUsername, setIsCheckingDashUsername] = useState(false)
  const [dashUsernameFeedback, setDashUsernameFeedback] = useState<{ available: boolean; reason?: string } | null>(null)

  const checkDashboardUsername = async (val: string) => {
    if (!val || val.length < 3) {
      setDashUsernameFeedback({ available: false, reason: "Username must be at least 3 characters." })
      return
    }
    setIsCheckingDashUsername(true)
    try {
      const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
      const API_URL = RAW_API_URL.endsWith("/api/v1") ? RAW_API_URL : RAW_API_URL.replace(/\/+$/, "") + "/api/v1"
      const res = await fetch(`${API_URL}/public/username-availability?username=${val}&excludeSalonId=${salonId || ""}`)
      if (res.ok) {
        const json = await res.json()
        if (json.status === "success") {
          setDashUsernameFeedback(json.data)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsCheckingDashUsername(false)
    }
  }

  // Offer state
  const [newOffer, setNewOffer] = useState<Omit<Offer, "id">>({ title: "", description: "", originalPrice: "", offerPrice: "", badge: "", validity: "" })
  // FAQ state
  const [newFaq, setNewFaq] = useState<Omit<FAQ, "id">>({ question: "", answer: "" })
  // Product state
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({ name: "", category: "", description: "" })

  useEffect(() => {
    async function loadSalon() {
      if (!user) return
      setIsLoading(true)
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) return

        let sId = user.salonId
        if (!sId) {
          const res: any = await apiFetch("/owner/salons", {
            headers: { Authorization: `Bearer ${token}` }
          })
          const salons = res?.data || []
          if (salons.length > 0) {
            sId = salons[0].id
          }
        }

        if (sId) {
          setSalonId(sId)
          const salonRes: any = await apiFetch(`/owner/${sId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const s = salonRes?.data
          if (s) {
            setProfile({
              name: s.name || "",
              username: s.username || "",
              tagline: s.tagline || "",
              description: s.description || "",
              phone: s.phone || "",
              email: s.email || "",
              website: s.website || "",
              instagram: s.instagram || "",
              fullAddress: s.full_address || "",
              city: s.city || "",
              liveStatus: s.live_status || "available",
              priceGuarantee: !!s.price_guarantee,
              heroImage: s.hero_image || "/hero/Hero.svg",
              hygiene: {
                autoclave: !!s.hc_autoclave,
                freshTowels: !!s.hc_fresh_towels,
                licensedStaff: !!s.hc_licensed_staff,
                disposableKits: !!s.hc_disposable_kits,
                sanitization: !!s.hc_sanitization,
                airPurification: !!s.hc_air_purification,
              },
              highlights: Array.isArray(s.highlights) ? s.highlights : [],
              amenities: Array.isArray(s.amenities) ? s.amenities : [],
              openingHours: s.opening_hours || defaultProfile.openingHours,
              gallery: Array.isArray(s.gallery) && s.gallery.length > 0
                ? s.gallery.map((img: GalleryImage) => {
                    if (img.src === "/hero/salon-interior.svg") {
                      return { ...img, src: "/images/salons/akreations.jpg" };
                    }
                    if (img.src === "/hero/salon-exterior.svg") {
                      return { ...img, src: "/images/salons/enrich-salon.jpg" };
                    }
                    return img;
                  })
                : [
                    { id: "1", src: "/images/salons/akreations.jpg", alt: "Salon Interior", caption: "Our premium styling area" },
                    { id: "2", src: "/images/salons/enrich-salon.jpg", alt: "Salon Exterior", caption: "Welcome to our studio" },
                  ],
              offers: Array.isArray(s.offers) ? s.offers : [],
              products: Array.isArray(s.products) ? s.products : [],
              faqs: Array.isArray(s.faqs) ? s.faqs : [],
            })
          }
        }
      } catch (err: any) {
        console.error("Failed to load salon:", err)
        setErrorMsg("Failed to load salon profile details.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSalon()
  }, [user])

  const handleSave = async () => {
    setErrorMsg("")
    setIsSaving(true)
    setSaved(false)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) throw new Error("No authentication token found.")

      let sId = salonId
      if (!sId) {
        const cachedUsername = typeof window !== "undefined" ? localStorage.getItem("citysalon_temp_register_username") : ""
        const createRes: any = await apiFetch("/owner/salons", {
          method: "POST",
          bodyData: {
            name: profile.name || "Untitled Salon",
            city: profile.city || "",
            full_address: profile.fullAddress || "",
            username: profile.username || cachedUsername || undefined,
          },
          headers: { Authorization: `Bearer ${token}` }
        })
        const createdSalon = createRes?.data
        if (!createdSalon?.id) throw new Error("Failed to create salon record.")
        sId = createdSalon.id
        setSalonId(sId)
      }

      // Upload base64 hero image if new
      let finalHeroImage = profile.heroImage
      if (profile.heroImage && profile.heroImage.startsWith("data:image/")) {
        const mimeType = profile.heroImage.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/jpeg"
        const ext = mimeType.split("/")[1] || "jpg"
        const filename = `hero_${Date.now()}.${ext}`

        const uploadRes: any = await apiFetch("/owner/upload", {
          method: "POST",
          bodyData: {
            filename,
            contentType: mimeType,
            base64Data: profile.heroImage,
          },
          headers: { Authorization: `Bearer ${token}` }
        })
        const uploadedUrl = uploadRes?.data?.url
        if (!uploadedUrl) throw new Error("Failed to upload hero image to storage.")
        finalHeroImage = uploadedUrl
      }

      // Upload new gallery base64 images
      const finalGallery: GalleryImage[] = []
      for (const img of profile.gallery) {
        if (img.src.startsWith("data:image/")) {
          const mimeType = img.src.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/jpeg"
          const ext = mimeType.split("/")[1] || "jpg"
          const filename = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`

          const uploadRes: any = await apiFetch("/owner/upload", {
            method: "POST",
            bodyData: {
              filename,
              contentType: mimeType,
              base64Data: img.src,
            },
            headers: { Authorization: `Bearer ${token}` }
          })
          const uploadedUrl = uploadRes?.data?.url
          if (!uploadedUrl) throw new Error(`Failed to upload gallery image "${img.alt}" to storage.`)
          finalGallery.push({
            ...img,
            src: uploadedUrl,
          })
        } else {
          finalGallery.push(img)
        }
      }

      const patchData = {
        name: profile.name,
        username: profile.username,
        tagline: profile.tagline,
        description: profile.description,
        phone: profile.phone,
        email: profile.email,
        website: profile.website,
        instagram: profile.instagram,
        full_address: profile.fullAddress,
        city: profile.city,
        live_status: profile.liveStatus,
        price_guarantee: profile.priceGuarantee,
        hero_image: finalHeroImage,
        hc_autoclave: profile.hygiene.autoclave,
        hc_fresh_towels: profile.hygiene.freshTowels,
        hc_licensed_staff: profile.hygiene.licensedStaff,
        hc_disposable_kits: profile.hygiene.disposableKits,
        hc_sanitization: profile.hygiene.sanitization,
        hc_air_purification: profile.hygiene.airPurification,
        highlights: profile.highlights,
        amenities: profile.amenities,
        opening_hours: profile.openingHours,
        gallery: finalGallery,
        offers: profile.offers,
        products: profile.products,
        faqs: profile.faqs,
      }

      await apiFetch(`/owner/${sId}`, {
        method: "PATCH",
        bodyData: patchData,
        headers: { Authorization: `Bearer ${token}` }
      })

      // Sync state back to finalized URLs
      setProfile((prev) => ({
        ...prev,
        heroImage: finalHeroImage,
        gallery: finalGallery,
      }))

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error("Save failed:", err)
      setErrorMsg(err.message || "Failed to save salon profile.")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleHygiene = (key: keyof HygieneChecklist) => {
    setProfile((prev) => ({ ...prev, hygiene: { ...prev.hygiene, [key]: !prev.hygiene[key] } }))
  }

  const addHighlight = () => {
    if (!newHighlight.trim()) return
    setProfile((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }))
    setNewHighlight("")
  }
  const removeHighlight = (i: number) => setProfile((prev) => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }))

  const addAmenity = () => {
    if (!newAmenity.trim()) return
    setProfile((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }))
    setNewAmenity("")
  }
  const removeAmenity = (i: number) => setProfile((prev) => ({ ...prev, amenities: prev.amenities.filter((_, idx) => idx !== i) }))

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result as string
      setProfile((prev) => ({ ...prev, heroImage: base64Data }))
    }
    reader.readAsDataURL(file)
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: GalleryImage[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        newImages.push({
          id: "temp-" + Date.now() + "-" + i,
          src: base64Data,
          alt: file.name,
          caption: "",
        })
      }
      setProfile((prev) => ({ ...prev, gallery: [...prev.gallery, ...newImages] }))
    } catch (err) {
      console.error("Gallery preview failed:", err)
    }
  }

  const removeGalleryImage = (id: string) => setProfile((prev) => ({ ...prev, gallery: prev.gallery.filter((img) => img.id !== id) }))

  const addOffer = () => {
    if (!newOffer.title.trim() || !newOffer.offerPrice.trim()) return
    setProfile((prev) => ({ ...prev, offers: [...prev.offers, { ...newOffer, id: Date.now().toString() }] }))
    setNewOffer({ title: "", description: "", originalPrice: "", offerPrice: "", badge: "", validity: "" })
  }
  const removeOffer = (id: string) => setProfile((prev) => ({ ...prev, offers: prev.offers.filter((o) => o.id !== id) }))

  const addFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return
    setProfile((prev) => ({ ...prev, faqs: [...prev.faqs, { ...newFaq, id: Date.now().toString() }] }))
    setNewFaq({ question: "", answer: "" })
  }
  const removeFaq = (id: string) => setProfile((prev) => ({ ...prev, faqs: prev.faqs.filter((f) => f.id !== id) }))

  const addProduct = () => {
    if (!newProduct.name.trim()) return
    setProfile((prev) => ({ ...prev, products: [...prev.products, { ...newProduct, id: Date.now().toString() }] }))
    setNewProduct({ name: "", category: "", description: "" })
  }
  const removeProduct = (id: string) => setProfile((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))

  const activeStatus = liveStatusOptions.find(o => o.value === profile.liveStatus) || liveStatusOptions[0]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-[#3D5A3A] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#6E6960] font-sans font-medium">Loading salon profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 animate-blur-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-5">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Salon Profile</h1>
          <p className="text-sm font-sans text-[#6E6960] mt-1.5 font-medium">Edit every section of your public booking page — changes preview live on the right</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`rounded-xl px-6 py-2.5 h-10 gap-2 font-bold font-sans text-xs tracking-wider uppercase shadow-md transition-all duration-300 cursor-pointer ${
            saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#3D5A3A] hover:bg-[#2B3F29]"
          } text-white border-none disabled:opacity-60`}
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 text-[#C4A76C]" /> Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-700 uppercase tracking-wider font-sans">
          Error: {errorMsg}
        </div>
      )}

      {/* Live Status Controller */}
      <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3D5A3A]/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-[#3D5A3A]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A] font-sans">Live Occupancy Status</p>
            <p className="text-xs text-[#6E6960] font-sans">Broadcast wait-times to clients on your booking page</p>
          </div>
        </div>
        <Select value={profile.liveStatus} onValueChange={(v) => setProfile((p) => ({ ...p, liveStatus: v as typeof p.liveStatus }))}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-[#E2D9CE] bg-white text-xs font-semibold h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {liveStatusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid: Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* Editor Column */}
        <div className="xl:col-span-3 space-y-5">

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide bg-[#E8E0D6]/30 rounded-xl p-1.5 border border-[#E2D9CE]/40">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-[#3D5A3A] text-[#FAFAF7] shadow-md"
                    : "text-[#6E6960] hover:text-[#3D5A3A] hover:bg-white/60"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── Tab: Basic Info ─── */}
          {activeTab === "info" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Salon Name *</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Username (Custom Profile Link) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6E6960]/60 font-semibold select-none font-sans">citysalon.com/</span>
                    <input type="text" value={profile.username || ""} 
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                        setProfile((p) => ({ ...p, username: val }));
                        checkDashboardUsername(val);
                      }}
                      className="w-full pl-28 pr-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                  </div>
                  {profile.username && (
                    <p className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider font-sans ${
                      isCheckingDashUsername ? "text-muted-foreground" :
                      dashUsernameFeedback?.available ? "text-green-600 animate-fade-in" : "text-red-500 animate-fade-in"
                    }`}>
                      {isCheckingDashUsername ? "Checking availability..." :
                       dashUsernameFeedback?.available ? "✓ Username is available!" :
                       `✗ ${dashUsernameFeedback?.reason || "Username is not available."}`}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Tagline</label>
                  <input type="text" value={profile.tagline} onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                    placeholder="e.g. Modern Hair Styling & Organic Wellness"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={profile.description} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Website</label>
                  <input type="url" value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Instagram</label>
                  <input type="url" value={profile.instagram} onChange={(e) => setProfile((p) => ({ ...p, instagram: e.target.value }))}
                    placeholder="https://instagram.com/yoursalon"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Full Address</label>
                  <textarea value={profile.fullAddress} onChange={(e) => setProfile((p) => ({ ...p, fullAddress: e.target.value }))} rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">City</label>
                  <input type="text" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans" />
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E2D9CE]/60">
                  <Switch checked={profile.priceGuarantee} onCheckedChange={(v) => setProfile((p) => ({ ...p, priceGuarantee: v }))} />
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-sans cursor-pointer select-none">Price Guarantee</label>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Media / Images ─── */}
          {activeTab === "media" && (
            <div className="space-y-5">
              {/* Hero Image */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Hero Image</h3>
                <p className="text-xs text-[#6E6960] mb-4">This is the main banner image customers see when visiting your page.</p>
                <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                {profile.heroImage ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/7] border border-[#E2D9CE]/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => heroInputRef.current?.click()}
                          className="px-3 py-2 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-[#3D5A3A] flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5" /> Change
                        </button>
                        <button type="button" onClick={() => setProfile((p) => ({ ...p, heroImage: "" }))}
                          className="px-3 py-2 bg-red-500/90 backdrop-blur rounded-lg text-xs font-bold text-white flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => heroInputRef.current?.click()}
                    className="w-full aspect-[16/7] rounded-xl border-2 border-dashed border-[#E2D9CE] hover:border-[#3D5A3A]/40 bg-[#FAFAF7] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group">
                    <Upload className="w-8 h-8 text-[#6E6960]/50 group-hover:text-[#3D5A3A] transition-colors" />
                    <span className="text-xs font-bold text-[#6E6960] group-hover:text-[#3D5A3A]">Upload Hero Image</span>
                    <span className="text-[10px] text-[#6E6960]/60">Recommended: 1920×800px, JPG or PNG</span>
                  </button>
                )}
              </div>

              {/* Gallery Images */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3D5A3A]">Gallery</h3>
                    <p className="text-xs text-[#6E6960]">Showcase your salon&apos;s ambiance, work, and facilities.</p>
                  </div>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                  <Button onClick={() => galleryInputRef.current?.click()} variant="outline" className="rounded-xl border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#E8E0D6]/20 text-xs gap-1.5 cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5" /> Add Images
                  </Button>
                </div>
                {profile.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {profile.gallery.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-[#E2D9CE]/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button type="button" onClick={() => removeGalleryImage(img.id)}
                            className="p-2 bg-red-500/90 rounded-lg text-white">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                          <input type="text" value={img.caption} placeholder="Add caption..."
                            onChange={(e) => setProfile((p) => ({ ...p, gallery: p.gallery.map((g) => g.id === img.id ? { ...g, caption: e.target.value } : g) }))}
                            className="w-full px-2 py-1 rounded bg-white/90 text-[10px] text-[#1A1A1A] border-none outline-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button type="button" onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-12 rounded-xl border-2 border-dashed border-[#E2D9CE] hover:border-[#3D5A3A]/40 bg-[#FAFAF7] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer">
                    <ImagePlus className="w-8 h-8 text-[#6E6960]/50" />
                    <span className="text-xs font-bold text-[#6E6960]">Add Gallery Images</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ─── Tab: Hygiene ─── */}
          {activeTab === "hygiene" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white border border-[#E2D9CE]/60 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#C4A76C]" />
                <p className="text-xs text-[#6E6960] font-sans font-medium">Toggle hygiene checkpoints. Verified indicators show a shield badge to customers.</p>
              </div>
              {(Object.keys(hygieneLabels) as (keyof HygieneChecklist)[]).map((key) => (
                <div key={key}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    profile.hygiene[key] ? "bg-[#3D5A3A]/5 border-[#3D5A3A]/30" : "bg-white border-[#E2D9CE]/50"
                  }`}
                  onClick={() => toggleHygiene(key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${profile.hygiene[key] ? "bg-[#3D5A3A]/10 text-[#3D5A3A]" : "bg-gray-100 text-gray-400"}`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider font-sans ${profile.hygiene[key] ? "text-[#1A1A1A]" : "text-[#6E6960]"}`}>
                      {hygieneLabels[key]}
                    </span>
                  </div>
                  <Switch checked={profile.hygiene[key]} onCheckedChange={() => toggleHygiene(key)} onClick={(e) => e.stopPropagation()} />
                </div>
              ))}
            </div>
          )}

          {/* ─── Tab: Highlights & Amenities ─── */}
          {activeTab === "highlights" && (
            <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#3D5A3A] mb-3">Salon Highlights</h3>
                <div className="space-y-2 mb-4">
                  {profile.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2D9CE]/40">
                      <span className="w-5 h-5 rounded-full bg-[#3D5A3A]/10 flex items-center justify-center text-[10px] font-bold text-[#3D5A3A] shrink-0">{i + 1}</span>
                      <span className="flex-1 text-xs font-sans font-semibold text-[#1A1A1A]">{h}</span>
                      <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHighlight()}
                    placeholder="Add a highlight..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 font-sans" />
                  <Button onClick={addHighlight} variant="outline" className="rounded-xl border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#E8E0D6]/20 px-4 cursor-pointer"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#3D5A3A] mb-3">Facilities & Amenities</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.amenities.map((a, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D9CE]/50 text-xs font-bold text-[#3D5A3A] font-sans">
                      {a}
                      <button type="button" onClick={() => removeAmenity(i)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAmenity()}
                    placeholder="Add an amenity..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 font-sans" />
                  <Button onClick={addAmenity} variant="outline" className="rounded-xl border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#E8E0D6]/20 px-4 cursor-pointer"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Opening Hours ─── */}
          {activeTab === "hours" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Opening Hours</h3>
              <p className="text-xs text-[#6E6960] mb-5">Set your weekly schedule. Customers see this on your contact page.</p>
              <div className="space-y-3">
                {Object.entries(profile.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#E2D9CE]/40">
                    <span className="w-24 text-xs font-bold text-[#1A1A1A] font-sans">{day}</span>
                    <input type="text" value={hours}
                      onChange={(e) => setProfile((p) => ({ ...p, openingHours: { ...p.openingHours, [day]: e.target.value } }))}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#FAFAF7] border border-[#E2D9CE]/60 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-1 focus:ring-[#3D5A3A]/10 font-sans" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Tab: Offers ─── */}
          {activeTab === "offers" && (
            <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Offers & Packages</h3>
                <p className="text-xs text-[#6E6960] mb-4">Create deals that attract new and returning customers.</p>

                {/* Existing Offers */}
                <div className="space-y-3 mb-5">
                  {profile.offers.map((offer) => (
                    <div key={offer.id} className="p-4 rounded-xl bg-white border border-[#E2D9CE]/40 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#1A1A1A]">{offer.title}</span>
                          {offer.badge && <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C4A76C]/15 text-[#C4A76C] px-2 py-0.5 rounded-full">{offer.badge}</span>}
                        </div>
                        <p className="text-xs text-[#6E6960] mb-1">{offer.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#3D5A3A]">{offer.offerPrice}</span>
                          {offer.originalPrice && <span className="text-[#6E6960] line-through">{offer.originalPrice}</span>}
                          <span className="text-[#6E6960]/60">· {offer.validity}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeOffer(offer.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                {/* Add New Offer */}
                <div className="p-4 rounded-xl bg-[#FAFAF7] border border-dashed border-[#E2D9CE] space-y-3">
                  <span className="text-[10px] font-bold text-[#6E6960] uppercase tracking-wider">Add New Offer</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={newOffer.title} onChange={(e) => setNewOffer((p) => ({ ...p, title: e.target.value }))} placeholder="Offer title *"
                      className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                    <input type="text" value={newOffer.badge} onChange={(e) => setNewOffer((p) => ({ ...p, badge: e.target.value }))} placeholder="Badge (e.g. Save 20%)"
                      className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                    <input type="text" value={newOffer.offerPrice} onChange={(e) => setNewOffer((p) => ({ ...p, offerPrice: e.target.value }))} placeholder="Offer price *"
                      className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                    <input type="text" value={newOffer.originalPrice} onChange={(e) => setNewOffer((p) => ({ ...p, originalPrice: e.target.value }))} placeholder="Original price"
                      className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                    <input type="text" value={newOffer.validity} onChange={(e) => setNewOffer((p) => ({ ...p, validity: e.target.value }))} placeholder="Validity"
                      className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                  </div>
                  <textarea value={newOffer.description} onChange={(e) => setNewOffer((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A] resize-none" />
                  <Button onClick={addOffer} className="rounded-xl bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-xs font-bold px-4 h-9 cursor-pointer gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Offer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Products ─── */}
          {activeTab === "products" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Products & Brands</h3>
              <p className="text-xs text-[#6E6960] mb-4">List the professional products and brands you use.</p>

              <div className="space-y-3 mb-5">
                {profile.products.map((product) => (
                  <div key={product.id} className="p-4 rounded-xl bg-white border border-[#E2D9CE]/40 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#3D5A3A]/8 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#3D5A3A]">{product.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-[#1A1A1A]">{product.name}</span>
                      <p className="text-[10px] text-[#C4A76C] font-semibold">{product.category}</p>
                      <p className="text-xs text-[#6E6960] mt-0.5">{product.description}</p>
                    </div>
                    <button type="button" onClick={() => removeProduct(product.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF7] border border-dashed border-[#E2D9CE] space-y-3">
                <span className="text-[10px] font-bold text-[#6E6960] uppercase tracking-wider">Add New Product</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} placeholder="Brand name *"
                    className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                  <input type="text" value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} placeholder="Category"
                    className="px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                </div>
                <input type="text" value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Short description"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                <Button onClick={addProduct} className="rounded-xl bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-xs font-bold px-4 h-9 cursor-pointer gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </Button>
              </div>
            </div>
          )}

          {/* ─── Tab: FAQs ─── */}
          {activeTab === "faqs" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-1">Frequently Asked Questions</h3>
              <p className="text-xs text-[#6E6960] mb-4">Help customers find answers before they reach out.</p>

              <div className="space-y-3 mb-5">
                {profile.faqs.map((faq) => (
                  <div key={faq.id} className="p-4 rounded-xl bg-white border border-[#E2D9CE]/40">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-[#3D5A3A] mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">{faq.question}</p>
                        <p className="text-xs text-[#6E6960]">{faq.answer}</p>
                      </div>
                      <button type="button" onClick={() => removeFaq(faq.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF7] border border-dashed border-[#E2D9CE] space-y-3">
                <span className="text-[10px] font-bold text-[#6E6960] uppercase tracking-wider">Add New FAQ</span>
                <input type="text" value={newFaq.question} onChange={(e) => setNewFaq((p) => ({ ...p, question: e.target.value }))} placeholder="Question *"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A]" />
                <textarea value={newFaq.answer} onChange={(e) => setNewFaq((p) => ({ ...p, answer: e.target.value }))} placeholder="Answer *" rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2D9CE] text-xs focus:outline-none focus:border-[#3D5A3A] resize-none" />
                <Button onClick={addFaq} className="rounded-xl bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-xs font-bold px-4 h-9 cursor-pointer gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* ─── Live Booking Preview ─── */}
        <div className="xl:col-span-2 flex flex-col items-center">
          <div className="sticky top-24">
            <span className="text-[10px] font-bold text-[#C4A76C] uppercase tracking-widest font-sans mb-3 flex items-center gap-1.5 justify-center">
              <Eye className="w-3 h-3" /> Live Booking Preview
            </span>

            {/* Phone Frame */}
            <div className="border-[8px] border-[#1A1A1A] rounded-[40px] bg-[#FAFAF7] shadow-2xl overflow-hidden relative w-[310px] h-[600px] transition-all duration-300 select-none flex flex-col">
              {/* Status Bar */}
              <div className="h-6 bg-[#FAFAF7] px-6 pt-1.5 flex items-center justify-between text-[9px] font-bold text-[#1A1A1A] z-20 shrink-0">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" />
                  <div className="w-4.5 h-2.5 border border-[#1A1A1A] rounded-[3px] p-[1.5px] flex items-center">
                    <div className="w-full h-full bg-[#1A1A1A] rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Address Bar */}
              <div className="bg-[#E8E0D6]/30 border-b border-[#E2D9CE]/50 px-3 py-1.5 flex items-center justify-center shrink-0">
                <div className="w-full bg-[#FAFAF7] border border-[#E2D9CE]/60 rounded-lg py-1 px-3 flex items-center justify-center gap-1.5 text-[9px] text-[#6E6960] font-sans">
                  <Globe className="w-2.5 h-2.5 text-[#3D5A3A]" />
                  <span className="font-semibold tracking-tight">citysalon.in/salon</span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">

                {/* Hero Banner */}
                <div className="relative h-24 overflow-hidden">
                  {profile.heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3D5A3A] to-[#2B3F29] flex items-center justify-center">
                      <Store className="w-10 h-10 text-[#C4A76C]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
                </div>

                <div className="px-4 -mt-4 relative z-10">
                  {/* Name & Rating */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2 className="font-serif text-[13px] font-bold text-[#1A1A1A] leading-tight">{profile.name || "Salon Name"}</h2>
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 text-[#C4A76C] fill-current" />
                      <span className="text-[9px] font-bold">4.8</span>
                    </span>
                  </div>
                  <p className="text-[9px] text-[#C4A76C] font-semibold italic mb-2">{profile.tagline || "Your tagline"}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className={`px-2 py-0.5 border rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 ${activeStatus.color}`}>
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {activeStatus.label}
                    </span>
                    {profile.priceGuarantee && (
                      <span className="px-2 py-0.5 bg-[#C4A76C]/10 text-[#C4A76C] border border-[#C4A76C]/20 rounded text-[8px] font-bold uppercase tracking-wider">✓ Price Lock</span>
                    )}
                  </div>

                  {/* About */}
                  <div className="mb-3">
                    <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">About</span>
                    <p className="text-[9px] text-[#6E6960] mt-0.5 leading-relaxed line-clamp-3">{profile.description || "Your salon description..."}</p>
                  </div>

                  {/* Gallery Preview */}
                  {profile.gallery.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Gallery</span>
                      <div className="flex gap-1 mt-1 overflow-hidden">
                        {profile.gallery.slice(0, 3).map((img) => (
                          <div key={img.id} className="w-14 h-14 rounded-lg overflow-hidden relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                        ))}
                        {profile.gallery.length > 3 && (
                          <div className="w-14 h-14 rounded-lg bg-[#E8E0D6]/60 flex items-center justify-center text-[9px] font-bold text-[#3D5A3A]">
                            +{profile.gallery.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hygiene */}
                  {Object.values(profile.hygiene).some(Boolean) && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Verified Safety</span>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        {(Object.keys(hygieneLabels) as (keyof HygieneChecklist)[]).filter((k) => profile.hygiene[k]).slice(0, 4).map((key) => (
                          <div key={key} className="flex items-center gap-1 text-[8px] text-[#3D5A3A] font-semibold bg-[#3D5A3A]/5 border border-[#3D5A3A]/10 px-1.5 py-1 rounded">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#C4A76C]" />
                            <span className="truncate">{hygieneLabels[key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  {profile.highlights.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Highlights</span>
                      <div className="space-y-1 mt-1">
                        {profile.highlights.slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[8px] text-[#1A1A1A]">
                            <span className="w-3 h-3 rounded-full bg-[#3D5A3A]/10 flex items-center justify-center text-[7px] font-bold text-[#3D5A3A] shrink-0">{i + 1}</span>
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offers Preview */}
                  {profile.offers.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Offers</span>
                      <div className="space-y-1 mt-1">
                        {profile.offers.slice(0, 2).map((offer) => (
                          <div key={offer.id} className="p-2 rounded-lg bg-[#C4A76C]/5 border border-[#C4A76C]/15">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-[#1A1A1A] truncate">{offer.title}</span>
                              <span className="text-[8px] font-bold text-[#3D5A3A]">{offer.offerPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hours Preview */}
                  <div className="mb-3">
                    <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Hours Today</span>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[#1A1A1A]">
                      <Clock className="w-3 h-3 text-[#3D5A3A]" />
                      <span>{Object.values(profile.openingHours)[0]}</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="border-t border-[#E2D9CE]/40 pt-3 mb-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-[8px] text-[#6E6960]"><MapPin className="w-2.5 h-2.5 text-[#3D5A3A]" /><span className="truncate">{profile.fullAddress}</span></div>
                    <div className="flex items-center gap-2 text-[8px] text-[#6E6960]"><Phone className="w-2.5 h-2.5 text-[#3D5A3A]" /><span>{profile.phone}</span></div>
                    <div className="flex items-center gap-2 text-[8px] text-[#6E6960]"><Mail className="w-2.5 h-2.5 text-[#C4A76C]" /><span className="truncate">{profile.email}</span></div>
                    {profile.instagram && <div className="flex items-center gap-2 text-[8px] text-[#6E6960]"><Instagram className="w-2.5 h-2.5 text-[#3D5A3A]" /><span className="truncate">Instagram</span></div>}
                  </div>

                  {/* Amenities */}
                  {profile.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {profile.amenities.map((a, i) => (
                        <span key={i} className="text-[7px] font-bold bg-[#E8E0D6]/50 text-[#3D5A3A] px-1.5 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  )}

                  {/* Products Preview */}
                  {profile.products.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">Products Used</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.products.slice(0, 4).map((p) => (
                          <span key={p.id} className="text-[7px] font-bold bg-white border border-[#E2D9CE]/50 text-[#1A1A1A] px-1.5 py-0.5 rounded">{p.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQs Preview */}
                  {profile.faqs.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[7px] text-[#6E6960] font-bold uppercase tracking-[0.15em]">FAQs</span>
                      <div className="space-y-1 mt-1">
                        {profile.faqs.slice(0, 2).map((faq) => (
                          <div key={faq.id} className="text-[8px] text-[#6E6960] truncate">
                            <span className="text-[#3D5A3A] font-semibold">Q:</span> {faq.question}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-3 border-t border-[#E2D9CE]/40 bg-white/80 backdrop-blur-md shrink-0">
                <button type="button" className="w-full py-2.5 bg-[#3D5A3A] text-[#FAFAF7] text-[10px] font-bold font-sans uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed">
                  <Calendar className="w-3 h-3" /> Book Appointment
                </button>
              </div>

              {/* Safari Bottom Bar */}
              <div className="bg-[#FAFAF7] border-t border-[#E2D9CE]/50 py-2 px-5 flex items-center justify-between text-[#6E6960] shrink-0">
                <span className="opacity-40 text-[11px]">&lt;</span>
                <span className="opacity-40 text-[11px]">&gt;</span>
                <span className="opacity-70 text-[13px] font-bold">↑</span>
                <span className="opacity-70 text-[10px] font-bold">⊡</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
