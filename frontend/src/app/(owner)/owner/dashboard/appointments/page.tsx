"use client"

import { useState } from "react"
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
  LayoutGrid,
  Info,
  CalendarCheck,
  IndianRupee,
  Armchair,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show" | "open" | "in-progress"

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
  notes?: string
}

const initialAppointments: Appointment[] = [
  { id: "1", time: "10:00 AM", endTime: "11:30 AM", customer: "Priya Sharma", phone: "+91 98765 43210", service: "Haircut + Colour", serviceList: ["Haircut", "Hair Colour"], stylist: "Meena", status: "confirmed", price: 1800 },
  { id: "2", time: "11:30 AM", endTime: "12:00 PM", customer: "Rohit Kapoor", phone: "+91 87654 32109", service: "Beard Trim", serviceList: ["Beard Trim"], stylist: "Raj", status: "in-progress", price: 350 },
  { id: "3", time: "01:00 PM", endTime: "02:00 PM", customer: null, phone: null, service: null, serviceList: [], stylist: null, status: "open", price: 0 },
  { id: "4", time: "02:00 PM", endTime: "03:30 PM", customer: "Ananya Mehta", phone: "+91 76543 21098", service: "Facial + Cleanup", serviceList: ["Facial", "Cleanup"], stylist: "Priya", status: "pending", price: 1200 },
  { id: "5", time: "03:30 PM", endTime: "04:30 PM", customer: "Vikram Singh", phone: "+91 65432 10987", service: "Hair Wash + Style", serviceList: ["Hair Wash", "Styling"], stylist: "Meena", status: "confirmed", price: 750 },
  { id: "6", time: "05:00 PM", endTime: "06:00 PM", customer: "Deepa Nair", phone: "+91 54321 09876", service: "Manicure + Pedicure", serviceList: ["Manicure", "Pedicure"], stylist: "Anita", status: "confirmed", price: 900 },
]

const stylists = ["Any Available", "Meena", "Raj", "Priya", "Anita", "Vikram"]
const services = ["Haircut", "Hair Colour", "Beard Trim", "Facial", "Cleanup", "Manicure", "Pedicure", "Hair Wash", "Styling", "Blowout", "Bridal Makeup"]

const statusConfig: Record<AppointmentStatus, { label: string; color: string; indicator: string }> = {
  confirmed: { label: "Confirmed", color: "text-[#3D5A3A] bg-[#3D5A3A]/5 border border-[#3D5A3A]/10", indicator: "bg-[#3D5A3A]" },
  "in-progress": { label: "Active", color: "text-[#C4A76C] bg-[#C4A76C]/5 border border-[#C4A76C]/20", indicator: "bg-[#C4A76C]" },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-50/50 border border-amber-100/60", indicator: "bg-amber-500" },
  completed: { label: "Completed", color: "text-emerald-700 bg-emerald-50/50 border border-emerald-100/60", indicator: "bg-emerald-600" },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50/50 border border-red-100/60", indicator: "bg-red-500" },
  "no-show": { label: "No-show", color: "text-[#6E6960] bg-gray-50 border border-gray-200/60", indicator: "bg-gray-400" },
  open: { label: "Open Slot", color: "text-gray-400 bg-gray-50 border border-dashed border-gray-200", indicator: "bg-gray-300" },
}

const getDateLabel = (offset: number) => {
  if (offset === 0) return "Today"
  if (offset === 1) return "Tomorrow"
  if (offset === -1) return "Yesterday"
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [dayOffset, setDayOffset] = useState(0)
  const [view, setView] = useState<"list" | "floor">("list")
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
      endTime: newTime,
      customer: newCustomer,
      phone: newPhone || null,
      service: newService,
      serviceList: newService ? [newService] : [],
      stylist: newStylist === "Any Available" ? "Any" : newStylist,
      status: isWalkIn ? "confirmed" : "pending",
      price: parseInt(newPrice) || 0,
      isWalkIn,
      notes: newNotes,
    }
    setAppointments((prev) => [...prev, newApt].sort((a, b) => a.time.localeCompare(b.time)))
    setAddOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewCustomer("")
    setNewPhone("")
    setNewService("")
    setNewPrice("")
    setNewNotes("")
    setIsWalkIn(false)
  }

  const bookedCount = appointments.filter((a) => a.status !== "open" && a.status !== "cancelled").length
  const confirmedRevenue = appointments
    .filter((a) => a.status === "confirmed" || a.status === "completed" || a.status === "in-progress")
    .reduce((sum, a) => sum + a.price, 0)
  const pendingCount = appointments.filter((a) => a.status === "pending").length

  const stations = [
    { id: "chair1", type: "Chair 1", assignedTo: "Meena", icon: Armchair },
    { id: "chair2", type: "Chair 2", assignedTo: "Raj", icon: Armchair },
    { id: "chair3", type: "Chair 3", assignedTo: "Anita", icon: Armchair },
    { id: "wash1", type: "Wash Station 1", assignedTo: "Vikram", icon: Armchair },
    { id: "facial1", type: "Facial Bed 1", assignedTo: "Priya", icon: Armchair },
    { id: "nails1", type: "Nail Desk 1", assignedTo: "Anita", icon: Armchair },
  ]

  const getStationOccupant = (stylist: string) => {
    return appointments.find(
      (a) => a.stylist?.toLowerCase() === stylist.toLowerCase() && (a.status === "confirmed" || a.status === "in-progress")
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-blur-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3D5A3A] tracking-tight">Appointments</h1>
          <p className="text-xs text-[#6E6960] mt-1 font-semibold">Manage daily schedules and physical workstation seatings</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-[#3D5A3A] text-white hover:bg-[#2B3F29] rounded-lg px-4 py-2 h-9 font-semibold text-xs tracking-wider cursor-pointer shadow-xs border border-transparent"
        >
          Add Booking
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs text-center flex flex-col items-center justify-center">
          <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">{bookedCount}</p>
          <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider mt-0.5">Bookings</p>
        </div>
        
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs text-center flex flex-col items-center justify-center">
          <p className="text-xl font-extrabold text-[#C4A76C] tracking-tight">{pendingCount}</p>
          <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider mt-0.5">Pending</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs text-center flex flex-col items-center justify-center">
          <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">₹{confirmedRevenue.toLocaleString()}</p>
          <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider mt-0.5">Revenue Est.</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDayOffset((d) => d - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-[#E2D9CE]/60 text-[#3D5A3A] hover:bg-[#E8E0D6]/20 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDayOffset(0)}
            className="px-3 py-1.5 h-8 rounded-lg bg-white border border-[#E2D9CE]/60 text-[10px] font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20 uppercase tracking-wider"
          >
            {getDateLabel(dayOffset)}
          </button>
          <button
            type="button"
            onClick={() => setDayOffset((d) => d + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-[#E2D9CE]/60 text-[#3D5A3A] hover:bg-[#E8E0D6]/20 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggles */}
        <div className="flex items-center bg-[#E8E0D6]/30 rounded-lg p-1 border border-[#E2D9CE]/40 shadow-xs">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              view === "list"
                ? "bg-[#3D5A3A] text-white shadow-xs"
                : "text-[#6E6960] hover:text-[#3D5A3A]"
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setView("floor")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              view === "floor"
                ? "bg-[#3D5A3A] text-white shadow-xs"
                : "text-[#6E6960] hover:text-[#3D5A3A]"
            }`}
          >
            Floor Map
          </button>
        </div>
      </div>

      {/* List Layout View */}
      {view === "list" && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1.5 scrollbar-thin">
          {appointments.map((apt) => {
            const isOpen = apt.status === "open"
            const initials = apt.customer ? apt.customer.split(" ").map((n) => n[0]).join("") : ""

            return (
              <div
                key={apt.id}
                className={`rounded-xl transition-all duration-200 ${
                  isOpen
                    ? "border border-dashed border-[#E2D9CE]/60 bg-white/30 p-3.5 flex items-center justify-between"
                    : "border border-[#E2D9CE]/40 bg-white p-4 shadow-xs hover:border-[#3D5A3A]/30"
                }`}
              >
                {isOpen ? (
                  <>
                    <div className="flex items-center gap-3.5">
                      <div className="text-[10px] font-bold text-[#6E6960]/80 w-16">
                        {apt.time}
                      </div>
                      <span className="text-xs font-semibold text-[#6E6960]/65 italic">Vacant time slot</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setAddOpen(true); setNewTime(apt.time) }}
                      className="text-xs font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20 rounded-lg px-3 py-1"
                    >
                      Book Slot
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Initials avatar wrapper */}
                      <div className="w-9 h-9 rounded-lg bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 flex items-center justify-center text-xs font-bold text-[#3D5A3A] shrink-0 font-serif">
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-serif text-sm font-bold text-[#1A1A1A]">{apt.customer}</span>
                          {apt.isWalkIn && (
                            <span className="text-[8px] font-bold uppercase tracking-widest bg-[#C4A76C]/10 text-[#C4A76C] px-1.5 py-0.5 rounded border border-[#C4A76C]/10">
                              Walk-in
                            </span>
                          )}
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusConfig[apt.status].color}`}>
                            {statusConfig[apt.status].label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5 flex-wrap text-[10px] font-semibold text-[#6E6960]">
                          <span className="flex items-center gap-1"><Scissors className="w-3.5 h-3.5 text-[#3D5A3A]/70" />{apt.service}</span>
                          <span className="flex items-center gap-1"><UserCircle className="w-3.5 h-3.5 text-[#C4A76C]" />{apt.stylist}</span>
                          {apt.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#3D5A3A]/70" />{apt.phone}</span>}
                          <span className="text-[#C4A76C]">{apt.time} - {apt.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center md:items-end justify-between md:flex-col gap-2.5 pt-2.5 md:pt-0 border-t border-[#E2D9CE]/20 md:border-t-0 flex-wrap">
                      <p className="text-sm font-bold text-[#1a1a1a]">₹{apt.price.toLocaleString()}</p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {apt.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(apt.id, "confirmed")}
                            className="px-2.5 py-1 bg-white border border-[#E2D9CE] text-[#3D5A3A] hover:bg-[#3D5A3A]/5 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(apt.id, "completed")}
                            className="px-2.5 py-1 bg-[#3D5A3A]/5 border border-[#3D5A3A]/25 text-[#3D5A3A] hover:bg-[#3D5A3A]/10 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => { setSelectedApt(apt); setRescheduleOpen(true) }}
                          className="px-2.5 py-1 bg-white border border-[#E2D9CE] text-[#6E6960] hover:text-[#3D5A3A] rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(apt.id, "no-show")}
                          className="px-2.5 py-1 bg-white border border-[#E2D9CE] text-[#6E6960] hover:text-[#3D5A3A] rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          No-show
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(apt.id, "cancelled")}
                          className="px-2.5 py-1 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Blueprint Floor Map View */}
      {view === "floor" && (
        <div className="p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2D9CE]/20">
            <Info className="w-3.5 h-3.5 text-[#C4A76C]" />
            <p className="text-[11px] text-[#6E6960] font-medium leading-none">
              Station occupancy visualizer. Click on vacant slots to assign a live schedule booking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((st) => {
              const occupant = getStationOccupant(st.assignedTo)

              return (
                <div
                  key={st.id}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between h-36 ${
                    occupant
                      ? "bg-white border-[#3D5A3A]/40 shadow-xs"
                      : "bg-[#FAFAF7]/30 border-dashed border-[#E2D9CE] hover:border-[#3D5A3A]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[#C4A76C] uppercase tracking-wider">{st.type}</span>
                      <p className="text-[10px] text-[#6E6960] font-semibold uppercase mt-0.5">{st.assignedTo}</p>
                    </div>
                    <div className={`w-7 h-7 rounded border flex items-center justify-center ${
                      occupant ? "bg-[#3D5A3A]/5 text-[#3D5A3A] border-[#3D5A3A]/20" : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}>
                      <Armchair className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {occupant ? (
                    <div className="bg-[#FAFAF7] p-2 rounded border border-[#E2D9CE]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-serif font-bold text-[#1A1A1A]">{occupant.customer}</span>
                        <span className="text-[8px] font-bold bg-[#C4A76C]/10 text-[#C4A76C] px-1 rounded">
                          {occupant.time}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#6E6960] font-medium truncate mt-0.5">{occupant.service}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setAddOpen(true); setNewStylist(st.assignedTo) }}
                      className="w-full py-2 border border-dashed border-[#E2D9CE] hover:border-[#3D5A3A] rounded-lg text-[9px] text-[#6E6960] hover:text-[#3D5A3A] font-bold uppercase tracking-wider transition-colors cursor-pointer bg-white"
                    >
                      Assign Slot
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Appointment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-[#3D5A3A]">Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-[#E2D9CE]/50">
              <input
                type="checkbox"
                id="walkIn"
                checked={isWalkIn}
                onChange={(e) => setIsWalkIn(e.target.checked)}
                className="accent-[#3D5A3A] w-3.5 h-3.5 rounded"
              />
              <label htmlFor="walkIn" className="text-[9px] text-[#1A1A1A] font-bold uppercase tracking-wider cursor-pointer">
                Register Walk-in Guest
              </label>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Customer Name *</label>
              <input
                type="text"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                placeholder="Full name"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Service</label>
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger className="rounded-lg border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Stylist</label>
                <Select value={newStylist} onValueChange={setNewStylist}>
                  <SelectTrigger className="rounded-lg border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {stylists.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setAddOpen(false)} className="rounded-lg border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-3 h-9">
              Cancel
            </Button>
            <Button
              onClick={handleAddAppointment}
              disabled={!newCustomer.trim()}
              className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-lg font-bold text-xs uppercase tracking-wider px-4 cursor-pointer h-9 border border-transparent shadow-xs"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-sm rounded-xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-[#3D5A3A]">Reschedule</DialogTitle>
          </DialogHeader>
          <p className="text-[10px] text-[#6E6960] font-bold uppercase tracking-wider">
            {selectedApt?.customer} — <span className="text-[#C4A76C]">{selectedApt?.service}</span>
          </p>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">New Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-[#6E6960] uppercase tracking-wider mb-1">New Time</label>
              <input
                type="time"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setRescheduleOpen(false)} className="rounded-lg border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-3 h-9">Cancel</Button>
            <Button onClick={() => setRescheduleOpen(false)} className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-lg font-bold text-xs uppercase tracking-wider px-4 cursor-pointer h-9 border border-transparent shadow-xs">
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
