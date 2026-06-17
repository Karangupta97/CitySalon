"use client"

import { useState } from "react"
import { Plus, Pencil, Star, Clock, Phone, Mail, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Availability = "available" | "busy" | "off"

interface StaffMember {
  id: string
  name: string
  role: string
  speciality: string
  experience: string
  phone?: string
  email?: string
  rating: number
  reviewCount: number
  clients: string
  availability: Availability
}

const defaultStaff: StaffMember[] = [
  { id: "1", name: "Meena Sharma", role: "Senior Stylist", speciality: "Hair Colour & Blowouts", experience: "8 years", phone: "+91 98765 43210", rating: 4.9, reviewCount: 124, clients: "1,200+", availability: "available" },
  { id: "2", name: "Raj Patel", role: "Stylist", speciality: "Men's Hair & Beard", experience: "5 years", phone: "+91 87654 32109", rating: 4.8, reviewCount: 98, clients: "800+", availability: "available" },
  { id: "3", name: "Priya Gupta", role: "Skincare Expert", speciality: "Facials & Advanced Skin", experience: "6 years", email: "priya@salon.com", rating: 4.7, reviewCount: 76, clients: "600+", availability: "busy" },
  { id: "4", name: "Anita Desai", role: "Stylist", speciality: "Bridal & Nails", experience: "4 years", rating: 4.6, reviewCount: 52, clients: "400+", availability: "off" },
]

const availConfig: Record<Availability, { label: string; color: string }> = {
  available: { label: "Available", color: "text-emerald-700 bg-emerald-50" },
  busy: { label: "Busy", color: "text-amber-700 bg-amber-50" },
  off: { label: "Day Off", color: "text-muted-foreground bg-muted/50" },
}

const emptyStaff = { name: "", role: "Stylist", speciality: "", experience: "", phone: "", email: "", availability: "available" as Availability }

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [form, setForm] = useState(emptyStaff)

  // Block slot dialog
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockStaff, setBlockStaff] = useState("")
  const [blockDate, setBlockDate] = useState("")
  const [blockStart, setBlockStart] = useState("12:00")
  const [blockEnd, setBlockEnd] = useState("13:00")
  const [blockReason, setBlockReason] = useState("")

  const openAdd = () => {
    setEditing(null)
    setForm(emptyStaff)
    setDialogOpen(true)
  }

  const openEdit = (s: StaffMember) => {
    setEditing(s)
    setForm({
      name: s.name,
      role: s.role,
      speciality: s.speciality,
      experience: s.experience,
      phone: s.phone || "",
      email: s.email || "",
      availability: s.availability,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setStaff((prev) => prev.map((s) =>
        s.id === editing.id ? { ...s, ...form, phone: form.phone || undefined, email: form.email || undefined } : s
      ))
    } else {
      setStaff((prev) => [
        ...prev,
        { ...form, id: Date.now().toString(), rating: 0, reviewCount: 0, clients: "New", phone: form.phone || undefined, email: form.email || undefined },
      ])
    }
    setDialogOpen(false)
  }

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{staff.length} team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setBlockOpen(true)} variant="outline" className="rounded-full px-4 gap-2 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Block Slot
          </Button>
          <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Staff</span>
          </Button>
        </div>
      </div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {staff.map((member) => {
          const { label, color } = availConfig[member.availability]
          return (
            <div key={member.id} className="p-5 rounded-2xl bg-card/70 border border-border/20 boty-shadow group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-foreground">{member.name}</h4>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${color}`}>{label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.role} · {member.experience}</p>
                  <p className="text-xs text-primary/80 mt-0.5">{member.speciality}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground boty-transition opacity-0 group-hover:opacity-100"
                    aria-label="Edit staff"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStaff(member.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive boty-transition opacity-0 group-hover:opacity-100"
                    aria-label="Remove staff"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/20 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {member.rating} ({member.reviewCount})
                </span>
                <span>{member.clients} clients</span>
                {member.phone && (
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <Phone className="w-3 h-3" />
                    {member.phone}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Stylist"
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  placeholder="5 years"
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Speciality</label>
              <input
                type="text"
                value={form.speciality}
                onChange={(e) => setForm((f) => ({ ...f, speciality: e.target.value }))}
                placeholder="Hair Colour & Blowouts"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Availability</label>
              <Select value={form.availability} onValueChange={(v) => setForm((f) => ({ ...f, availability: v as Availability }))}>
                <SelectTrigger className="rounded-xl border-border/30 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="off">Day Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              {editing ? "Update" : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Block Time Slot</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Block a stylist&apos;s slot (lunch break, day off, etc.)</p>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Staff Member</label>
              <Select value={blockStaff} onValueChange={setBlockStaff}>
                <SelectTrigger className="rounded-xl border-border/30 text-sm">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Date</label>
              <input
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">End Time</label>
                <input
                  type="time"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Reason (optional)</label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Lunch break"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBlockOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setBlockOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              Block Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
