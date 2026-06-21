"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Star,
  Clock,
  Phone,
  Mail,
  Trash2,
  DollarSign,
  Briefcase,
  Award,
} from "lucide-react"
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
  revenue: number // Custom revenue for commission tracking
  availability: Availability
}

const defaultStaff: StaffMember[] = [
  { id: "1", name: "Meena Sharma", role: "Senior Stylist", speciality: "Hair Colour & Blowouts", experience: "8 years", phone: "+91 98765 43210", rating: 4.9, reviewCount: 124, clients: "1,200+", revenue: 18200, availability: "available" },
  { id: "2", name: "Raj Patel", role: "Stylist", speciality: "Men's Hair & Beard", experience: "5 years", phone: "+91 87654 32109", rating: 4.8, reviewCount: 98, clients: "800+", revenue: 7500, availability: "available" },
  { id: "3", name: "Priya Gupta", role: "Skincare Expert", speciality: "Facials & Advanced Skin", experience: "6 years", email: "priya@salon.com", rating: 4.7, reviewCount: 76, clients: "600+", revenue: 9600, availability: "busy" },
  { id: "4", name: "Anita Desai", role: "Stylist", speciality: "Bridal & Nails", experience: "4 years", rating: 4.6, reviewCount: 52, clients: "400+", revenue: 5100, availability: "off" },
]

const availConfig: Record<Availability, { label: string; color: string }> = {
  available: { label: "Available", color: "text-[#3D5A3A] bg-[#3D5A3A]/8 border border-[#3D5A3A]/10" },
  busy: { label: "Busy", color: "text-[#C4A76C] bg-[#C4A76C]/10 border border-[#C4A76C]/10" },
  off: { label: "Day Off", color: "text-gray-500 bg-gray-100 border border-gray-200" },
}

const emptyStaff = { name: "", role: "Stylist", speciality: "", experience: "", phone: "", email: "", availability: "available" as Availability }

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [form, setForm] = useState(emptyStaff)
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockStaff, setBlockStaff] = useState("")
  const [blockDate, setBlockDate] = useState("")
  const [blockStart, setBlockStart] = useState("12:00")
  const [blockEnd, setBlockEnd] = useState("13:00")
  const [blockReason, setBlockReason] = useState("")

  const openAdd = () => { setEditing(null); setForm(emptyStaff); setDialogOpen(true) }
  const openEdit = (s: StaffMember) => {
    setEditing(s)
    setForm({ name: s.name, role: s.role, speciality: s.speciality, experience: s.experience, phone: s.phone || "", email: s.email || "", availability: s.availability })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setStaff((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...form, phone: form.phone || undefined, email: form.email || undefined } : s))
    } else {
      setStaff((prev) => [...prev, { ...form, id: Date.now().toString(), rating: 0, reviewCount: 0, clients: "New", revenue: 0, phone: form.phone || undefined, email: form.email || undefined }])
    }
    setDialogOpen(false)
  }

  const removeStaff = (id: string) => { setStaff((prev) => prev.filter((s) => s.id !== id)) }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-blur-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Staff Roster</h1>
          <p className="text-sm font-sans text-[#6E6960] mt-1 font-medium">{staff.length} active team members</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setBlockOpen(true)}
            variant="outline"
            className="rounded-xl px-4 py-2.5 h-10 gap-2 text-xs font-bold font-sans uppercase tracking-wider border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#3D5A3A]" />
            <span>Block Slot</span>
          </Button>
          <Button
            onClick={openAdd}
            className="bg-[#3D5A3A] text-[#FAFAF7] hover:bg-[#2B3F29] rounded-xl px-4 py-2.5 h-10 gap-2 font-bold font-sans text-xs tracking-wider uppercase shadow-md shadow-[#3D5A3A]/10 border border-[#3D5A3A] hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C4A76C]" />
            <span className="hidden sm:inline">Add Staff</span>
          </Button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((member) => {
          const { label, color } = availConfig[member.availability]
          const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
          
          // Commission calculation logic (simulation)
          const commissionRate = 0.15 // 15% service cut
          const commissionEarned = Math.round(member.revenue * commissionRate)

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs hover:shadow-md hover:scale-[1.005] hover-glow transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Initials Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[#E8E0D6]/50 border border-[#E2D9CE] flex items-center justify-center font-serif text-base font-extrabold text-[#3D5A3A] shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{member.name}</h4>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${color}`}>{label}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6E6960] font-sans font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-[#3D5A3A]" />
                    <span>{member.role}</span>
                    <span>•</span>
                    <span>{member.experience} exp</span>
                  </div>

                  <p className="text-xs text-[#C4A76C] font-semibold mt-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {member.speciality}
                  </p>
                </div>

                {/* Edit Actions */}
                <div className="flex items-center gap-1 border-l border-[#E2D9CE]/30 pl-2">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/30 cursor-pointer transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStaff(member.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6E6960] hover:text-red-600 hover:bg-[#E8E0D6]/30 cursor-pointer transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Commission Performance Panel (Hackathon Feature!) */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#FAFAF7]/60 border border-[#E2D9CE]/30 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans block mb-0.5">Services Rendered</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">₹{member.revenue.toLocaleString()}</p>
                </div>
                <div className="border-l border-[#E2D9CE]/30 pl-4">
                  <span className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans flex items-center gap-0.5 mb-0.5">
                    <DollarSign className="w-2.5 h-2.5 text-[#3D5A3A]" /> Commission (15%)
                  </span>
                  <p className="text-xs font-extrabold text-[#3D5A3A]">₹{commissionEarned.toLocaleString()}</p>
                </div>
              </div>

              {/* Stats Footer Row */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E2D9CE]/30 text-xs text-[#6E6960] font-sans font-semibold">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#C4A76C] text-[#C4A76C]" />
                  {member.rating} ({member.reviewCount} ratings)
                </span>
                <span>•</span>
                <span>{member.clients} guests served</span>
                {member.phone && (
                  <>
                    <span>•</span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#3D5A3A]" /> {member.phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-extrabold text-[#3D5A3A]">
              {editing ? "Edit Staff details" : "Register Team Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Roster display name"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Stylist"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  placeholder="5 years"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Speciality</label>
              <input
                type="text"
                value={form.speciality}
                onChange={(e) => setForm((f) => ({ ...f, speciality: e.target.value }))}
                placeholder="Hair Colouring & Blowouts"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@salon.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Roster Status</label>
              <Select value={form.availability} onValueChange={(v) => setForm((f) => ({ ...f, availability: v as Availability }))}>
                <SelectTrigger className="rounded-xl border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="available">Available for bookings</SelectItem>
                  <SelectItem value="busy">Assigned (Busy)</SelectItem>
                  <SelectItem value="off">On Leave (Off)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-4">Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-xl font-bold text-xs uppercase tracking-wider px-4 cursor-pointer shadow-md shadow-[#3D5A3A]/10">
              {editing ? "Save Changes" : "Register Stylist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-extrabold text-[#3D5A3A]">Block Schedule Time</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[#6E6960] font-sans font-medium">Prevent client bookings during blocked windows (lunch, breaks, meetings).</p>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Team Stylist</label>
              <Select value={blockStaff} onValueChange={setBlockStaff}>
                <SelectTrigger className="rounded-xl border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-10">
                  <SelectValue placeholder="Select Stylist" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Blocked Date</label>
              <input
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">End Time</label>
                <input
                  type="time"
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Reason / Notes</label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Doctor's appointment / Lunch break"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setBlockOpen(false)} className="rounded-xl border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-4">Cancel</Button>
            <Button onClick={() => setBlockOpen(false)} className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-xl font-bold text-xs uppercase tracking-wider px-4 cursor-pointer shadow-md shadow-[#3D5A3A]/10">Block Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
