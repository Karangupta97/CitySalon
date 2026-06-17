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
  { day: "Mon", thisWeek: 4900, lastWeek: 4200 },
  { day: "Tue", thisWeek: 6400, lastWeek: 5800 },
  { day: "Wed", thisWeek: 4100, lastWeek: 4600 },
  { day: "Thu", thisWeek: 7200, lastWeek: 6100 },
  { day: "Fri", thisWeek: 9100, lastWeek: 7800 },
  { day: "Sat", thisWeek: 10200, lastWeek: 9400 },
  { day: "Sun", thisWeek: 3200, lastWeek: 2900 },
]

const todaySchedule = [
  { time: "10:00 AM", name: "Priya Sharma", service: "Haircut + Colour", stylist: "Meena", amount: 1800 },
  { time: "11:30 AM", name: "Rohit Kapoor", service: "Beard Trim", stylist: "Raj", amount: 350 },
  { time: "01:00 PM", name: "Ananya Mehta", service: "Facial + Cleanup", stylist: "Priya", amount: 1200 },
  { time: "02:30 PM", name: "Vikram Singh", service: "Hair Wash + Style", stylist: "Meena", amount: 750 },
  { time: "04:00 PM", name: "Deepa Nair", service: "Manicure + Pedicure", stylist: "Anita", amount: 900 },
  { time: "05:30 PM", name: "Kavya Reddy", service: "Bridal Package", stylist: "Meena", amount: 3500 },
]

const topServices = [
  { name: "Hair Colour", value: 14, fill: "#6366f1" },
  { name: "Haircut", value: 11, fill: "#8b5cf6" },
  { name: "Facial", value: 9, fill: "#ec4899" },
  { name: "Bridal", value: 5, fill: "#f59e0b" },
  { name: "Beard Trim", value: 4, fill: "#10b981" },
  { name: "Others", value: 4, fill: "#94a3b8" },
]

const stylistLeaderboard = [
  { name: "Meena", bookings: 22, revenue: 18200, color: "#6366f1" },
  { name: "Raj", bookings: 15, revenue: 7500, color: "#8b5cf6" },
  { name: "Priya", bookings: 12, revenue: 9600, color: "#ec4899" },
  { name: "Anita", bookings: 8, revenue: 5100, color: "#f59e0b" },
]

const peakHours = [
  { hour: "9AM", bookings: 2 },
  { hour: "10AM", bookings: 5 },
  { hour: "11AM", bookings: 7 },
  { hour: "12PM", bookings: 4 },
  { hour: "1PM", bookings: 3 },
  { hour: "2PM", bookings: 6 },
  { hour: "3PM", bookings: 8 },
  { hour: "4PM", bookings: 9 },
  { hour: "5PM", bookings: 7 },
  { hour: "6PM", bookings: 5 },
  { hour: "7PM", bookings: 3 },
]

// ─── Component ───────────────────────────────────────────────────

export default function OwnerDashboardPage() {
  const [period, setPeriod] = useState<"week" | "month">("week")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const hour = mounted ? new Date().getHours() : 12
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

  const kpiCards = [
    { label: "Total Bookings", value: "47", change: "+12%", trend: "up" as const, icon: CalendarCheck, iconBg: "bg-indigo-100 text-indigo-600" },
    { label: "Revenue", value: "₹38,400", change: "+8.2%", trend: "up" as const, icon: IndianRupee, iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Avg Booking Value", value: "₹817", change: "-0.2%", trend: "down" as const, icon: TrendingUp, iconBg: "bg-amber-100 text-amber-600" },
    { label: "New Customers", value: "28", change: "+5", trend: "up" as const, icon: UserPlus, iconBg: "bg-pink-100 text-pink-600" },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-6">
      {/* ─── Header Row ─── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {greeting} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s how your salon is performing this {period === "week" ? "week" : "month"}
          </p>
        </div>
        <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200/60 shadow-sm">
          <button
            type="button"
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              period === "week"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              period === "month"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    card.trend === "up"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* ─── Revenue Chart + Today's Schedule ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Revenue Overview Area Chart */}
        <div className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">This week vs last week</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                This week
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-200" />
                Last week
              </span>
            </div>
          </div>
          <div className="h-[260px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradThisWeek" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradLastWeek" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c7d2fe" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
                    formatter={(value: number, name: string) => [`₹${value.toLocaleString()}`, name === "thisWeek" ? "This Week" : "Last Week"]}
                  />
                  <Area type="monotone" dataKey="lastWeek" stroke="#c7d2fe" fill="url(#gradLastWeek)" strokeWidth={2} strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="thisWeek" stroke="#6366f1" fill="url(#gradThisWeek)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Today's Schedule Timeline */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Schedule</h3>
              <p className="text-xs text-gray-500 mt-0.5">{todaySchedule.length} appointments</p>
            </div>
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {mounted ? new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) : "Today"}
            </span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {todaySchedule.map((apt, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F4F0]/60 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  {i < todaySchedule.length - 1 && <span className="w-px h-4 bg-gray-200" />}
                </div>
                {/* Time */}
                <span className="text-[11px] font-bold text-gray-900 w-[56px] flex-shrink-0">{apt.time}</span>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{apt.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{apt.service}</p>
                </div>
                {/* Stylist chip */}
                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  {apt.stylist}
                </span>
                {/* Amount */}
                <span className="text-[11px] font-bold text-gray-900 flex-shrink-0">₹{apt.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Three-Column: Top Services + Stylist Leaderboard + Stat Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top Services Donut */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Top Services</h3>
          <p className="text-xs text-gray-500 mb-4">Booking distribution</p>
          <div className="flex items-center justify-center">
            {mounted && (
              <PieChart width={180} height={180}>
                <Pie
                  data={topServices}
                  cx={90}
                  cy={90}
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {topServices.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 11, background: "#fff" }}
                  formatter={(v: number, name: string) => [`${v} bookings`, name]}
                />
              </PieChart>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            {topServices.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.fill }} />
                <span className="text-[11px] text-gray-500 truncate">{s.name}</span>
                <span className="text-[11px] font-semibold text-gray-900 ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stylist Leaderboard */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Stylist Leaderboard</h3>
          <p className="text-xs text-gray-500 mb-5">Top performers this month</p>
          <div className="space-y-4">
            {stylistLeaderboard.map((s, i) => {
              const maxBookings = stylistLeaderboard[0].bookings
              const pct = (s.bookings / maxBookings) * 100
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: s.color }}
                      >
                        {s.name[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900">{s.bookings}</span>
                      <span className="text-[10px] text-gray-400 ml-1">bookings</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">₹{s.revenue.toLocaleString()} revenue</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4 Small Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <StatCard
            icon={AlertCircle}
            iconBg="from-red-500 to-orange-500"
            label="No-Show Rate"
            value="8.5%"
            change="-0.6%"
            trend="down"
          />
          <StatCard
            icon={Percent}
            iconBg="from-violet-500 to-indigo-600"
            label="Booking Conversion"
            value="15%"
            change="+1.3%"
            trend="up"
          />
          <StatCard
            icon={Eye}
            iconBg="from-sky-500 to-blue-600"
            label="Profile Views"
            value="312"
            change="+8.7%"
            trend="up"
          />
          <StatCard
            icon={UserCheck}
            iconBg="from-emerald-500 to-teal-600"
            label="Returning %"
            value="40%"
            change="+3%"
            trend="up"
          />
        </div>
      </div>

      {/* ─── Peak Hours Bar Chart ─── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Peak Hours</h3>
            <p className="text-xs text-gray-500 mt-0.5">Bookings by time of day</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-indigo-100" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-indigo-400" /> Med</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-indigo-700" /> High</span>
          </div>
        </div>
        <div className="h-[160px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 11, background: "#fff" }}
                  formatter={(v: number) => [`${v} bookings`, "Bookings"]}
                  cursor={{ fill: "#f3f4f6", opacity: 0.5 }}
                />
                <Bar dataKey="bookings" radius={[6, 6, 2, 2]} maxBarSize={36}>
                  {peakHours.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.bookings >= 8 ? "#4338ca" : entry.bookings >= 5 ? "#818cf8" : "#c7d2fe"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ─── 4 Gradient Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GradientCard
          icon={Zap}
          gradient="from-indigo-500 to-violet-600"
          shadow="shadow-indigo-500/20"
          title="Today's Revenue"
          value="₹5,000"
          subtitle="5 confirmed bookings"
        />
        <GradientCard
          icon={Activity}
          gradient="from-emerald-500 to-teal-600"
          shadow="shadow-emerald-500/20"
          title="Occupancy Rate"
          value="72%"
          subtitle="5 of 7 slots filled"
        />
        <GradientCard
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
          shadow="shadow-amber-500/20"
          title="Avg Wait Time"
          value="12 min"
          subtitle="Better than last week"
        />
        <GradientCard
          icon={Star}
          gradient="from-pink-500 to-rose-600"
          shadow="shadow-pink-500/20"
          title="Rating"
          value="4.8"
          subtitle="+2 new reviews today"
        />
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
  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            trend === "up" ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
          }`}
        >
          {trend === "up" ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {change}
        </span>
      </div>
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
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow} hover:scale-[1.02] transition-transform duration-200`}>
      <Icon className="w-5 h-5 mb-2 opacity-80" />
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-[11px] opacity-70 mt-1">{subtitle}</p>
    </div>
  )
}
