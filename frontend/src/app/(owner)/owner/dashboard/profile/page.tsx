"use client"

import { useState } from "react"
import {
  Store,
  Check,
  ShieldCheck,
  Plus,
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Sparkles,
  Wifi,
  Coffee,
  Accessibility,
  Instagram,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface HygieneChecklist {
  autoclave: boolean
  freshTowels: boolean
  licensedStaff: boolean
  disposableKits: boolean
  sanitization: boolean
  airPurification: boolean
}

const defaultProfile = {
  name: "Radiance Beauty Studio",
  tagline: "Where beauty meets care, every day",
  description: "A premium salon specialising in hair, skin, and wellness services with over 8 years of trusted excellence in Mumbai.",
  phone: "+91 98765 43210",
  email: "hello@radiancebeauty.in",
  website: "https://radiancebeauty.in",
  fullAddress: "12, Linking Road, Bandra West, Mumbai — 400050",
  city: "Mumbai",
  liveStatus: "available" as const,
  priceGuarantee: true,
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

export default function SalonProfilePage() {
  const [profile, setProfile] = useState(defaultProfile)
  const [saved, setSaved] = useState(false)
  const [newHighlight, setNewHighlight] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [activeTab, setActiveTab] = useState<"info" | "hygiene" | "highlights">("info")

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const toggleHygiene = (key: keyof HygieneChecklist) => {
    setProfile((prev) => ({ ...prev, hygiene: { ...prev.hygiene, [key]: !prev.hygiene[key] } }))
  }

  const addHighlight = () => {
    if (!newHighlight.trim()) return
    setProfile((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }))
    setNewHighlight("")
  }
  const removeHighlight = (i: number) => { setProfile((prev) => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) })) }

  const addAmenity = () => {
    if (!newAmenity.trim()) return
    setProfile((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }))
    setNewAmenity("")
  }
  const removeAmenity = (i: number) => { setProfile((prev) => ({ ...prev, amenities: prev.amenities.filter((_, idx) => idx !== i) })) }

  // Get active status details for phone simulator
  const activeStatus = liveStatusOptions.find(o => o.value === profile.liveStatus) || liveStatusOptions[0]

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Salon Profile</h1>
          <p className="text-sm font-sans text-[#6E6960] mt-1 font-medium">Manage and preview your public customer-facing profile card</p>
        </div>
        <Button
          onClick={handleSave}
          className={`rounded-xl px-5 py-2.5 h-10 gap-2 font-bold font-sans text-xs tracking-wider uppercase shadow-md transition-all duration-300 cursor-pointer ${
            saved 
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 border-emerald-600" 
              : "bg-[#3D5A3A] hover:bg-[#2B3F29] shadow-[#3D5A3A]/10 border-[#3D5A3A]"
          } text-white border`}
        >
          {saved ? <><Check className="w-4 h-4 text-[#C4A76C]" /> Saved</> : "Save Changes"}
        </Button>
      </div>

      {/* Grid: Settings controls on left, Mobile Booking Preview Simulator on right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-start">
        
        {/* Settings Column: lg:col-span-3 */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Live Walk-In Status controller */}
          <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D5A3A]/10 flex items-center justify-center text-[#3D5A3A] shrink-0 border border-[#3D5A3A]/5">
                <Store className="w-5 h-5 text-[#3D5A3A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A1A] font-sans">Live Occupancy Status</p>
                <p className="text-xs text-[#6E6960] font-sans font-medium">Broadcast wait-times to clients on your booking page</p>
              </div>
            </div>

            <Select value={profile.liveStatus} onValueChange={(v) => setProfile((p) => ({ ...p, liveStatus: v as typeof p.liveStatus }))}>
              <SelectTrigger className="w-[180px] rounded-xl border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {liveStatusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Tab selector */}
          <div className="flex items-center bg-[#E8E0D6]/40 rounded-xl p-1 border border-[#E2D9CE]/40 shadow-xs w-fit">
            {(["info", "hygiene", "highlights"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === t
                    ? "bg-[#3D5A3A] text-[#FAFAF7] shadow-md shadow-[#3D5A3A]/10 scale-[1.02]"
                    : "text-[#6E6960] hover:text-[#3D5A3A]"
                }`}
              >
                {t === "hygiene" ? "Hygiene verified" : t === "highlights" ? "Highlights & Perks" : "Basic Info"}
              </button>
            ))}
          </div>

          {/* Tab 1: Info Form */}
          {activeTab === "info" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Salon Brand Name *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                    placeholder="e.g. Modern Hair Styling & Organic Wellness"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Brand Bio / Description</label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Contact Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Website Link</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Physical Address</label>
                  <textarea
                    value={profile.fullAddress}
                    onChange={(e) => setProfile((p) => ({ ...p, fullAddress: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E2D9CE]/60">
                  <Switch checked={profile.priceGuarantee} onCheckedChange={(v) => setProfile((p) => ({ ...p, priceGuarantee: v }))} id="priceGuarantee" className="accent-[#3D5A3A]" />
                  <label htmlFor="priceGuarantee" className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-sans cursor-pointer select-none">
                    Guaranteed pricing list
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hygiene Checklist */}
          {activeTab === "hygiene" && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-white border border-[#E2D9CE]/60 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C4A76C]" />
                <p className="text-xs text-[#6E6960] font-sans font-medium">Toggle hygiene checkpoints. Verified indicators show a security shield to customers.</p>
              </div>

              {(Object.keys(hygieneLabels) as (keyof HygieneChecklist)[]).map((key) => (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    profile.hygiene[key] ? "bg-[#3D5A3A]/5 border-[#3D5A3A]/30" : "bg-white border-[#E2D9CE]/50"
                  }`}
                  onClick={() => toggleHygiene(key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${profile.hygiene[key] ? "bg-[#3D5A3A]/10 border-transparent text-[#3D5A3A]" : "bg-gray-100 border-transparent text-gray-400"}`}>
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

          {/* Tab 3: Highlights & Amenities */}
          {activeTab === "highlights" && (
            <div className="space-y-6">
              
              {/* Salon Highlights */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#3D5A3A] mb-3">Salon Highlights</h3>
                <div className="space-y-2 mb-4">
                  {profile.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2D9CE]/40">
                      <div className="w-5 h-5 rounded-full bg-[#3D5A3A]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-[#3D5A3A]">{i + 1}</span>
                      </div>
                      <span className="flex-1 text-xs font-sans font-semibold text-[#1A1A1A]">{h}</span>
                      <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer" aria-label="Remove">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHighlight()}
                    placeholder="e.g. Organic Cruelty-free brand oils..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                  <Button onClick={addHighlight} variant="outline" className="rounded-xl border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#E8E0D6]/20 px-4 cursor-pointer" aria-label="Add">
                    <Plus className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>

              {/* Facilities & Amenities */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#3D5A3A] mb-3">Facilities & Amenities</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.amenities.map((a, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D9CE]/50 text-xs font-bold text-[#3D5A3A] font-sans">
                      {a}
                      <button type="button" onClick={() => removeAmenity(i)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Remove">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAmenity()}
                    placeholder="e.g. Complementary Beverages, Valet Parking..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                  />
                  <Button onClick={addAmenity} variant="outline" className="rounded-xl border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#E8E0D6]/20 px-4 cursor-pointer" aria-label="Add">
                    <Plus className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Live Booking Page Phone Simulator Column: lg:col-span-2 (Hackathon Feature!) ─── */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#C4A76C] uppercase tracking-widest font-sans mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Booking Preview
          </span>

          {/* Smartphone Frame Wrapper */}
          <div className="border-[8px] border-[#1A1A1A] rounded-[40px] bg-[#FAFAF7] shadow-xl overflow-hidden relative w-[300px] h-[580px] transition-all duration-300 select-none flex flex-col justify-between">
            {/* iOS Status Bar */}
            <div className="h-6 bg-[#FAFAF7] px-6 pt-1.5 flex items-center justify-between text-[9px] font-bold text-[#1A1A1A] z-20 shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5" />
                <div className="w-4.5 h-2.5 border border-[#1A1A1A] rounded-[3px] p-[1.5px] flex items-center">
                  <div className="w-full h-full bg-[#1A1A1A] rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Safari Address Bar */}
            <div className="bg-[#E8E0D6]/30 border-b border-[#E2D9CE]/50 px-3 py-2 flex items-center justify-center shrink-0">
              <div className="w-full bg-[#FAFAF7] border border-[#E2D9CE]/60 rounded-lg py-1 px-3 flex items-center justify-center gap-1.5 text-[9px] text-[#6E6960] font-sans">
                <Globe className="w-2.5 h-2.5 text-[#3D5A3A]" />
                <span className="font-semibold tracking-tight">radiance.citysalon.in</span>
              </div>
            </div>

            {/* Simulated Booking Screen */}
            <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide text-left">
              {/* Header Cover banner */}
              <div className="h-20 rounded-2xl bg-gradient-to-br from-[#3D5A3A] to-[#2B3F29] relative overflow-hidden flex items-center justify-center p-3 mb-4 border border-[#E2D9CE]/10">
                <Store className="w-8 h-8 text-[#C4A76C] opacity-30 absolute right-2 bottom-2" />
                <span className="text-white/20 text-5xl font-serif absolute -left-2 top-0 font-extrabold select-none">CS</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h1 className="font-serif text-sm font-bold text-[#1A1A1A] tracking-tight">{profile.name || "Salon Name"}</h1>
                  <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-[#C4A76C] fill-current" /><span className="text-[9px] font-bold text-[#1a1a1a]">4.8</span></span>
                </div>
                <p className="text-[10px] text-[#C4A76C] font-semibold font-sans italic">{profile.tagline || "Brand tagline"}</p>
              </div>

              {/* Live Status Badge */}
              <div className={`mt-3 px-3 py-1.5 border rounded-lg flex items-center gap-1.5 ${activeStatus.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{activeStatus.label}</span>
              </div>

              {/* Description */}
              <div className="mt-4">
                <span className="text-[8px] text-[#6E6960] font-bold uppercase tracking-widest font-sans">About Us</span>
                <p className="text-[10px] text-[#6E6960] font-sans font-medium mt-1 leading-relaxed">
                  {profile.description || "Describe your salon service highlights and story..."}
                </p>
              </div>

              {/* Verified Hygiene checklist */}
              <div className="mt-4">
                <span className="text-[8px] text-[#6E6960] font-bold uppercase tracking-widest font-sans">Verified Safety</span>
                <div className="grid grid-cols-1 gap-1.5 mt-2">
                  {(Object.keys(hygieneLabels) as (keyof HygieneChecklist)[]).map((key) => {
                    if (!profile.hygiene[key]) return null
                    return (
                      <div key={key} className="flex items-center gap-1.5 text-[9px] text-[#3D5A3A] font-semibold bg-[#3D5A3A]/5 border border-[#3D5A3A]/10 p-1.5 rounded-md">
                        <ShieldCheck className="w-3 h-3 text-[#C4A76C]" />
                        <span className="truncate">{hygieneLabels[key]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Contact Icons */}
              <div className="mt-4 space-y-1.5 border-t border-[#E2D9CE]/40 pt-3">
                <div className="flex items-center gap-2 text-[9px] text-[#6E6960] font-medium"><MapPin className="w-3 h-3 text-[#3D5A3A]" /><span className="truncate">{profile.fullAddress}</span></div>
                <div className="flex items-center gap-2 text-[9px] text-[#6E6960] font-medium"><Phone className="w-3 h-3 text-[#3D5A3A]" /><span>{profile.phone}</span></div>
                <div className="flex items-center gap-2 text-[9px] text-[#6E6960] font-medium"><Mail className="w-3 h-3 text-[#C4A76C]" /><span className="truncate">{profile.email}</span></div>
              </div>

              {/* Amenities tags */}
              <div className="mt-4 flex flex-wrap gap-1">
                {profile.amenities.map((a, idx) => (
                  <span key={idx} className="text-[8px] font-bold bg-[#E8E0D6]/40 text-[#3D5A3A] px-2 py-0.5 rounded-full font-sans">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Button Panel */}
            <div className="p-3 border-t border-[#E2D9CE]/40 bg-white/70 backdrop-blur-md shrink-0">
              <button className="w-full py-2 bg-[#3D5A3A] text-[#FAFAF7] text-[10px] font-bold font-sans uppercase tracking-widest rounded-xl flex items-center justify-center gap-1 cursor-not-allowed">
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Safari Bottom Navigation Bar */}
            <div className="bg-[#FAFAF7] border-t border-[#E2D9CE]/50 py-2 px-5 flex items-center justify-between text-[#6E6960] text-[11px] shrink-0 z-20">
              <span className="opacity-40">&lt;</span>
              <span className="opacity-40">&gt;</span>
              <span className="opacity-70 text-[13px] font-bold">↑</span>
              <span className="opacity-70 text-[10px] font-bold">[]</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
