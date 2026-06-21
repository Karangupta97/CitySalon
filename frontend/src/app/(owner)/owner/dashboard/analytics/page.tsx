"use client"

import React, { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Calendar as CalendarIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CreditCard,
  Percent,
  Clock,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { format, subDays, startOfWeek, endOfWeek, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"

import { getAnalyticsData, AnalyticsDataset, RecentBookingData } from "@/lib/mockAnalytics"
import { ChartCard } from "@/components/owner/ChartCard"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ─── Custom Tooltip for Recharts (Linear/Stripe Dark Style) ───
const DarkChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-lg shadow-xl text-xs font-mono select-none">
        <p className="font-semibold mb-1 text-slate-400 border-b border-slate-800 pb-1">{label}</p>
        <div className="space-y-1 mt-1.5">
          {payload.map((item: any, idx: number) => {
            const isRev = item.name.toLowerCase().includes("revenue")
            const displayVal = isRev ? `₹${item.value.toLocaleString("en-IN")}` : item.value
            return (
              <div key={idx} className="flex justify-between items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                  {item.name}:
                </span>
                <span className="font-bold text-slate-100">{displayVal}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)

  // Selector States
  const [period, setPeriod] = useState<"day" | "week" | "month" | "quarter" | "year" | "festival" | "custom">("month")
  const [subOption, setSubOption] = useState<string>("Q2") // For Quarter (Q1-Q4) or Festival (diwali, etc)
  const [singleDate, setSingleDate] = useState<Date>(new Date()) // For Day picker
  const [selectedWeekDate, setSelectedWeekDate] = useState<Date>(new Date()) // For Week picker
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM")) // For Month selector
  const [selectedYear, setSelectedYear] = useState<string>("2026") // For Year selector
  
  // Custom Date Range State
  const [customRange, setCustomRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  })

  // Chart Metric Mode: "both" | "revenue" | "bookings"
  const [chartMode, setChartMode] = useState<"both" | "revenue" | "bookings">("both")

  // Heatmap interactive state
  const [hoveredHeatmap, setHoveredHeatmap] = useState<{ day: string; hour: number; bookings: number } | null>(null)

  // Booking search & pagination
  const [bookingSearch, setBookingSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Trigger mounts to prevent server-side mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  // Resolve dynamic subOption/range args based on selector settings
  const getSelectedParams = () => {
    switch (period) {
      case "day":
        return { sub: format(singleDate, "yyyy-MM-dd") }
      case "week": {
        const start = startOfWeek(selectedWeekDate, { weekStartsOn: 1 })
        return { sub: format(start, "yyyy-MM-dd") }
      }
      case "month":
        return { sub: selectedMonth }
      case "quarter":
        return { sub: subOption }
      case "year":
        return { sub: selectedYear }
      case "festival":
        return { sub: subOption }
      case "custom":
        return { range: { start: customRange?.from, end: customRange?.to } }
      default:
        return {}
    }
  }

  const { sub, range } = getSelectedParams()
  const data: AnalyticsDataset = getAnalyticsData(period, sub, range)

  // Reset pagination on filter search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [bookingSearch, period, subOption, singleDate, selectedWeekDate, selectedMonth, selectedYear, customRange])

  if (!mounted) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-[#3D5A3A] animate-spin" />
      </div>
    )
  }

  // Filter bookings
  const filteredBookings = data.recentBookings.filter(b => 
    b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.service.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.stylist.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.id.toLowerCase().includes(bookingSearch.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage))
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Dynamic funnel values matching totalBookings
  const totalBks = data.kpis.totalBookings.value.replace(/,/g, "")
  const totalBksNum = parseInt(totalBks) || 120

  const funnelSteps = [
    { name: "1. Profile Visitors", count: Math.round(totalBksNum * 5.2), pct: 100, label: "Initial discovery" },
    { name: "2. Checked Calendar", count: Math.round(totalBksNum * 2.8), pct: Math.round((2.8 / 5.2) * 100), label: "Intent to book" },
    { name: "3. Initiated Booking", count: Math.round(totalBksNum * 1.4), pct: Math.round((1.4 / 5.2) * 100), label: "Checkout loaded" },
    { name: "4. Completed Booking", count: totalBksNum, pct: Math.round((1.0 / 5.2) * 100), label: "Success rate" },
    { name: "5. Rebooked / Loyal", count: Math.round(totalBksNum * (parseFloat(data.kpis.repeatCustomerRate.value) / 100)), pct: Math.round(((totalBksNum * (parseFloat(data.kpis.repeatCustomerRate.value) / 100)) / (totalBksNum * 5.2)) * 100), label: "LTV retention" }
  ]

  // Render Status Badge helper
  const getStatusBadge = (status: RecentBookingData["status"]) => {
    switch (status) {
      case "completed":
        return <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">COMPLETED</span>
      case "confirmed":
        return <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#3D5A3A]/20 bg-[#3D5A3A]/5 text-[#3D5A3A]">CONFIRMED</span>
      case "pending":
        return <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700">PENDING</span>
      case "cancelled":
        return <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-red-100 bg-red-50 text-red-600">CANCELLED</span>
      case "no-show":
        return <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-stone-200 bg-stone-100 text-stone-600">NO SHOW</span>
    }
  }

  // Set default sub-option on period changes
  const handlePeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod)
    if (newPeriod === "quarter") {
      setSubOption("Q2")
    } else if (newPeriod === "festival") {
      setSubOption("diwali")
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in select-none">
      
      {/* ─── Header & Date Controls ─── */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 border-b border-[#E2D9CE]/30 pb-5">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-xs font-sans text-[#6E6960] mt-1.5 font-semibold leading-relaxed">
            Industrial-grade salon operations audit. Currently displaying:{" "}
            <span className="text-[#3D5A3A] font-bold underline font-mono">{data.periodLabel}</span>
          </p>
        </div>

        {/* ─── Unified Period Picker Bar ─── */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Segmented Control */}
          <div className="flex items-center bg-[#E8E0D6]/30 rounded-lg p-0.5 border border-[#E2D9CE]/45 shadow-xs">
            {(["day", "week", "month", "quarter", "year", "festival", "custom"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodChange(p)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  period === p
                    ? "bg-[#3D5A3A] text-white shadow-xs"
                    : "text-[#6E6960] hover:text-[#3D5A3A]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Contextual Sub-Pickers based on selection */}
          <div className="flex items-center">
            
            {/* Day Sub-picker */}
            {period === "day" && (
              <input
                type="date"
                value={format(singleDate, "yyyy-MM-dd")}
                onChange={(e) => e.target.value && setSingleDate(new Date(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-[#E2D9CE]/40 rounded-lg text-xs font-mono font-bold text-[#3D5A3A] focus:outline-none focus:border-[#3D5A3A]/60"
              />
            )}

            {/* Week Sub-picker */}
            {period === "week" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-[#E2D9CE]/40 text-xs font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                    Week of {format(selectedWeekDate, "MMM d")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedWeekDate}
                    onSelect={(date) => date && setSelectedWeekDate(date)}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Month Sub-picker */}
            {period === "month" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-[#E2D9CE]/40 rounded-lg text-xs font-mono font-bold text-[#3D5A3A] focus:outline-none focus:border-[#3D5A3A]/60"
              />
            )}

            {/* Quarter Sub-picker */}
            {period === "quarter" && (
              <div className="flex items-center bg-[#E8E0D6]/20 rounded-lg p-0.5 border border-[#E2D9CE]/30">
                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSubOption(q)}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-extrabold uppercase transition-all ${
                      subOption === q ? "bg-[#3D5A3A] text-white" : "text-[#6E6960] hover:text-[#3D5A3A]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Year Sub-picker */}
            {period === "year" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-[#E2D9CE]/40 rounded-lg text-xs font-sans font-bold text-[#3D5A3A] focus:outline-none cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            )}

            {/* Festival Sub-picker */}
            {period === "festival" && (
              <select
                value={subOption}
                onChange={(e) => setSubOption(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-[#E2D9CE]/40 rounded-lg text-xs font-sans font-bold text-[#3D5A3A] focus:outline-none cursor-pointer"
              >
                <option value="diwali">Diwali (Oct-Nov)</option>
                <option value="eid">Eid Festive Week</option>
                <option value="christmas">Christmas & New Year</option>
                <option value="wedding">Wedding Peak Season</option>
                <option value="holi">Holi Spikes</option>
              </select>
            )}

            {/* Custom Sub-picker */}
            {period === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-[#E2D9CE]/40 text-xs font-mono font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                    {customRange?.from ? (
                      customRange.to ? (
                        <>
                          {format(customRange.from, "MMM d, yy")} – {format(customRange.to, "MMM d, yy")}
                        </>
                      ) : (
                        format(customRange.from, "MMM d, yy")
                      )
                    ) : (
                      "Select Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={customRange}
                    onSelect={setCustomRange}
                    numberOfMonths={2}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}

          </div>

        </div>
      </div>

      {/* ─── KPI Row (6 Cards with Sparklines) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {(Object.keys(data.kpis) as Array<keyof typeof data.kpis>).map((key) => {
          const kpi = data.kpis[key]
          const isUp = kpi.trend === "up"
          
          // Color coding logic: for cancellation rate, down is positive (Emerald), up is negative (Rose)
          const isPositiveTrend = kpi.isNegativeBetter ? !isUp : isUp
          
          // Sparkline color config
          const strokeColor = isPositiveTrend ? "#10b981" : "#f43f5e"
          
          // Sparkline dataset mapping
          const sparklineData = kpi.sparkline.map((val, idx) => ({ id: idx, value: val }))

          return (
            <div
              key={key}
              className="p-4 rounded-xl bg-white border border-[#E2D9CE]/45 hover:border-[#3D5A3A]/30 transition-all duration-200 flex flex-col justify-between h-[125px] overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans truncate pr-2">
                  {kpi.label}
                </span>
                
                {/* Arrow Badge */}
                <span
                  className={cn(
                    "text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                    isPositiveTrend ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  )}
                >
                  {isPositiveTrend ? (
                    <TrendingUpIcon className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDownIcon className="w-2.5 h-2.5" />
                  )}
                  {kpi.change}
                </span>
              </div>

              {/* Stat Value */}
              <div className="mt-1">
                <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight font-mono tabular-nums leading-none">
                  {kpi.value}
                </p>
                <p className="text-[8px] text-[#6E6960] font-sans font-medium mt-1">
                  Prev: <span className="font-mono">{kpi.prevValue}</span>
                </p>
              </div>

              {/* Sparkline Visual */}
              <div className="h-6 w-full mt-2 -mx-1 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      fill={`url(#grad-${key})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>
          )
        })}
      </div>

      {/* ─── Primary Trend Chart (Full width, reusable Wrapper) ─── */}
      <ChartCard
        title="Revenue & Booking Trends"
        subtitle="Historical financial audit and transaction metrics across the selected interval"
        headerActions={
          <div className="flex items-center bg-[#E8E0D6]/20 rounded-lg p-0.5 border border-[#E2D9CE]/30">
            {(["both", "revenue", "bookings"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setChartMode(m)}
                className={`px-3 py-1 rounded-md text-[9px] font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  chartMode === m ? "bg-[#3D5A3A] text-white" : "text-[#6E6960] hover:text-[#3D5A3A]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-[300px] w-full mt-2 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D5A3A" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#3D5A3A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="primaryBookingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7A9A6D" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#7A9A6D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                axisLine={false}
                tickLine={false}
              />
              {/* Dual Axes */}
              {(chartMode === "both" || chartMode === "revenue") && (
                <YAxis
                  yAxisId="rev"
                  orientation="left"
                  tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
              )}
              {(chartMode === "both" || chartMode === "bookings") && (
                <YAxis
                  yAxisId="bks"
                  orientation={chartMode === "bookings" ? "left" : "right"}
                  tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                  axisLine={false}
                  tickLine={false}
                />
              )}
              
              <Tooltip content={<DarkChartTooltip />} />

              {/* Revenue Area */}
              {(chartMode === "both" || chartMode === "revenue") && (
                <Area
                  yAxisId="rev"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3D5A3A"
                  fill="url(#primaryRevenueGrad)"
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
              )}

              {/* Bookings Area */}
              {(chartMode === "both" || chartMode === "bookings") && (
                <Area
                  yAxisId="bks"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#7A9A6D"
                  fill="url(#primaryBookingsGrad)"
                  strokeWidth={2}
                  name="Bookings"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ─── Secondary Widgets Rows ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Service division (Bar Chart) */}
        <div className="xl:col-span-4">
          <ChartCard
            title="Service Revenue Breakdown"
            subtitle="Bookings and cash share split by catalog items"
          >
            <div className="h-[240px] w-full mt-4 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topServices} layout="vertical" margin={{ top: 0, right: 5, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.3} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#6E6960" }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10, fill: "#1A1A1A", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<DarkChartTooltip />} />
                  <Bar dataKey="revenue" fill="#3D5A3A" radius={[0, 4, 4, 0]} name="Revenue (₹)" maxBarSize={14}>
                    {data.topServices.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Color indicators */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E2D9CE]/30">
              {data.topServices.slice(0, 4).map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-semibold text-[#6E6960] truncate">{s.name}</span>
                  <span className="text-[10px] font-bold text-[#1A1A1A] ml-auto font-mono">₹{(s.revenue / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Peak Hours Heatmap (Custom CSS grid representing Mon-Sun, 9AM to 8PM) */}
        <div className="xl:col-span-8">
          <ChartCard
            title="Weekly Traffic Heatmap"
            subtitle="Hourly booking distribution audit. Peak periods fade to deep Olive"
            headerActions={
              <div className="h-5 flex items-center justify-end">
                {hoveredHeatmap ? (
                  <span className="text-[10px] text-[#3D5A3A] font-extrabold font-mono bg-[#3D5A3A]/5 border border-[#3D5A3A]/20 px-2 py-0.5 rounded">
                    {hoveredHeatmap.day} at {hoveredHeatmap.hour > 12 ? `${hoveredHeatmap.hour - 12} PM` : hoveredHeatmap.hour === 12 ? '12 PM' : `${hoveredHeatmap.hour} AM`}: {hoveredHeatmap.bookings} Bookings
                  </span>
                ) : (
                  <span className="text-[10px] text-[#6E6960] font-sans font-semibold">Hover slots for stats</span>
                )}
              </div>
            }
          >
            <div className="mt-4 space-y-2 select-none overflow-x-auto pb-1 scrollbar-thin">
              <div className="min-w-[600px]">
                
                {/* Heatmap header: Hours row */}
                <div className="grid grid-cols-13 gap-1 mb-1 text-center font-mono text-[9px] font-bold text-[#6E6960]">
                  <div className="text-left font-sans font-semibold">Day</div>
                  {Array.from({ length: 12 }, (_, i) => i + 9).map((hr) => (
                    <div key={hr}>
                      {hr > 12 ? `${hr - 12}P` : hr === 12 ? "12P" : `${hr}A`}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                  return (
                    <div key={day} className="grid grid-cols-13 gap-1 items-center">
                      {/* Row header: Day name */}
                      <div className="text-[10px] font-bold text-[#1A1A1A] font-sans">{day}</div>
                      
                      {/* Hourly slots */}
                      {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => {
                        const cell = data.heatmap.find(h => h.day === day && h.hour === hour)
                        const bookings = cell ? cell.bookings : 0
                        
                        // Decide level
                        let cellBg = "bg-stone-50 border border-stone-200/40"
                        if (bookings >= 8) cellBg = "bg-[#3D5A3A]"
                        else if (bookings >= 5) cellBg = "bg-[#3D5A3A]/70 text-white"
                        else if (bookings >= 3) cellBg = "bg-[#3D5A3A]/40 text-[#3D5A3A]"
                        else if (bookings >= 1) cellBg = "bg-[#3D5A3A]/15 text-[#3D5A3A]"

                        return (
                          <div
                            key={hour}
                            onMouseEnter={() => setHoveredHeatmap({ day, hour, bookings })}
                            onMouseLeave={() => setHoveredHeatmap(null)}
                            className={cn(
                              "aspect-square rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center text-[9px] font-bold font-mono",
                              cellBg,
                              bookings >= 5 ? "hover:ring-1 hover:ring-[#1A1A1A] hover:scale-105" : "hover:bg-stone-200/50"
                            )}
                          >
                            {bookings > 0 ? bookings : ""}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {/* Legend indicator */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#E2D9CE]/30 text-[9px] font-sans font-bold text-[#6E6960]">
                  <span>Workstation Density:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-stone-50 border border-stone-200" />
                    <span>0 bookings (Idle)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3D5A3A]/15" />
                    <span>1-2 bookings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3D5A3A]/40" />
                    <span>3-4 bookings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3D5A3A]/70" />
                    <span>5-7 bookings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3D5A3A]" />
                    <span>8+ bookings (Peak)</span>
                  </div>
                </div>

              </div>
            </div>
          </ChartCard>
        </div>

      </div>

      {/* ─── Staff performance + Retention Funnel ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Stylist rankings */}
        <ChartCard
          title="Stylist Output Comparison"
          subtitle="Staff revenue contribution, average ratings, and scheduling occupancy"
        >
          <div className="mt-4 space-y-4 select-none">
            {data.staffPerformance.map((st, idx) => {
              const maxOcc = Math.max(...data.staffPerformance.map(s => s.occupancy))
              const pctOcc = (st.occupancy / maxOcc) * 100

              return (
                <div key={st.name} className="flex flex-col p-3 rounded-lg border border-[#E2D9CE]/30 bg-[#FAFAF7]/40 hover:border-[#3D5A3A]/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#E8E0D6]/40 flex items-center justify-center font-serif text-[10px] font-bold text-[#3D5A3A] border border-[#E2D9CE]/40">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1A1A1A] font-sans">{st.name}</span>
                        <div className="flex items-center gap-0.5 text-[#C4A76C] mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span className="text-[9px] font-bold text-[#6E6960] font-mono">{st.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-[#1A1A1A]">₹{st.revenue.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-[#6E6960] font-mono font-semibold">{st.bookings} sessions</p>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[9px] font-sans font-bold text-[#6E6960] mb-1">
                      <span>Workload Occupancy</span>
                      <span className="font-mono text-[#3D5A3A]">{st.occupancy}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#E8E0D6]/30 overflow-hidden border border-[#E2D9CE]/20">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${st.occupancy}%`, backgroundColor: st.color }}
                      />
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Customer funnel conversion */}
        <ChartCard
          title="Customer Retention & Funnel Leakage"
          subtitle="Funnel conversion rates mapping discoverability to loyalty status"
        >
          <div className="mt-4 space-y-3.5 select-none">
            {funnelSteps.map((step, idx) => {
              const previousStepCount = idx > 0 ? funnelSteps[idx - 1].count : step.count
              const stepConversion = previousStepCount > 0 ? Math.round((step.count / previousStepCount) * 100) : 100

              return (
                <div key={step.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-sans font-bold text-[#1A1A1A]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#6E6960]">{step.name}</span>
                      <span className="text-[8px] font-mono text-stone-400">({step.label})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#3D5A3A] font-extrabold">{step.count.toLocaleString()}</span>
                      {idx > 0 && (
                        <span className="text-[8px] font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1 rounded">
                          {stepConversion}% conversion
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="h-6 rounded-md bg-[#E8E0D6]/20 border border-[#E2D9CE]/40 relative overflow-hidden flex items-center px-3">
                    <div
                      className={cn(
                        "absolute top-0 left-0 bottom-0 transition-all duration-1000",
                        idx === 0 ? "bg-stone-200/40" :
                        idx === 1 ? "bg-[#7A9A6D]/15" :
                        idx === 2 ? "bg-[#7A9A6D]/30" :
                        idx === 3 ? "bg-[#3D5A3A]/60" : "bg-[#3D5A3A]"
                      )}
                      style={{ width: `${step.pct}%` }}
                    />
                    
                    {/* Inline drop-off percentage */}
                    <span className="relative z-10 text-[9px] font-mono font-bold text-[#1A1A1A] ml-auto">
                      {idx === 0 ? "100%" : `${step.pct}% of visits`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

      </div>

      {/* ─── Recent transactions table ─── */}
      <ChartCard
        title="Recent Transactions & Booking Status"
        subtitle="Audit log of client scheduler triggers and payment verification status"
        headerActions={
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search logs..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-[#E2D9CE]/40 rounded-lg text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]/60 w-full sm:w-56"
              />
            </div>
          </div>
        }
      >
        <div className="mt-4 overflow-x-auto select-none border border-[#E2D9CE]/40 rounded-lg">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-[#E2D9CE]/40 text-[#6E6960] font-bold uppercase text-[9px] tracking-wider">
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Stylist</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9CE]/30">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-stone-50/30 transition-all duration-150 text-[#1A1A1A]">
                    <td className="px-4 py-3.5 font-mono font-bold">{bk.id}</td>
                    <td className="px-4 py-3.5 font-semibold">{bk.name}</td>
                    <td className="px-4 py-3.5 text-[#6E6960] font-medium">{bk.service}</td>
                    <td className="px-4 py-3.5 text-[#3D5A3A] font-semibold">{bk.stylist}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-semibold">{bk.date}</span>
                      <span className="text-[10px] text-stone-400 ml-1.5 font-bold font-mono">{bk.time}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold">₹{bk.amount}</td>
                    <td className="px-4 py-3.5 text-center">{getStatusBadge(bk.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#6E6960] font-medium">
                    No transaction entries matched search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 border-t border-[#E2D9CE]/25 pt-4 text-xs font-sans text-[#6E6960] select-none font-semibold">
            <span>
              Showing Page <span className="font-mono text-[#3D5A3A] font-bold">{currentPage}</span> of{" "}
              <span className="font-mono text-[#3D5A3A] font-bold">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 border-[#E2D9CE]/45 text-[#3D5A3A] hover:bg-[#E8E0D6]/10"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 border-[#E2D9CE]/45 text-[#3D5A3A] hover:bg-[#E8E0D6]/10"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </ChartCard>

    </div>
  )
}
