"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Crown,
  AlertCircle,
  UserCircle,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  StickyNote,
  ChevronDown,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CustomerTag = "vip" | "regular" | "at-risk"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalSpent: number
  visitCount: number
  lastVisit: string | null
  notes: string
  tag: CustomerTag
  preferredStylist?: string
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@example.com", totalSpent: 12400, visitCount: 8, lastVisit: "2026-06-12", notes: "Prefers Meena for blowouts. Allergic to ammonia.", tag: "vip", preferredStylist: "Meena" },
  { id: "2", name: "Ananya Mehta", phone: "+91 76543 21098", email: "", totalSpent: 5600, visitCount: 5, lastVisit: "2026-06-08", notes: "Prefers morning slots only.", tag: "regular" },
  { id: "3", name: "Rohit Kapoor", phone: "+91 87654 32109", email: "", totalSpent: 2800, visitCount: 4, lastVisit: "2026-06-14", notes: "", tag: "regular", preferredStylist: "Raj" },
  { id: "4", name: "Deepa Nair", phone: "+91 54321 09876", email: "deepa@example.com", totalSpent: 8900, visitCount: 7, lastVisit: "2026-04-22", notes: "Sensitive scalp. Use sulphate-free products.", tag: "at-risk" },
  { id: "5", name: "Vikram Singh", phone: "+91 65432 10987", email: "", totalSpent: 3200, visitCount: 6, lastVisit: "2026-06-10", notes: "", tag: "regular" },
  { id: "6", name: "Kavya Reddy", phone: "+91 43210 98765", email: "kavya@example.com", totalSpent: 15600, visitCount: 12, lastVisit: "2026-06-15", notes: "VIP client. Always gets complementary chai.", tag: "vip" },
  { id: "7", name: "Suresh Menon", phone: "+91 32109 87654", email: "", totalSpent: 1200, visitCount: 2, lastVisit: "2026-03-18", notes: "", tag: "at-risk" },
  { id: "8", name: "Riya Bose", phone: "+91 21098 76543", email: "riya@example.com", totalSpent: 4500, visitCount: 4, lastVisit: "2026-05-29", notes: "Bridal booking in November.", tag: "regular" },
]

const tagConfig: Record<CustomerTag, { label: string; color: string; icon: React.ElementType }> = {
  vip: { label: "VIP", color: "text-amber-700 bg-amber-50", icon: Crown },
  regular: { label: "Regular", color: "text-primary bg-primary/10", icon: UserCircle },
  "at-risk": { label: "At-risk", color: "text-destructive bg-destructive/10", icon: AlertCircle },
}

function daysSince(dateStr: string | null) {
  if (!dateStr) return null
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  return days
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState<CustomerTag | "all">("all")
  const [selected, setSelected] = useState<Customer | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editTag, setEditTag] = useState<CustomerTag>("regular")
  const [editOpen, setEditOpen] = useState(false)

  const filtered = useMemo(() => {
    return customers
      .filter((c) => {
        if (tagFilter !== "all" && c.tag !== tagFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q)
        }
        return true
      })
      .sort((a, b) => {
        // VIP first, then by last visit
        if (a.tag === "vip" && b.tag !== "vip") return -1
        if (b.tag === "vip" && a.tag !== "vip") return 1
        return (b.lastVisit ?? "").localeCompare(a.lastVisit ?? "")
      })
  }, [customers, search, tagFilter])

  const openEdit = (c: Customer) => {
    setSelected(c)
    setEditNotes(c.notes)
    setEditTag(c.tag)
    setEditOpen(true)
  }

  const saveEdit = () => {
    if (!selected) return
    setCustomers((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, notes: editNotes, tag: editTag } : c))
    )
    setEditOpen(false)
  }

  const counts = {
    all: customers.length,
    vip: customers.filter((c) => c.tag === "vip").length,
    regular: customers.filter((c) => c.tag === "regular").length,
    "at-risk": customers.filter((c) => c.tag === "at-risk").length,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your salon&apos;s CRM — every customer, every visit</p>
      </div>

      {/* Tag filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "vip", "regular", "at-risk"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTagFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium boty-transition capitalize ${
              tagFilter === t
                ? "bg-primary text-primary-foreground"
                : "bg-card/70 text-muted-foreground border border-border/30 hover:text-foreground"
            }`}
          >
            {t === "at-risk" ? "At-risk" : t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="ml-1.5 text-[9px] opacity-70">{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Customer cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No customers found</p>
          </div>
        ) : (
          filtered.map((customer) => {
            const { label, color, icon: TagIcon } = tagConfig[customer.tag]
            const daysSinceLast = daysSince(customer.lastVisit)
            return (
              <button
                key={customer.id}
                type="button"
                onClick={() => openEdit(customer)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-card/70 border border-border/20 hover:border-primary/30 boty-shadow boty-transition group"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-sm text-foreground">{customer.name}</span>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${color}`}>
                        <TagIcon className="w-2.5 h-2.5" />
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </span>
                      {customer.email && (
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </span>
                      )}
                    </div>
                    {customer.notes && (
                      <p className="text-[11px] text-muted-foreground mt-1.5 flex items-start gap-1">
                        <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{customer.notes}</span>
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm font-bold text-primary">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {customer.totalSpent.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {customer.visitCount} visits
                    </div>
                    {daysSinceLast !== null && (
                      <div className={`text-[10px] font-medium ${daysSinceLast > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                        {daysSinceLast === 0 ? "Today" : `${daysSinceLast}d ago`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile stats */}
                <div className="sm:hidden flex items-center gap-4 mt-3 pt-3 border-t border-border/20">
                  <span className="flex items-center gap-1 text-xs font-bold text-primary">
                    <IndianRupee className="w-3 h-3" />
                    {customer.totalSpent.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{customer.visitCount} visits</span>
                  {daysSinceLast !== null && (
                    <span className={`text-xs ${daysSinceLast > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                      Last: {daysSinceLast === 0 ? "Today" : `${daysSinceLast}d ago`}
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Edit customer dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 text-center">
                  <p className="text-base font-bold text-primary">₹{selected.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Total Spent</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 text-center">
                  <p className="text-base font-bold text-foreground">{selected.visitCount}</p>
                  <p className="text-[10px] text-muted-foreground">Visits</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 text-center">
                  <p className="text-base font-bold text-foreground">
                    {daysSince(selected.lastVisit) !== null ? `${daysSince(selected.lastVisit)}d` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Last Visit</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{selected.phone}</span>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{selected.email}</span>
                  </div>
                )}
                {selected.lastVisit && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Last visit: {new Date(selected.lastVisit).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                )}
              </div>

              {/* Tag */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Customer Tag</label>
                <Select value={editTag} onValueChange={(v) => setEditTag(v as CustomerTag)}>
                  <SelectTrigger className="rounded-xl border-border/30 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="vip">⭐ VIP</SelectItem>
                    <SelectItem value="regular">👤 Regular</SelectItem>
                    <SelectItem value="at-risk">⚠️ At-risk (60+ days inactive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Notes <span className="text-muted-foreground font-normal">(allergies, preferences, etc.)</span>
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Allergic to ammonia, prefers Meena for blowouts..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-card/70 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 boty-transition resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={saveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
