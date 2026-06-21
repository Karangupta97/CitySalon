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
  X,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
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
  { id: "2", name: "Ananya Mehta", phone: "+91 76543 21098", totalSpent: 5600, visitCount: 5, lastVisit: "2026-06-08", notes: "Prefers morning slots only.", tag: "regular", preferredStylist: "Priya" },
  { id: "3", name: "Rohit Kapoor", phone: "+91 87654 32109", totalSpent: 2800, visitCount: 4, lastVisit: "2026-06-14", notes: "", tag: "regular", preferredStylist: "Raj" },
  { id: "4", name: "Deepa Nair", phone: "+91 54321 09876", email: "deepa@example.com", totalSpent: 8900, visitCount: 7, lastVisit: "2026-04-22", notes: "Sensitive scalp. Use sulphate-free products.", tag: "at-risk", preferredStylist: "Anita" },
  { id: "5", name: "Vikram Singh", phone: "+91 65432 10987", totalSpent: 3200, visitCount: 6, lastVisit: "2026-06-10", notes: "", tag: "regular", preferredStylist: "Meena" },
  { id: "6", name: "Kavya Reddy", phone: "+91 43210 98765", email: "kavya@example.com", totalSpent: 15600, visitCount: 12, lastVisit: "2026-06-15", notes: "VIP client. Always gets complementary chai.", tag: "vip", preferredStylist: "Meena" },
  { id: "7", name: "Suresh Menon", phone: "+91 32109 87654", totalSpent: 1200, visitCount: 2, lastVisit: "2026-03-18", notes: "", tag: "at-risk", preferredStylist: "Raj" },
  { id: "8", name: "Riya Bose", phone: "+91 21098 76543", email: "riya@example.com", totalSpent: 4500, visitCount: 4, lastVisit: "2026-05-29", notes: "Bridal booking in November.", tag: "regular", preferredStylist: "Anita" },
]

const tagConfig: Record<CustomerTag, { label: string; color: string; icon: React.ElementType }> = {
  vip: { label: "VIP guest", color: "text-[#C4A76C] bg-[#C4A76C]/10 border border-[#C4A76C]/25", icon: Crown },
  regular: { label: "Regular client", color: "text-[#3D5A3A] bg-[#3D5A3A]/8 border border-[#3D5A3A]/10", icon: UserCircle },
  "at-risk": { label: "At-risk", color: "text-red-600 bg-red-50 border border-red-100", icon: AlertCircle },
}

function daysSince(dateStr: string | null) {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState<CustomerTag | "all">("all")
  const [selected, setSelected] = useState<Customer | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editTag, setEditTag] = useState<CustomerTag>("regular")
  const [editOpen, setEditOpen] = useState(false)

  // AI Marketing Campaign Panel states
  const [aiTarget, setAiTarget] = useState<"at-risk" | "vip">("at-risk")
  const [aiPromo, setAiPromo] = useState<string>("Blowout & Wash")
  const [generating, setGenerating] = useState(false)
  const [generatedDraft, setGeneratedDraft] = useState("")
  const [draftCopied, setDraftCopied] = useState(false)

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
        if (a.tag === "vip" && b.tag !== "vip") return -1
        if (b.tag === "vip" && a.tag !== "vip") return 1
        return (b.lastVisit ?? "").localeCompare(a.lastVisit ?? "")
      })
  }, [customers, search, tagFilter])

  const openEdit = (c: Customer) => { setSelected(c); setEditNotes(c.notes); setEditTag(c.tag); setEditOpen(true) }
  const saveEdit = () => {
    if (!selected) return
    setCustomers((prev) => prev.map((c) => (c.id === selected.id ? { ...c, notes: editNotes, tag: editTag } : c)))
    setEditOpen(false)
  }

  const counts = {
    all: customers.length,
    vip: customers.filter((c) => c.tag === "vip").length,
    regular: customers.filter((c) => c.tag === "regular").length,
    "at-risk": customers.filter((c) => c.tag === "at-risk").length,
  }

  // AI Generation simulation
  const handleGenerateCampaign = () => {
    setGenerating(true)
    setGeneratedDraft("")
    setDraftCopied(false)

    setTimeout(() => {
      setGenerating(false)
      if (aiTarget === "at-risk") {
        setGeneratedDraft(
          `Hi Priya! It's been a while since your last booking with Meena at Radiance Studio. We miss you! Book a "${aiPromo}" this week and get a complementary luxury scalp treatment. Promo code: RADIANCE15. Book now: citysalon.in/b/radiance`
        )
      } else {
        setGeneratedDraft(
          `Hi Kavya! As one of our cherished VIPs at Radiance Studio, we're giving you priority access to Meena's schedule this weekend. Book a "${aiPromo}" and enjoy a complementary signature beverage + gold membership booster. Book now: citysalon.in/b/radiance`
        )
      }
    }, 1200)
  }

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft)
    setDraftCopied(true)
    setTimeout(() => setDraftCopied(false), 2000)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in">
      {/* Header */}
      <div className="border-b border-[#E2D9CE]/30 pb-4">
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Guest Directory</h1>
        <p className="text-sm font-sans text-[#6E6960] mt-1 font-medium">Manage client communications, notes, and CRM records</p>
      </div>

      {/* Grid: Left column CRM / Right column AI Marketing panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        
        {/* CRM Listings: Left Column (3 spans) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar and Filters */}
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D5A3A]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients by name, phone number, or email..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all shadow-xs"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" aria-label="Clear">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Segment Selector Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(["all", "vip", "regular", "at-risk"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTagFilter(t)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                    tagFilter === t
                      ? "bg-[#3D5A3A] text-[#FAFAF7] border-[#3D5A3A] shadow-md shadow-[#3D5A3A]/10 scale-[1.02]"
                      : "bg-white text-[#6E6960] border-[#E2D9CE]/60 hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/35"
                  }`}
                >
                  {t === "at-risk" ? "At-risk" : t}
                  <span className="ml-1.5 text-[9px] opacity-75 bg-[#E8E0D6]/60 text-[#3D5A3A] px-1.5 py-0.5 rounded font-sans">{counts[t]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Card list */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1.5 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E2D9CE]/50 shadow-xs">
                <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-400 opacity-40" />
                <p className="text-sm font-sans text-[#6E6960] italic">No guests matching your query were found.</p>
              </div>
            ) : (
              filtered.map((customer) => {
                const { label, color, icon: TagIcon } = tagConfig[customer.tag]
                const daysSinceLast = daysSince(customer.lastVisit)
                const initials = customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)

                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => openEdit(customer)}
                    className="w-full text-left p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs hover:shadow-md hover:border-[#3D5A3A]/30 hover:scale-[1.005] hover-glow transition-all duration-300 group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-[#E8E0D6]/50 border border-[#E2D9CE] flex items-center justify-center font-serif text-sm font-extrabold text-[#3D5A3A] shrink-0">
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#3D5A3A] transition-colors">{customer.name}</span>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${color}`}>
                            <TagIcon className="w-2.5 h-2.5" />
                            {label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap text-[11px] font-semibold text-[#6E6960] font-sans">
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#3D5A3A]" />{customer.phone}</span>
                          {customer.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#C4A76C]" />{customer.email}</span>}
                          {customer.preferredStylist && (
                            <span className="text-[10px] font-bold text-[#3D5A3A]/70 uppercase tracking-wide bg-[#3D5A3A]/5 px-1.5 py-0.5 rounded">
                              Prefers: {customer.preferredStylist}
                            </span>
                          )}
                        </div>

                        {customer.notes && (
                          <p className="text-[11px] text-gray-400 font-sans font-medium mt-2 flex items-start gap-1 bg-[#FAFAF7] border border-[#E2D9CE]/20 p-2 rounded-xl">
                            <StickyNote className="w-3.5 h-3.5 mt-0.5 text-[#C4A76C] shrink-0" />
                            <span className="truncate">{customer.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Metrics Block */}
                    <div className="flex items-center md:items-end justify-between md:flex-col gap-1 border-t border-[#E2D9CE]/30 md:border-t-0 pt-3 md:pt-0 shrink-0">
                      <div className="flex items-center gap-0.5 text-base font-extrabold text-[#3D5A3A] font-sans">
                        <IndianRupee className="w-3.5 h-3.5 text-[#C4A76C]" />
                        {customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">{customer.visitCount} visits</div>
                      {daysSinceLast !== null && (
                        <div className={`text-[10px] font-extrabold uppercase font-sans mt-0.5 ${daysSinceLast > 45 ? "text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md" : "text-[#3D5A3A]"}`}>
                          {daysSinceLast === 0 ? "Visited Today" : `${daysSinceLast} days ago`}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* AI Campaign Generator: Right Column (2 spans - Hackathon Feature!) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#3D5A3A]/10 via-[#3D5A3A]/3 to-[#C4A76C]/12 border border-[#E2D9CE]/55 shadow-xs flex flex-col justify-between h-fit hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2D9CE]/30 pb-3">
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${generating ? "bg-[#C4A76C]/20 text-[#C4A76C] animate-pulse" : "bg-[#3D5A3A]/10 text-[#3D5A3A]"}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A] tracking-wide">SMS Campaign Builder</h3>
            </div>

            <p className="text-[11px] text-[#6E6960] font-sans leading-relaxed">
              Auto-generate custom re-engagement templates to re-attract at-risk clients or reward VIP client loyalty.
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Select Target Segment */}
              <div>
                <label className="block text-[9px] font-bold text-[#3D5A3A] uppercase tracking-wider mb-1.5 font-sans">Segment Filter</label>
                <select
                  value={aiTarget}
                  onChange={(e) => setAiTarget(e.target.value as "at-risk" | "vip")}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2D9CE] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 font-sans cursor-pointer transition-colors hover:border-[#3D5A3A]/50"
                >
                  <option value="at-risk">At-Risk Guests (30+ days idle)</option>
                  <option value="vip">VIP Loyalty Circle</option>
                </select>
              </div>

              {/* Select Service Promotion */}
              <div>
                <label className="block text-[9px] font-bold text-[#3D5A3A] uppercase tracking-wider mb-1.5 font-sans">Featured Promotion</label>
                <select
                  value={aiPromo}
                  onChange={(e) => setAiPromo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#E2D9CE] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 font-sans cursor-pointer transition-colors hover:border-[#3D5A3A]/50"
                >
                  <option value="Hair Wash & Blowout">Hair Wash & Blowout Special</option>
                  <option value="Classic Skin Cleanup">Facial Spa & Cleanup Booster</option>
                  <option value="Bridal Trial Offer">Bridal Trial Consultation Package</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateCampaign}
              disabled={generating}
              className="w-full py-2.5 mt-2 bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-xs font-bold font-sans uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#3D5A3A]/10 border border-transparent disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {generating ? "Crafting Draft..." : "Generate Promo SMS"}
              {!generating && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {/* Generated Campaign Panel */}
            {generatedDraft && (
              <div className="mt-4 p-4 rounded-xl bg-[#FAFAF7] border border-[#E2D9CE]/60 animate-scale-fade-in relative group/draft">
                <p className="text-[9px] font-bold text-[#3D5A3A] uppercase tracking-wider mb-1 font-sans">Generated SMS Template</p>
                <p className="text-[11px] font-sans font-medium text-[#1A1A1A] leading-relaxed pr-6 select-all">
                  {generatedDraft}
                </p>
                
                <button
                  onClick={handleCopyDraft}
                  className="absolute top-3 right-3 text-[#3D5A3A] hover:text-[#2B3F29] transition-colors"
                  title="Copy to clipboard"
                  aria-label="Copy template"
                >
                  {draftCopied ? <ClipboardCheck className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4 opacity-75 hover:opacity-100" />}
                </button>
                {draftCopied && (
                  <span className="absolute bottom-2 right-3 text-[8px] font-bold uppercase tracking-widest text-white bg-[#3D5A3A] px-1.5 py-0.5 rounded">
                    Copied!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-[#E2D9CE]/50 bg-[#FAFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-extrabold text-[#3D5A3A]">{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#E2D9CE]/40 text-center">
                  <p className="text-base font-extrabold text-[#3D5A3A] font-sans">₹{selected.totalSpent.toLocaleString()}</p>
                  <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Spent</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2D9CE]/40 text-center">
                  <p className="text-base font-extrabold text-[#1A1A1A] font-sans">{selected.visitCount}</p>
                  <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Visits</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2D9CE]/40 text-center">
                  <p className="text-base font-extrabold text-[#1A1A1A] font-sans">
                    {daysSince(selected.lastVisit) !== null ? `${daysSince(selected.lastVisit)}d` : "—"}
                  </p>
                  <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Recency</p>
                </div>
              </div>

              <div className="space-y-2.5 bg-white/50 p-3.5 rounded-xl border border-[#E2D9CE]/30">
                <div className="flex items-center gap-2.5 text-xs text-[#6E6960] font-semibold font-sans">
                  <Phone className="w-4 h-4 text-[#3D5A3A]" />
                  <span>{selected.phone}</span>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2.5 text-xs text-[#6E6960] font-semibold font-sans border-t border-[#E2D9CE]/20 pt-2">
                    <Mail className="w-4 h-4 text-[#C4A76C]" />
                    <span>{selected.email}</span>
                  </div>
                )}
                {selected.lastVisit && (
                  <div className="flex items-center gap-2.5 text-xs text-[#6E6960] font-semibold font-sans border-t border-[#E2D9CE]/20 pt-2">
                    <Calendar className="w-4 h-4 text-[#3D5A3A]" />
                    <span>Last visit: {new Date(selected.lastVisit).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">Segment Tag</label>
                <Select value={editTag} onValueChange={(v) => setEditTag(v as CustomerTag)}>
                  <SelectTrigger className="rounded-xl border-[#E2D9CE] bg-white text-xs font-semibold text-[#1A1A1A] h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="vip">VIP client</SelectItem>
                    <SelectItem value="regular">Regular client</SelectItem>
                    <SelectItem value="at-risk">At-risk client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6E6960] uppercase tracking-wider mb-1.5">
                  Internal Notes <span className="text-gray-400 font-normal lowercase">(allergies, preferences)</span>
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Sensitive scalp, prefers dry styling..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9CE] text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#3D5A3A] focus:ring-2 focus:ring-[#3D5A3A]/10 transition-all font-sans resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl border-[#E2D9CE] text-[#6E6960] hover:bg-[#E8E0D6]/20 font-bold text-xs uppercase tracking-wider px-4">Cancel</Button>
            <Button onClick={saveEdit} className="bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-xl font-bold text-xs uppercase tracking-wider px-4 cursor-pointer shadow-md shadow-[#3D5A3A]/10">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
