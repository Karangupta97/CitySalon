"use client"

import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const monthlyData = [
  { month: "Jan", bookings: 38, revenue: 31200 },
  { month: "Feb", bookings: 42, revenue: 34400 },
  { month: "Mar", bookings: 45, revenue: 36900 },
  { month: "Apr", bookings: 41, revenue: 33700 },
  { month: "May", bookings: 47, revenue: 38400 },
  { month: "Jun", bookings: 52, revenue: 42600 },
]

const serviceBreakdown = [
  { name: "Hair Colour", bookings: 14, revenue: 16800 },
  { name: "Haircut", bookings: 11, revenue: 6600 },
  { name: "Facial", bookings: 9, revenue: 7200 },
  { name: "Bridal", bookings: 4, revenue: 24000 },
  { name: "Manicure", bookings: 5, revenue: 2500 },
  { name: "Beard Trim", bookings: 4, revenue: 1400 },
]

const stylistPerformance = [
  { name: "Meena", bookings: 22, revenue: 18200, rating: 4.9 },
  { name: "Raj", bookings: 15, revenue: 7500, rating: 4.8 },
  { name: "Priya", bookings: 6, revenue: 9600, rating: 4.7 },
  { name: "Anita", bookings: 4, revenue: 3100, rating: 4.6 },
]

const pieData = [
  { name: "New", value: 60, color: "hsl(var(--primary))" },
  { name: "Returning", value: 40, color: "hsl(var(--accent))" },
]

const dayPerformance = [
  { day: "Mon", bookings: 5 },
  { day: "Tue", bookings: 7 },
  { day: "Wed", bookings: 6 },
  { day: "Thu", bookings: 8 },
  { day: "Fri", bookings: 10 },
  { day: "Sat", bookings: 12 },
  { day: "Sun", bookings: 4 },
]

const kpis = [
  { label: "Total Bookings", value: "47", prev: "42", unit: "", trend: "up" as const },
  { label: "Revenue", value: "₹38,400", prev: "₹34,400", unit: "", trend: "up" as const },
  { label: "Avg. Booking Value", value: "₹817", prev: "₹819", unit: "", trend: "down" as const },
  { label: "No-show Rate", value: "8.5%", prev: "9.1%", unit: "", trend: "up" as const },
  { label: "New Customers", value: "28", prev: "25", unit: "", trend: "up" as const },
  { label: "Profile Views", value: "312", prev: "287", unit: "", trend: "up" as const },
  { label: "Booking Conversion", value: "15%", prev: "13.7%", unit: "", trend: "up" as const },
  { label: "Cancelled", value: "3", prev: "4", unit: "", trend: "up" as const },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month")

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real numbers, not vanity metrics</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          {(["week", "month", "quarter"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium boty-transition capitalize ${
                period === p ? "bg-background text-foreground boty-shadow" : "text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</p>
            <p className="text-lg font-bold text-foreground">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : kpi.trend === "down" ? (
                <TrendingDown className="w-3 h-3 text-destructive" />
              ) : (
                <Minus className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-[10px] text-muted-foreground">vs {kpi.prev}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
        <h3 className="text-sm font-medium text-foreground mb-5">Bookings & Revenue Trend</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#gradRevenue)" strokeWidth={2} name="Revenue (₹)" />
              <Bar yAxisId="left" dataKey="bookings" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} opacity={0.7} name="Bookings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service breakdown + Day performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
          <h3 className="text-sm font-medium text-foreground mb-5">Top Services</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceBreakdown} layout="vertical" margin={{ top: 0, right: 5, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
          <h3 className="text-sm font-medium text-foreground mb-5">Best Performing Days</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="bookings" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stylist performance + Customer split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
          <h3 className="text-sm font-medium text-foreground mb-4">Stylist Performance</h3>
          <div className="space-y-3">
            {stylistPerformance.map((s, i) => {
              const maxBookings = Math.max(...stylistPerformance.map((x) => x.bookings))
              const pct = (s.bookings / maxBookings) * 100
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{s.bookings} bookings</span>
                        <span className="text-xs font-medium text-primary">₹{s.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary boty-transition"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-card/70 border border-border/20 boty-shadow">
          <h3 className="text-sm font-medium text-foreground mb-4">New vs Returning</h3>
          <div className="flex items-center justify-center h-[160px]">
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx={80}
                cy={80}
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-foreground">{d.name}</span>
                <span className="ml-auto text-xs font-bold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
