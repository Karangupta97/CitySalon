"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  IndianRupee,
  Sparkles,
  Info,
  TrendingUp,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  isActive: boolean
}

const defaultServices: Service[] = [
  { id: "1", name: "Haircut", category: "Hair", price: 600, duration: 30, isActive: true },
  { id: "2", name: "Hair Colour (Global)", category: "Hair", price: 1800, duration: 90, isActive: true },
  { id: "3", name: "Blowout", category: "Hair", price: 500, duration: 45, isActive: true },
  { id: "4", name: "Hair Wash + Style", category: "Hair", price: 400, duration: 30, isActive: true },
  { id: "5", name: "Classic Facial", category: "Skin", price: 800, duration: 60, isActive: true },
  { id: "6", name: "Cleanup", category: "Skin", price: 500, duration: 45, isActive: true },
  { id: "7", name: "Manicure", category: "Nails", price: 500, duration: 30, isActive: true },
  { id: "8", name: "Pedicure", category: "Nails", price: 600, duration: 45, isActive: true },
  { id: "9", name: "Beard Trim", category: "Men", price: 350, duration: 20, isActive: true },
  { id: "10", name: "Bridal Makeup", category: "Bridal", price: 8000, duration: 180, isActive: false },
]

const categories = ["Hair", "Skin", "Nails", "Men", "Bridal", "Other"]

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

const emptyService: Omit<Service, "id"> = {
  name: "", category: "Hair", price: 0, duration: 30, isActive: true
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Omit<Service, "id">>(emptyService)
  
  // Hackathon feature states: Dynamic Pricing Engine simulation
  const [dynamicPricing, setDynamicPricing] = useState(false)
  const [simulatedTime, setSimulatedTime] = useState<"happy-hour" | "surge" | "standard">("surge")

  const allCategories = ["All", ...Array.from(new Set(services.map((s) => s.category)))]
  const filtered = filterCategory === "All" ? services : services.filter((s) => s.category === filterCategory)

  const openAdd = () => { setEditing(null); setForm(emptyService); setDialogOpen(true) }
  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ name: s.name, category: s.category, price: s.price, duration: s.duration, isActive: s.isActive })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)))
    } else {
      setServices((prev) => [...prev, { ...form, id: Date.now().toString() }])
    }
    setDialogOpen(false)
  }

  const toggleActive = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))
  }

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  // Calculate pricing based on engine state
  const getCalculatedPrice = (basePrice: number) => {
    if (!dynamicPricing) return basePrice
    if (simulatedTime === "happy-hour") {
      return Math.round(basePrice * 0.85) // -15% Happy Hour
    }
    if (simulatedTime === "surge") {
      return Math.round(basePrice * 1.10) // +10% Peak Surge
    }
    return basePrice
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-blur-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Services</h1>
          <p className="text-sm font-sans text-[#6E6960] mt-1 font-medium">
            {services.filter((s) => s.isActive).length} active services · {services.filter((s) => !s.isActive).length} hidden
          </p>
        </div>
        <Button onClick={openAdd} className="bg-[#3D5A3A] text-[#FAFAF7] hover:bg-[#2B3F29] rounded-xl px-5 py-2.5 font-bold font-sans text-xs tracking-wider uppercase shadow-md shadow-[#3D5A3A]/10 border border-[#3D5A3A] hover:scale-[1.02] cursor-pointer flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4 text-[#C4A76C]" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* ─── Dynamic Pricing Engine Toggle Panel (Hackathon Feature!) ─── */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-xs ${
        dynamicPricing ? "bg-gradient-to-r from-[#3D5A3A]/12 via-[#3D5A3A]/5 to-[#C4A76C]/15 border-[#3D5A3A]/40 ring-1 ring-[#3D5A3A]/5" : "bg-white/70 backdrop-blur-md border-[#E2D9CE]/50"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 ${
              dynamicPricing ? "bg-[#3D5A3A] text-white rotate-[360deg]" : "bg-[#3D5A3A]/10 text-[#3D5A3A] border-transparent"
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-[#3D5A3A]">
                Smart Dynamic Pricing Engine
              </h3>
              <p className="text-xs mt-0.5 font-sans text-[#6E6960]">
                Automatically adjust listed rates based on salon capacity (surges +10% during Saturday peaks, discounts -15% off-peak).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {dynamicPricing && (
              <div className="flex items-center bg-[#E8E0D6]/40 rounded-xl p-1 border border-[#E2D9CE]/60 text-[10px] font-bold font-sans animate-scale-fade-in">
                <button
                  type="button"
                  onClick={() => setSimulatedTime("happy-hour")}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    simulatedTime === "happy-hour" ? "bg-[#C4A76C] text-white shadow-xs scale-102" : "text-[#6E6960] hover:text-[#3D5A3A]"
                  }`}
                >
                  Happy Hour (-15%)
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedTime("surge")}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    simulatedTime === "surge" ? "bg-[#3D5A3A] text-white shadow-xs scale-102" : "text-[#6E6960] hover:text-[#3D5A3A]"
                  }`}
                >
                  Peak Surge (+10%)
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setDynamicPricing(!dynamicPricing)}
              className="focus:outline-none cursor-pointer transition-transform duration-200 active:scale-95"
              aria-label="Toggle dynamic pricing"
            >
              {dynamicPricing ? (
                <ToggleRight className="w-10 h-10 text-[#3D5A3A]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-[#6E6960]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 border cursor-pointer hover:scale-102 ${
              filterCategory === cat
                ? "bg-[#3D5A3A] text-[#FAFAF7] border-[#3D5A3A] shadow-md shadow-[#3D5A3A]/10"
                : "bg-white text-[#6E6960] border-[#E2D9CE]/60 hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/35"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="rounded-2xl border border-[#E2D9CE]/50 overflow-hidden bg-white/70 backdrop-blur-md shadow-xs max-h-[460px] overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6E6960] text-sm font-sans italic">No services registered in this category.</div>
        ) : (
          filtered.map((service, i) => {
            const calculatedPrice = getCalculatedPrice(service.price)
            const showSurge = dynamicPricing && simulatedTime === "surge"
            const showDiscount = dynamicPricing && simulatedTime === "happy-hour"

            return (
              <div
                key={service.id}
                className={`flex items-center justify-between gap-4 px-6 py-4 sm:py-5 transition-opacity duration-300 ${
                  !service.isActive ? "opacity-50" : ""
                } ${i !== filtered.length - 1 ? "border-b border-[#E2D9CE]/30" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{service.name}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E8E0D6]/50 text-[#3D5A3A] px-2 py-0.5 rounded-md border border-[#E2D9CE]/30">
                      {service.category}
                    </span>
                    {!service.isActive && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E8E0D6]/20 text-[#6E6960] px-2 py-0.5 rounded-md">Hidden</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-[#6E6960] font-sans font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#3D5A3A]" />
                      {formatDuration(service.duration)}
                    </span>
                    <span className="text-xs text-[#6E6960] font-sans font-semibold">•</span>
                    <span className="flex items-center gap-1 text-xs text-[#6E6960] font-sans">
                      <span>Base Rate:</span>
                      <span className="font-extrabold text-[#1A1A1A]">₹{service.price}</span>
                    </span>
                  </div>
                </div>

                {/* Price Display Block */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {dynamicPricing ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#6E6960] line-through font-bold">₹{service.price}</span>
                          <span className="text-base font-extrabold text-[#1A1A1A] tracking-tight">
                            ₹{calculatedPrice}
                          </span>
                        </div>
                        {showSurge && (
                          <span className="text-[9px] font-bold text-[#C4A76C] bg-[#C4A76C]/10 px-1.5 py-0.5 rounded uppercase mt-0.5 flex items-center gap-0.5">
                            <TrendingUp className="w-2.5 h-2.5" /> Surge Active
                          </span>
                        )}
                        {showDiscount && (
                          <span className="text-[9px] font-bold text-[#3D5A3A] bg-[#3D5A3A]/10 px-1.5 py-0.5 rounded uppercase mt-0.5 flex items-center gap-0.5">
                            <Percent className="w-2.5 h-2.5" /> Happy Hour
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 text-base font-extrabold text-[#1A1A1A] tracking-tight font-sans">
                        <IndianRupee className="w-3.5 h-3.5 text-[#3D5A3A]" />
                        {service.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center border-l border-[#E2D9CE]/30 pl-3 gap-1">
                    <button
                      type="button"
                      onClick={() => toggleActive(service.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/30 cursor-pointer transition-colors"
                      aria-label={service.isActive ? "Hide service" : "Show service"}
                    >
                      {service.isActive ? <ToggleRight className="w-6 h-6 text-[#3D5A3A]" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/30 cursor-pointer transition-colors"
                      aria-label="Edit service"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6E6960] hover:text-red-600 hover:bg-[#E8E0D6]/30 cursor-pointer transition-colors"
                      aria-label="Delete service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-extrabold text-[#3D5A3A]">
              {editing ? "Edit Service Card" : "Register New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Service Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Balayage Highlighting"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E2D9CE] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans cursor-pointer"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Duration (mins)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2D9CE]/60">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="accent-[#3D5A3A] w-4 h-4 rounded"
              />
              <label htmlFor="isActive" className="text-xs text-[#1A1A1A] font-bold uppercase tracking-wider font-sans cursor-pointer select-none">
                List service publicly
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-4">Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-xl font-bold text-xs uppercase tracking-wider px-4 cursor-pointer shadow-md shadow-[#3D5A3A]/10">
              {editing ? "Save changes" : "Register service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
