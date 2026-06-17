"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, IndianRupee, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number  // minutes
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

const emptyService: Omit<Service, "id"> = { name: "", category: "Hair", price: 0, duration: 30, isActive: true }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Omit<Service, "id">>(emptyService)

  const allCategories = ["All", ...Array.from(new Set(services.map((s) => s.category)))]

  const filtered = filterCategory === "All"
    ? services
    : services.filter((s) => s.category === filterCategory)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyService)
    setDialogOpen(true)
  }

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

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {services.filter((s) => s.isActive).length} active · {services.filter((s) => !s.isActive).length} hidden
          </p>
        </div>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Service</span>
        </Button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium boty-transition ${
              filterCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card/70 text-muted-foreground border border-border/30 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="rounded-2xl border border-border/20 overflow-hidden bg-card/30">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No services in this category.
          </div>
        ) : (
          filtered.map((service, i) => (
            <div
              key={service.id}
              className={`flex items-center gap-3 px-4 py-4 sm:py-5 ${!service.isActive ? "opacity-50" : ""} ${i !== filtered.length - 1 ? "border-b border-border/15" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-foreground">{service.name}</h4>
                  <span className="text-[9px] uppercase tracking-wide bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full">
                    {service.category}
                  </span>
                  {!service.isActive && (
                    <span className="text-[9px] uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                    <IndianRupee className="w-3 h-3" />
                    {service.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleActive(service.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition"
                  aria-label={service.isActive ? "Hide service" : "Show service"}
                  title={service.isActive ? "Hide service" : "Show service"}
                >
                  {service.isActive
                    ? <ToggleRight className="w-4.5 h-4.5 text-primary" />
                    : <ToggleLeft className="w-4.5 h-4.5" />
                  }
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(service)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition"
                  aria-label="Edit service"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteService(service.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive boty-transition"
                  aria-label="Delete service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Service Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Hair Colour"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Duration (mins)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="accent-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                Show on public listing
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              {editing ? "Update" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
