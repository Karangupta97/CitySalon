"use client"

import { useState, useMemo } from "react"
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  Scissors,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Phone,
  RotateCcw,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show" | "open"

interface Appointment {
  id: string
  time: string
  endTime: string
  customer: string | null
  phone: string | null
  service: string | null
  serviceList: string[]
  stylist: string | null
  status: AppointmentStatus
  price: number
  isWalkIn?: boolean
}

const initialAppointments: Appointment[] = [
  { id: "1", time: "10:00 AM", endTime: "11:30 AM", customer: "Priya Sharma", phone: "+91 98765 43210", service: "Haircut + Colour", serviceList: ["Haircut", "Hair Colour"], stylist: "Meena", status: "confirmed", price: 1800 },
  { id: "2", time: "11:30 AM", endTime: "12:00 PM", customer: "Rohit Kapoor", phone: "+91 87654 32109", service: "Beard Trim", serviceList: ["Beard Trim"], stylist: "Raj", status: "confirmed", price: 350 },
  { id: "3", time: "01:00 PM", endTime: "02:00 PM", customer: null, phone: null, service: null, serviceList: [], stylist: null, status: "open", price: 0 },
  { id: "4", time: "02:00 PM", endTime: "03:30 PM", customer: "Ananya Mehta", phone: "+91 76543 21098", service: "Facial + Cleanup", serviceList: ["Facial", "Cleanup"], stylist: "Any", status: "pending", price: 1200 },
  { id: "5", time: "03:30 PM", endTime: "04:30 PM", customer: "Vikram Singh", phone: "+91 65432 10987", service: "Hair Wash + Style", serviceList: ["Hair Wash", "Styling"], stylist: "Meena", status: "confirmed", price: 750 },
  { id: "6", time: "05:00 PM", endTime: "06:00 PM", customer: "Deepa Nair", phone: "+91 54321 09876", service: "Manicure + Pedicure", serviceList: ["Manicure", "Pedicure"], stylist: "Priya", status: "pending", price: 900 },
]

const stylists = ["Any Available", "Meena", "Raj", "Priya", "Anita", "Vikram"]
const services = ["Haircut", "Hair Colour", "Beard Trim", "Facial", "Cleanup", "Manicure", "Pedicure", "Hair Wash", "Styling", "Blowout", "Bridal Makeup"]

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-700 bg-emerald-50" },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-50" },
  completed: { label: "Completed", color: "text-primary bg-primary/10" },
  cancelled: { label: "Cancelled", color: "text-destructive bg-destructive/10" },
  "no-show": { label: "No-show", color: "text-muted-foreground bg-muted/50" },
  open: { label: "Open", color: "text-muted-foreground bg-muted/30" },
}

function getDateLabel(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  if (offset === 0) return "Today"
  if (offset === 1) return "Tomorrow"
  if (offset === -1) return "Yesterday"
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [dayOffset, setDayOffset] = useState(0)
  const [view, setView] = useState<"day" | "week">("day")
  const [addOpen, setAddOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null)

  // New appointment form state
  const [newCustomer, setNewCustomer] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newService, setNewService] = useState("")
  const [newStylist, setNewStylist] = useState("Any Available")
  const [newTime, setNewTime] = useState("10:00 AM")
  const [newPrice, setNewPrice] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [isWalkIn, setIsWalkIn] = useState(false)

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const handleAddAppointment = () => {
    if (!newCustomer.trim()) return
    const newApt: Appointment = {
      id: Date.now().toString(),
      time: newTime,
      endTime: newTime, // simplified
      customer: newCustomer,
      phone: newPhone || null,
      service: newService,
      serviceList: newService ? [newService] : [],
      stylist: newStylist === "Any Available" ? "Any" : newStylist,
      status: isWalkIn ? "confirmed" : "pending",
      price: parseInt(newPrice) || 0,
      isWalkIn,
    }
    setAppointments((prev) => [...prev, newApt].sort((a, b) => a.time.localeCompare(b.time)))
    setAddOpen(false)
    setNewCustomer("")
    setNewPhone("")
    setNewService("")
    setNewPrice("")
    setNewNotes("")
  }

  const bookedCount = appointments.filter((a) => a.status !== "open" && a.status !== "cancelled").length
  const confirmedRevenue = appointments
    .filter((a) => a.status === "confirmed" || a.status === "completed")
    .reduce((sum, a) => sum + a.price, 0)
  const pendingCount = appointments.filter((a) => a.status === "pending").length

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your daily schedule</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 sm:p-4 rounded-xl bg-card/70 border border-border/20 text-center">
          <p className="text-lg font-bold text-foreground">{bookedCount}</p>
          <p className="text-[10px] text-muted-foreground">Booked</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-card/70 border border-border/20 text-center">
          <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-card/70 border border-border/20 text-center">
          <p className="text-lg font-bold text-primary">₹{confirmedRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Est. Revenue</p>
        </div>
      </div>

      {/* Date navigator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDayOffset((d) => d - 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-card border border-border/30 text-muted-foreground hover:text-foreground boty-transition"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDayOffset(0)}
            className="px-3 py-1.5 rounded-full bg-card border border-border/30 text-xs font-medium text-foreground hover:bg-muted/50 boty-transition"
          >
            {getDateLabel(dayOffset)}
          </button>
          <button
            type="button"
            onClick={() => setDayOffset((d) => d + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-card border border-border/30 text-muted-foreground hover:text-foreground boty-transition"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium boty-transition ${view === "day" ? "bg-background text-foreground boty-shadow" : "text-muted-foreground"}`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setView("week")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium boty-transition ${view === "week" ? "bg-background text-foreground boty-shadow" : "text-muted-foreground"}`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Appointments list */}
      <div className="space-y-2">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={`rounded-2xl border boty-transition ${
              apt.status === "open"
                ? "border-dashed border-border/40 bg-muted/20"
                : "border-border/20 bg-card/70 boty-shadow"
            }`}
          >
            {apt.status === "open" ? (
              <div className="flex items-center gap-4 p-4">
                <span className="text-sm font-medium text-muted-foreground w-20">{apt.time}</span>
                <span className="flex-1 text-sm text-muted-foreground italic">Slot Available</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setAddOpen(true); setNewTime(apt.time) }}
                  className="text-xs text-primary hover:text-primary"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Book
                </Button>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-center pt-0.5">
                    <p className="text-xs font-bold text-foreground">{apt.time}</p>
                    <p className="text-[10px] text-muted-foreground">{apt.endTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-sm text-foreground">{apt.customer}</span>
                      {apt.isWalkIn && (
                        <span className="text-[9px] uppercase tracking-wider bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded-full font-medium">
                          Walk-in
                        </span>
                      )}
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusConfig[apt.status].color}`}>
                        {statusConfig[apt.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Scissors className="w-3 h-3" />
                        {apt.service}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <UserCircle className="w-3 h-3" />
                        {apt.stylist}
                      </span>
                      {apt.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {apt.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-foreground">₹{apt.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Action buttons */}
                {(apt.status === "pending" || apt.status === "confirmed") && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
                    {apt.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(apt.id, "confirmed")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 boty-transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm
                      </button>
                    )}
                    {apt.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(apt.id, "completed")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 boty-transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setSelectedApt(apt); setRescheduleOpen(true) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border/30 text-muted-foreground rounded-lg text-xs font-medium hover:text-foreground boty-transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id, "no-show")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border/30 text-muted-foreground rounded-lg text-xs font-medium hover:text-foreground boty-transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      No-show
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id, "cancelled")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/5 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/10 boty-transition ml-auto"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Appointment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
              <input
                type="checkbox"
                id="walkIn"
                checked={isWalkIn}
                onChange={(e) => setIsWalkIn(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="walkIn" className="text-sm text-foreground font-medium cursor-pointer">
                Walk-in customer
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Customer Name *</label>
              <input
                type="text"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Service</label>
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger className="rounded-xl border-border/30 text-sm">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Stylist</label>
                <Select value={newStylist} onValueChange={setNewStylist}>
                  <SelectTrigger className="rounded-xl border-border/30 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {stylists.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Notes (optional)</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Allergies, preferences..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleAddAppointment}
              disabled={!newCustomer.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              {isWalkIn ? "Add Walk-in" : "Create Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Reschedule</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedApt?.customer} — {selectedApt?.service}</p>
          <div className="space-y-3 py-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">New Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">New Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground focus:outline-none focus:border-primary/50 boty-transition"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRescheduleOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setRescheduleOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
