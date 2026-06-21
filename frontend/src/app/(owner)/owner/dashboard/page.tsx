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
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  ThumbsUp,
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

// ─── Mock Data ───────────────────────────────────────────────────

const weeklyRevenue = [
  { day: "Mon", current: 4900, previous: 4200 },
  { day: "Tue", current: 6400, previous: 5800 },
  { day: "Wed", current: 4100, previous: 4600 },
  { day: "Thu", current: 7200, previous: 6100 },
  { day: "Fri", current: 9100, previous: 7800 },
  { day: "Sat", current: 10200, previous: 9400 },
  { day: "Sun", current: 3200, previous: 2900 },
]

const monthlyRevenue = [
  { day: "Wk 1", current: 31000, previous: 27500 },
  { day: "Wk 2", current: 39400, previous: 35000 },
  { day: "Wk 3", current: 41500, previous: 38200 },
  { day: "Wk 4", current: 48000, previous: 44000 },
]

const todaySchedule = [
  { time: "10:00 AM", name: "Priya Sharma", service: "Haircut + Colour", stylist: "Meena", amount: 1800, status: "confirmed" },
  { time: "11:30 AM", name: "Rohit Kapoor", service: "Beard Trim", stylist: "Raj", amount: 350, status: "in-progress" },
  { time: "01:00 PM", name: "Ananya Mehta", service: "Facial + Cleanup", stylist: "Priya", amount: 1200, status: "completed" },
  { time: "02:30 PM", name: "Vikram Singh", service: "Hair Wash + Style", stylist: "Meena", amount: 750, status: "pending" },
  { time: "04:00 PM", name: "Deepa Nair", service: "Manicure + Pedicure", stylist: "Anita", amount: 900, status: "confirmed" },
  { time: "05:30 PM", name: "Kavya Reddy", service: "Bridal Package", stylist: "Meena", amount: 3500, status: "confirmed" },
]

const topServices = [
  { name: "Hair Colour", value: 14, fill: "#3D5A3A" }, 
  { name: "Haircut", value: 11, fill: "#7A9A6D" },    
  { name: "Facial", value: 9, fill: "#C4A76C" },     
  { name: "Bridal", value: 5, fill: "#E8E0D6" },     
  { name: "Beard Trim", value: 4, fill: "#A3906B" },  
  { name: "Others", value: 4, fill: "#6E6960" },      
]

const stylistLeaderboard = [
  { name: "Meena", bookings: 22, revenue: 18200, color: "#3D5A3A", initial: "M", rank: 1 },
  { name: "Priya", bookings: 12, revenue: 9600, color: "#C4A76C", initial: "P", rank: 2 },
  { name: "Raj", bookings: 15, revenue: 7500, color: "#7A9A6D", initial: "R", rank: 3 },
  { name: "Anita", bookings: 8, revenue: 5100, color: "#6E6960", initial: "A", rank: 4 },
]

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
  const [period, setPeriod] = useState<"week" | "month">("month") 
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const hour = mounted ? new Date().getHours() : 12
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

  const activeRevenueData = period === "week" ? weeklyRevenue : monthlyRevenue

  const kpiCards = [
    {
      label: "Total Bookings",
      value: period === "week" ? "47" : "184",
      change: "+12%",
      trend: "up" as const,
      icon: CalendarCheck,
      iconBg: "bg-[#3D5A3A]/5 text-[#3D5A3A]",
    },
    {
      label: "Revenue",
      value: period === "week" ? "₹38,400" : "₹1,59,900",
      change: "+8.2%",
      trend: "up" as const,
      icon: IndianRupee,
      iconBg: "bg-[#C4A76C]/10 text-[#C4A76C]",
    },
    {
      label: "Avg Booking Value",
      value: "₹817",
      change: "-0.2%",
      trend: "down" as const,
      icon: TrendingUp,
      iconBg: "bg-red-500/5 text-red-600",
    },
    {
      label: "New Customers",
      value: period === "week" ? "28" : "112",
      change: "+14%",
      trend: "up" as const,
      icon: UserPlus,
      iconBg: "bg-[#7A9A6D]/10 text-[#7A9A6D]",
    },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in">
      {/* ─── Header Greeting Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3D5A3A] tracking-tight">
            {greeting}, Radiance Studio
          </h1>
          <p className="text-xs font-sans text-[#6E6960] mt-1 font-semibold">
            Salon operational performance tracking statement for this {period === "week" ? "week" : "month"}.
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

      {/* ─── KPI Cards (Minimalist, No Sparklines) ─── */}
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

              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                  isUp ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
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
                      name === "current" ? (period === "week" ? "This Week" : "This Month") : (period === "week" ? "Last Week" : "Last Month")
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

        {/* Today's Schedule Timeline */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Daily Log</h3>
              <p className="text-[11px] text-[#6E6960] font-sans font-semibold">{todaySchedule.length} active sessions</p>
            </div>
            <span className="text-[9px] font-bold text-[#3D5A3A] bg-[#E8E0D6]/30 border border-[#E2D9CE]/50 px-2.5 py-1 rounded font-sans uppercase tracking-wider">
              {mounted ? new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "Today"}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
            {todaySchedule.map((apt, i) => {
              let statusClass = "text-[#6E6960] bg-gray-100 border-gray-200"
              if (apt.status === "confirmed") statusClass = "text-[#3D5A3A] bg-[#3D5A3A]/5 border-[#3D5A3A]/10"
              if (apt.status === "in-progress") statusClass = "text-[#C4A76C] bg-[#C4A76C]/5 border-[#C4A76C]/10"
              if (apt.status === "completed") statusClass = "text-emerald-700 bg-emerald-50 border-emerald-100"
              if (apt.status === "pending") statusClass = "text-amber-700 bg-amber-50 border-amber-100"

              const initials = apt.name.split(" ").map(n => n[0]).join("")

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAFAF7]/60 border border-[#E2D9CE]/30 hover:border-[#3D5A3A]/30 transition-all duration-200"
                >
                  {/* Initials Avatar */}
                  <div className="w-8 h-8 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 flex items-center justify-center text-[11px] font-serif font-bold text-[#3D5A3A] shrink-0">
                    {initials}
                  </div>

                  {/* Time + Client info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#C4A76C] uppercase tracking-wide">{apt.time}</span>
                      <span className="text-xs font-bold text-[#1A1A1A] font-sans">₹{apt.amount}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1A1A1A] truncate">{apt.name}</p>
                    <p className="text-[10px] text-[#6E6960] font-medium truncate mt-0.5">
                      {apt.service} <span className="text-[#E2D9CE]">|</span> <span className="font-semibold text-[#3D5A3A]">{apt.stylist}</span>
                    </p>
                  </div>

                  {/* Status Tag */}
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${statusClass}`}>
                    {apt.status.replace("-", " ")}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Three-Column: Top Services + Stylist Leaderboard + Stat Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Top Services Donut Chart */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Service Division</h3>
            <p className="text-xs text-[#6E6960] font-sans">Booking allocation metrics</p>
          </div>

          <div className="flex items-center justify-center my-3">
            {mounted && (
              <PieChart width={140} height={140}>
                <Pie
                  data={topServices}
                  cx={70}
                  cy={70}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {topServices.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E2D9CE",
                    fontSize: 9,
                    background: "#FAFAF7",
                    fontFamily: "var(--font-sans)"
                  }}
                  formatter={(v: number) => [`${v} Bookings`]}
                />
              </PieChart>
            )}
          </div>

          {/* Color Coding Legend */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#E2D9CE]/20 pt-3">
            {topServices.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                <span className="text-[10px] font-sans text-[#6E6960] truncate font-semibold">{s.name}</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] ml-auto font-sans">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stylist Leaderboard */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-[#3D5A3A]">Stylist Output</h3>
            <p className="text-xs text-[#6E6960] font-sans">Monthly performance distribution</p>
          </div>

          <div className="space-y-3.5 my-2">
            {stylistLeaderboard.map((s) => {
              const maxBookings = stylistLeaderboard[0].bookings
              const percentOfMax = (s.bookings / maxBookings) * 100

              return (
                <div key={s.name} className="group/stylist">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded bg-[#E8E0D6]/40 flex items-center justify-center font-serif text-[10px] font-bold text-[#3D5A3A] shadow-xs"
                      >
                        {s.initial}
                      </div>
                      <span className="text-xs font-bold text-[#1A1A1A] font-sans">{s.name}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#3D5A3A] font-sans">{s.bookings}</span>
                      <span className="text-[9px] text-[#6E6960] ml-0.5 font-bold uppercase font-sans">Sessions</span>
                    </div>
                  </div>

                  {/* Clean progress bar */}
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
        </div>

        {/* Small Stat Cards Column */}
        <div className="flex flex-col gap-3 justify-between">
          <StatCard
            icon={AlertCircle}
            iconBg="bg-red-500/5 text-red-600 border-red-100/30"
            label="No-Show Rate"
            value="8.5%"
            change="-0.6%"
            trend="up"
          />
          <StatCard
            icon={Percent}
            iconBg="bg-[#3D5A3A]/5 text-[#3D5A3A] border-[#3D5A3A]/10"
            label="Conversion Rate"
            value="15.2%"
            change="+1.3%"
            trend="up"
          />
          <StatCard
            icon={Eye}
            iconBg="bg-[#C4A76C]/10 text-[#C4A76C] border-[#C4A76C]/25"
            label="Profile Views"
            value="312"
            change="+8.7%"
            trend="up"
          />
          <StatCard
            icon={UserCheck}
            iconBg="bg-emerald-500/5 text-emerald-700 border-emerald-100/30"
            label="Returning Guests"
            value="40.8%"
            change="+3.0%"
            trend="up"
          />
        </div>
      </div>

      {/* ─── Peak Hours Bar Chart + Operational Insights ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Peak Hours Chart */}
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
                <BarChart data={peakHours} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E2D9CE",
                      fontSize: 9,
                      background: "#FAFAF7"
                    }}
                    cursor={{ fill: "#E8E0D6", opacity: 0.15 }}
                  />
                  <Bar dataKey="bookings" radius={[3, 3, 0, 0]} maxBarSize={20}>
                    {peakHours.map((entry, index) => {
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

        {/* Operational Insights Panel (Redesigned, Clean SaaS Card, No Emojis) */}
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
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 text-[#3D5A3A] flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] font-sans leading-tight">Optimize Off-Peak Slots</p>
                  <p className="text-[10px] text-[#6E6960] font-sans mt-0.5 leading-relaxed">
                    Tuesdays 9 AM - 11 AM have high idle times. Recommend offering a 10% Early Bird promotion to balance workload.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-[#E2D9CE]/20 pt-3">
                <span className="w-5 h-5 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 text-[#3D5A3A] flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] font-sans leading-tight">Bundle Service Offerings</p>
                  <p className="text-[10px] text-[#6E6960] font-sans mt-0.5 leading-relaxed">
                    Hair Colouring demand is up 25%. Bundling with Hair Styling could increase average booking value by ₹350.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-[#E2D9CE]/20 pt-3">
                <span className="w-5 h-5 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE]/50 text-[#3D5A3A] flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] font-sans leading-tight">Staffing Allocation Check</p>
                  <p className="text-[10px] text-[#6E6960] font-sans mt-0.5 leading-relaxed">
                    Meena accounts for 47% of monthly bookings. Recommend pairing junior stylists on Saturdays to balance workload.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-5 py-2.5 bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-[10px] font-bold font-sans uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-transparent">
            <span>Apply campaign suggestions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Bento Grid Summary Cards (SaaS Cards) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GradientCard
          icon={Zap}
          gradient="from-[#3D5A3A] to-[#2B3F29]"
          shadow="shadow-xs"
          title="Today's Turnover"
          value="₹5,000"
          subtitle="5 confirmed bookings"
        />
        <GradientCard
          icon={Activity}
          gradient="from-[#C4A76C] to-[#A38249]"
          shadow="shadow-xs"
          title="Occupancy Ratio"
          value="72%"
          subtitle="5 of 7 available slots"
        />
        
        {/* Simple Flat Cards */}
        <div className="p-5 rounded-xl bg-white border border-[#E2D9CE]/40 shadow-xs flex flex-col justify-between hover:border-[#3D5A3A]/30 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded bg-[#E8E0D6]/40 border border-[#E2D9CE] flex items-center justify-center text-[#3D5A3A]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Target Met</span>
          </div>
          <div className="mt-4">
            <p className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">Avg Wait Time</p>
            <p className="text-lg font-extrabold text-[#1A1A1A] mt-0.5 font-sans">12 Minutes</p>
            <p className="text-[10px] text-[#7A9A6D] mt-1 font-semibold flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              Better than last week
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
            <p className="text-lg font-extrabold text-[#1A1A1A] mt-0.5 font-sans">4.8 / 5.0</p>
            <p className="text-[10px] text-[#6E6960] mt-1 font-semibold flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5A3A]" />
              +2 reviews added today
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

      <span
        className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 ${
          isUp ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
        }`}
      >
        {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
        {change}
      </span>
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
