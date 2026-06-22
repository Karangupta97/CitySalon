"use client"

import { useState, useEffect } from "react"
import {
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Clock,
  Eye,
  Percent,
  Activity,
  Zap,
  Star,
  UserCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ThumbsUp,
  FlaskConical,
  PlusCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useOwnerData } from "@/lib/useOwnerData"
import { useAuth } from "@/components/boty/auth-context"
import Link from "next/link"

const peakHours = [
  { hour: "9 AM", bookings: 2 },
  { hour: "10 AM", bookings: 5 },
  { hour: "11 AM", bookings: 7 },
  { hour: "12 PM", bookings: 4 },
  { hour: "1 PM", bookings: 3 },
  { hour: "2 PM", bookings: 6 },
  { hour: "3 PM", bookings: 8 },
  { hour: "4 PM", bookings: 9 },
  { hour: "5 PM", bookings: 7 },
  { hour: "6 PM", bookings: 5 },
  { hour: "7 PM", bookings: 3 },
]

// ─── Component ───────────────────────────────────────────────────

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const ownerData = useOwnerData()
  const [period, setPeriod] = useState<"week" | "month">("month")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const hour = mounted ? new Date().getHours() : 12
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

  // ── Loading skeleton ────────────────────────────────────────
  if (ownerData.isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 animate-pulse">
        <div className="h-12 bg-[#E2D9CE]/40 rounded-xl w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#E2D9CE]/30 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-[#E2D9CE]/20 rounded-xl" />
      </div>
    )
  }

  if (ownerData.error) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 bg-red-50/50 border border-red-200/50 rounded-xl text-red-700 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-lg">Failed to load dashboard data</h3>
          <p className="text-sm text-red-600/80 mt-1">{ownerData.error}</p>
        </div>
      </div>
    )
  }

  // ── No salon (real owner, just registered) ──────────────────
  if (!ownerData.hasSalon && !ownerData.isDemo) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-blur-in">
        <div className="w-16 h-16 rounded-2xl bg-[#3D5A3A]/10 border border-[#3D5A3A]/20 flex items-center justify-center">
          <PlusCircle className="w-8 h-8 text-[#3D5A3A]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3D5A3A] tracking-tight">
            Welcome, {user?.full_name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-sm text-[#6E6960] mt-2 max-w-md font-sans">
            You don't have a salon set up yet. Create your first salon to start managing bookings, services, and analytics.
          </p>
        </div>
        <Link
          href="/owner/dashboard/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3D5A3A] text-white text-sm font-semibold rounded-xl hover:bg-[#2B3F29] transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Set up your salon
        </Link>
      </div>
    )
  }

  const kpiCards = [
    {
      label: "Total Bookings",
      value: ownerData.kpis.totalBookings,
      change: ownerData.kpis.bookingsChange,
      trend: ownerData.kpis.bookingsTrend,
      icon: CalendarCheck,
      iconBg: "bg-[#3D5A3A]/5 text-[#3D5A3A]",
    },
    {
      label: "Revenue",
      value: ownerData.kpis.revenue,
      change: ownerData.kpis.revenueChange,
      trend: ownerData.kpis.revenueTrend,
      icon: IndianRupee,
      iconBg: "bg-[#C4A76C]/10 text-[#C4A76C]",
    },
    {
      label: "Avg Booking Value",
      value: ownerData.kpis.avgBookingValue,
      change: ownerData.kpis.avgChange,
      trend: ownerData.kpis.avgTrend,
      icon: TrendingUp,
      iconBg: ownerData.kpis.avgTrend === "up" ? "bg-[#7A9A6D]/10 text-[#7A9A6D]" : "bg-red-500/5 text-red-600",
    },
    {
      label: "New Customers",
      value: ownerData.kpis.newCustomers,
      change: ownerData.kpis.customersChange,
      trend: ownerData.kpis.customersTrend,
      icon: UserPlus,
      iconBg: "bg-[#7A9A6D]/10 text-[#7A9A6D]",
    },
  ]

  const activeRevenueData = ownerData.weeklyRevenue

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in">
      {/* ─── Header Greeting Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif text-3xl font-bold text-[#3D5A3A] tracking-tight">
              {greeting}, {ownerData.salonName}
            </h1>
            {/* Demo Mode Badge */}
            {ownerData.isDemo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                <FlaskConical className="w-3 h-3" />
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs font-sans text-[#6E6960] font-semibold">
            {ownerData.isDemo
              ? "You are viewing sample mock data. Real owners see their actual salon analytics."
              : `Salon operational performance tracking statement for this ${period === "week" ? "week" : "month"}.`}
          </p>
        </div>

        {/* Toggle between Period */}
        <div className="flex items-center self-start sm:self-center bg-[#E8E0D6]/30 rounded-lg p-1 border border-[#E2D9CE]/40 shadow-xs">
          <button
            type="button"
            onClick={() => setPeriod("week")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              period === "week"
                ? "bg-[#3D5A3A] text-white shadow-xs"
                : "text-[#6E6960] hover:text-[#3D5A3A]"
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              period === "month"
                ? "bg-[#3D5A3A] text-white shadow-xs"
                : "text-[#6E6960] hover:text-[#3D5A3A]"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon
          const isUp = card.trend === "up"
          return (
            <div
              key={card.label}
              className="p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs hover:border-[#3D5A3A]/30 transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg} border border-current/5`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">{card.label}</p>
                  <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight font-sans mt-0.5">{card.value}</p>
                </div>
              </div>

              {card.change !== "—" ? (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                    isUp ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </span>
              ) : (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded text-[#6E6960] bg-[#E8E0D6]/30">
                  —
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── Revenue Chart + Today's Schedule ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-3 p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Revenue Statement</h3>
              <p className="text-xs text-[#6E6960] font-sans">
                {period === "week" ? "Current week performance vs previous week" : "Current month performance vs previous month"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider font-sans text-[#6E6960]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3D5A3A]" />
                {period === "week" ? "This Week" : "This Month"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C4A76C]" />
                {period === "week" ? "Last Week" : "Last Month"}
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeRevenueData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3D5A3A" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#3D5A3A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPrevious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4A76C" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="#C4A76C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E2D9CE",
                      background: "#FAFAF7",
                      fontSize: 10,
                      boxShadow: "none",
                      color: "#1A1A1A",
                      fontFamily: "var(--font-sans)",
                    }}
                    formatter={(value: number, name: string) => [
                      `₹${value.toLocaleString()}`,
                      name === "current"
                        ? period === "week" ? "This Week" : "This Month"
                        : period === "week" ? "Last Week" : "Last Month",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stroke="#C4A76C"
                    fill="url(#gradPrevious)"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="#3D5A3A"
                    fill="url(#gradCurrent)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Daily Log</h3>
              <p className="text-[11px] text-[#6E6960] font-sans font-semibold">
                {ownerData.todaySchedule.length > 0
                  ? `${ownerData.todaySchedule.length} appointments today`
                  : "No appointments today"}
              </p>
            </div>
            <span className="text-[9px] font-bold text-[#3D5A3A] bg-[#E8E0D6]/30 border border-[#E2D9CE]/50 px-2.5 py-1 rounded font-sans uppercase tracking-wider">
              {mounted ? new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "Today"}
            </span>
          </div>

          {ownerData.todaySchedule.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-[#6E6960]">
              <CalendarCheck className="w-8 h-8 text-[#E2D9CE] mb-2" />
              <p className="text-xs font-sans font-semibold">No bookings scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {ownerData.todaySchedule.map((apt, i) => {
                let statusClass = "text-[#6E6960] bg-gray-100 border-gray-200"
                if (apt.status === "confirmed") statusClass = "text-[#3D5A3A] bg-[#3D5A3A]/5 border-[#3D5A3A]/10"
                if (apt.status === "in-progress") statusClass = "text-[#C4A76C] bg-[#C4A76C]/5 border-[#C4A76C]/10"
                if (apt.status === "completed") statusClass = "text-emerald-700 bg-emerald-50 border-emerald-100"
                if (apt.status === "pending") statusClass = "text-amber-700 bg-amber-50 border-amber-100"

                const initials = apt.name.split(" ").map((n) => n[0]).join("")

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAFAF7]/60 border border-[#E2D9CE]/30 hover:border-[#3D5A3A]/30 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 flex items-center justify-center text-[11px] font-serif font-bold text-[#3D5A3A] shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#C4A76C] uppercase tracking-wide">{apt.time}</span>
                        <span className="text-xs font-bold text-[#1A1A1A] font-sans">₹{apt.amount}</span>
                      </div>
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{apt.name}</p>
                      <p className="text-[10px] text-[#6E6960] font-medium truncate mt-0.5">
                        {apt.service} <span className="text-[#E2D9CE]">|</span>{" "}
                        <span className="font-semibold text-[#3D5A3A]">{apt.stylist}</span>
                      </p>
                    </div>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${statusClass}`}>
                      {apt.status.replace("-", " ")}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Three-Column: Top Services + Stylist Leaderboard + Stat Cards ─── */}
      {(ownerData.topServices.length > 0 || ownerData.isDemo) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Top Services Donut */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Service Division</h3>
              <p className="text-xs text-[#6E6960] font-sans">Booking allocation metrics</p>
            </div>
            <div className="flex items-center justify-center my-3">
              {mounted && (
                <PieChart width={140} height={140}>
                  <Pie
                    data={ownerData.topServices.length > 0 ? ownerData.topServices : [{ name: "No data", value: 1, fill: "#E2D9CE" }]}
                    cx={70}
                    cy={70}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {(ownerData.topServices.length > 0 ? ownerData.topServices : [{ fill: "#E2D9CE" }]).map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2D9CE", fontSize: 9, background: "#FAFAF7" }}
                    formatter={(v: number) => [`${v} Bookings`]}
                  />
                </PieChart>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#E2D9CE]/20 pt-3">
              {ownerData.topServices.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                  <span className="text-[10px] font-sans text-[#6E6960] truncate font-semibold">{s.name}</span>
                  <span className="text-[10px] font-bold text-[#1A1A1A] ml-auto font-sans">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stylist Leaderboard */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Stylist Output</h3>
              <p className="text-xs text-[#6E6960] font-sans">Monthly performance distribution</p>
            </div>
            {ownerData.stylistLeaderboard.length > 0 ? (
              <div className="space-y-3.5 mt-3">
                {ownerData.stylistLeaderboard.map((s) => {
                  const maxBookings = ownerData.stylistLeaderboard[0].bookings
                  const percentOfMax = (s.bookings / maxBookings) * 100
                  return (
                    <div key={s.name} className="group/stylist">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#E8E0D6]/40 flex items-center justify-center font-serif text-[10px] font-bold text-[#3D5A3A] shadow-xs">
                            {s.initial}
                          </div>
                          <span className="text-xs font-bold text-[#1A1A1A] font-sans">{s.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#3D5A3A] font-sans">{s.bookings}</span>
                          <span className="text-[9px] text-[#6E6960] ml-0.5 font-bold uppercase font-sans">Sessions</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E8E0D6]/30 overflow-hidden border border-[#E2D9CE]/10">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-[#3D5A3A]"
                          style={{ width: `${percentOfMax}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">
                        <span>Revenue</span>
                        <span className="text-[#1A1A1A] font-bold">₹{s.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-[#6E6960]">
                <p className="text-xs font-sans text-center">Staff data will appear here once you add team members.</p>
              </div>
            )}
          </div>

          {/* Small Stat Cards Column */}
          <div className="flex flex-col gap-3 justify-between">
            <StatCard
              icon={AlertCircle}
              iconBg="bg-red-500/5 text-red-600 border-red-100/30"
              label="No-Show Rate"
              value={ownerData.isDemo ? "8.5%" : "—"}
              change={ownerData.isDemo ? "-0.6%" : ""}
              trend="up"
            />
            <StatCard
              icon={Percent}
              iconBg="bg-[#3D5A3A]/5 text-[#3D5A3A] border-[#3D5A3A]/10"
              label="Conversion Rate"
              value={ownerData.isDemo ? "15.2%" : "—"}
              change={ownerData.isDemo ? "+1.3%" : ""}
              trend="up"
            />
            <StatCard
              icon={Eye}
              iconBg="bg-[#C4A76C]/10 text-[#C4A76C] border-[#C4A76C]/25"
              label="Profile Views"
              value={ownerData.isDemo ? "312" : "—"}
              change={ownerData.isDemo ? "+8.7%" : ""}
              trend="up"
            />
            <StatCard
              icon={UserCheck}
              iconBg="bg-emerald-500/5 text-emerald-700 border-emerald-100/30"
              label="Returning Guests"
              value={ownerData.isDemo ? "40.8%" : `${ownerData.kpis.newCustomers ? "—" : "0%"}`}
              change={ownerData.isDemo ? "+3.0%" : ""}
              trend="up"
            />
          </div>
        </div>
      )}

      {/* ─── Peak Hours Bar Chart + Operational Insights ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Peak Hours Chart — show mock for demo, empty for real */}
        <div className="lg:col-span-3 p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Workstation Attendance</h3>
              <p className="text-xs text-[#6E6960] font-sans">Hourly booking frequency breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-wider text-[#6E6960] font-sans">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#E8E0D6]" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#7A9A6D]" /> Med</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#3D5A3A]" /> High</span>
            </div>
          </div>
          <div className="h-[180px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ownerData.isDemo ? peakHours : peakHours.map((h) => ({ ...h, bookings: 0 }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.2} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2D9CE", fontSize: 9, background: "#FAFAF7" }} cursor={{ fill: "#E8E0D6", opacity: 0.15 }} />
                  <Bar dataKey="bookings" radius={[3, 3, 0, 0]} maxBarSize={20}>
                    {(ownerData.isDemo ? peakHours : peakHours.map((h) => ({ ...h, bookings: 0 }))).map((entry, index) => {
                      let fillColor = "#E8E0D6"
                      if (entry.bookings >= 7) fillColor = "#3D5A3A"
                      else if (entry.bookings >= 5) fillColor = "#7A9A6D"
                      return <Cell key={index} fill={fillColor} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Operational Insights Panel */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2D9CE]/20 pb-3">
              <div className="p-1 rounded-lg bg-[#3D5A3A]/5 text-[#3D5A3A]">
                <Sparkles className="w-4 h-4 text-[#3D5A3A]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A] tracking-wide">Operational Insights</h3>
            </div>
            <p className="text-[11px] text-[#6E6960] font-sans font-semibold">
              Daily scheduling performance notifications:
            </p>
            <div className="space-y-3">
              {ownerData.isDemo ? (
                <>
                  <InsightRow n={1} title="Optimize Off-Peak Slots" body="Tuesdays 9 AM - 11 AM have high idle times. Recommend offering a 10% Early Bird promotion to balance workload." />
                  <InsightRow n={2} title="Bundle Service Offerings" body="Hair Colouring demand is up 25%. Bundling with Hair Styling could increase average booking value by ₹350." />
                  <InsightRow n={3} title="Staffing Allocation Check" body="Meena accounts for 47% of monthly bookings. Recommend pairing junior stylists on Saturdays to balance workload." />
                </>
              ) : (
                <div className="py-4 text-center text-xs text-[#6E6960] font-sans">
                  AI insights will appear once your salon has booking history.
                </div>
              )}
            </div>
          </div>
          <button className="w-full mt-5 py-2.5 bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-[10px] font-bold font-sans uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-transparent">
            <span>Apply campaign suggestions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Bento Grid Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GradientCard
          icon={Zap}
          gradient="from-[#3D5A3A] to-[#2B3F29]"
          shadow="shadow-xs"
          title="Today's Turnover"
          value={
            ownerData.isDemo
              ? "₹5,000"
              : ownerData.todaySchedule.length > 0
              ? `₹${ownerData.todaySchedule.reduce((s, a) => s + a.amount, 0).toLocaleString()}`
              : "₹0"
          }
          subtitle={ownerData.isDemo ? "5 confirmed bookings" : `${ownerData.todaySchedule.length} appointments`}
        />
        <GradientCard
          icon={Activity}
          gradient="from-[#C4A76C] to-[#A38249]"
          shadow="shadow-xs"
          title="Occupancy Ratio"
          value={ownerData.isDemo ? "72%" : "—"}
          subtitle={ownerData.isDemo ? "5 of 7 available slots" : "Set up your staff first"}
        />

        <div className="p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between hover:border-[#3D5A3A]/30 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE] flex items-center justify-center text-[#3D5A3A]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
              {ownerData.isDemo ? "Target Met" : "—"}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Avg Wait Time</p>
            <p className="text-lg font-extrabold text-[#1A1A1A] mt-0.5 font-sans">{ownerData.isDemo ? "12 Minutes" : "—"}</p>
            <p className="text-[10px] text-[#7A9A6D] mt-1 font-semibold flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {ownerData.isDemo ? "Better than last week" : "No data yet"}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between hover:border-[#3D5A3A]/30 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE] flex items-center justify-center text-[#C4A76C]">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 text-[#C4A76C] fill-current" />
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Public Rating</p>
            <p className="text-lg font-extrabold text-[#1A1A1A] mt-0.5 font-sans">{ownerData.isDemo ? "4.8 / 5.0" : "—"}</p>
            <p className="text-[10px] text-[#6E6960] mt-1 font-semibold flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5A3A]" />
              {ownerData.isDemo ? "+2 reviews added today" : "No reviews yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-Components ──────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  change,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  label: string
  value: string
  change: string
  trend: "up" | "down"
}) {
  const isUp = trend === "up"
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs hover:border-[#3D5A3A]/30 transition-all duration-200 flex items-center gap-3">
      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border border-current/5 ${iconBg}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans truncate">{label}</p>
        <p className="text-base font-extrabold text-[#1A1A1A] leading-tight font-sans mt-0.5">{value}</p>
      </div>
      {change && (
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 ${isUp ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
          {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {change}
        </span>
      )}
    </div>
  )
}

function GradientCard({
  icon: Icon,
  gradient,
  shadow,
  title,
  value,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  shadow: string
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-xs ${shadow} hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-32 group`}>
      <div className="flex items-center justify-between">
        <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:scale-102 transition-transform duration-200">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-[9px] text-white/80 font-bold uppercase tracking-wider font-sans">{title}</p>
        <p className="text-lg font-extrabold mt-0.5 font-sans leading-none">{value}</p>
        <p className="text-[9px] text-white/70 font-semibold mt-1 font-sans">{subtitle}</p>
      </div>
    </div>
  )
}

function InsightRow({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className={`flex items-start gap-2.5 ${n > 1 ? "border-t border-[#E2D9CE]/20 pt-3" : ""}`}>
      <span className="w-5 h-5 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 text-[#3D5A3A] flex items-center justify-center text-[10px] font-bold shrink-0">{n}</span>
      <div>
        <p className="text-xs font-bold text-[#1A1A1A] font-sans leading-tight">{title}</p>
        <p className="text-[10px] text-[#6E6960] font-sans mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
