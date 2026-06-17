"use client"

import { useState } from "react"
import {
  Store,
  Check,
  ShieldCheck,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
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
    autoclave: true,
    freshTowels: true,
    licensedStaff: true,
    disposableKits: true,
    sanitization: true,
    airPurification: false,
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
  { value: "available", label: "Walk-in Available" },
  { value: "short-wait", label: "Short Wait" },
  { value: "busy", label: "Busy" },
  { value: "fully-booked", label: "Fully Booked" },
]

export default function SalonProfilePage() {
  const [profile, setProfile] = useState(defaultProfile)
  const [saved, setSaved] = useState(false)
  const [newHighlight, setNewHighlight] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [activeTab, setActiveTab] = useState<"info" | "hygiene" | "highlights">("info")

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleHygiene = (key: keyof HygieneChecklist) => {
    setProfile((prev) => ({
      ...prev,
      hygiene: { ...prev.hygiene, [key]: !prev.hygiene[key] },
    }))
  }

  const addHighlight = () => {
    if (!newHighlight.trim()) return
    setProfile((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }))
    setNewHighlight("")
  }

  const removeHighlight = (i: number) => {
    setProfile((prev) => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }))
  }

  const addAmenity = () => {
    if (!newAmenity.trim()) return
    setProfile((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }))
    setNewAmenity("")
  }

  const removeAmenity = (i: number) => {
    setProfile((prev) => ({ ...prev, amenities: prev.amenities.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Salon Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your public listing</p>
        </div>
        <Button
          onClick={handleSave}
          className={`rounded-full px-5 gap-2 ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"} text-white`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Changes"}
        </Button>
      </div>

      {/* Quick status toggle */}
      <div className="p-4 rounded-2xl bg-card/70 border border-border/20 boty-shadow flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Store className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Live Status</p>
          <p className="text-xs text-muted-foreground">Visible on your public salon page</p>
        </div>
        <Select
          value={profile.liveStatus}
          onValueChange={(v) => setProfile((p) => ({ ...p, liveStatus: v as typeof p.liveStatus }))}
        >
          <SelectTrigger className="w-[160px] rounded-xl border-border/30 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {liveStatusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
        {(["info", "hygiene", "highlights"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-medium boty-transition capitalize ${
              activeTab === t ? "bg-background text-foreground boty-shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "hygiene" ? "Hygiene" : t === "highlights" ? "Highlights" : "Basic Info"}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Salon Name *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Tagline</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="A short brand tagline"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">Full Address</label>
              <textarea
                value={profile.fullAddress}
                onChange={(e) => setProfile((p) => ({ ...p, fullAddress: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
              <Switch
                checked={profile.priceGuarantee}
                onCheckedChange={(v) => setProfile((p) => ({ ...p, priceGuarantee: v }))}
                id="priceGuarantee"
              />
              <label htmlFor="priceGuarantee" className="text-sm font-medium text-foreground cursor-pointer">
                Price Guarantee
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Hygiene Checklist */}
      {activeTab === "hygiene" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Toggle your verified hygiene practices. These are displayed prominently on your public profile.
          </p>
          {(Object.keys(hygieneLabels) as (keyof HygieneChecklist)[]).map((key) => (
            <div
              key={key}
              className={`flex items-center gap-4 p-4 rounded-xl border boty-transition cursor-pointer ${
                profile.hygiene[key]
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card/50 border-border/20"
              }`}
              onClick={() => toggleHygiene(key)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile.hygiene[key] ? "bg-primary/15" : "bg-muted"}`}>
                <ShieldCheck className={`w-4 h-4 ${profile.hygiene[key] ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`flex-1 text-sm font-medium ${profile.hygiene[key] ? "text-foreground" : "text-muted-foreground"}`}>
                {hygieneLabels[key]}
              </span>
              <Switch
                checked={profile.hygiene[key]}
                onCheckedChange={() => toggleHygiene(key)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Highlights & Amenities */}
      {activeTab === "highlights" && (
        <div className="space-y-6">
          {/* Highlights */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Salon Highlights</h3>
            <div className="space-y-2 mb-3">
              {profile.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/70 border border-border/20">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="flex-1 text-sm text-foreground">{h}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="text-muted-foreground hover:text-destructive boty-transition"
                    aria-label="Remove highlight"
                  >
                    <X className="w-3.5 h-3.5" />
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
                placeholder="Add a highlight..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
              />
              <Button onClick={addHighlight} variant="outline" className="rounded-xl" aria-label="Add highlight">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Facilities & Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.amenities.map((a, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/70 border border-border/20 text-sm text-foreground">
                  {a}
                  <button
                    type="button"
                    onClick={() => removeAmenity(i)}
                    className="text-muted-foreground hover:text-destructive boty-transition"
                    aria-label="Remove amenity"
                  >
                    <X className="w-3 h-3" />
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
                placeholder="e.g. Free WiFi, Air Conditioned..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
              />
              <Button onClick={addAmenity} variant="outline" className="rounded-xl" aria-label="Add amenity">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
