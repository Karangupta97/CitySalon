"use client"

import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle, Star } from "lucide-react"

// Monthly historical data + Forecast projection months (Jul, Aug)
const historicalMonthlyData = [
  { month: "Jan", bookings: 38, revenue: 31200 },
  { month: "Feb", bookings: 42, revenue: 34400 },
  { month: "Mar", bookings: 45, revenue: 36900 },
  { month: "Apr", bookings: 41, revenue: 33700 },
  { month: "May", bookings: 47, revenue: 38400 },
  { month: "Jun", bookings: 52, revenue: 42600 },
]

const forecastMonthlyData = [
  ...historicalMonthlyData.map(d => ({ ...d, forecastRevenue: d.revenue, forecastBookings: d.bookings })),
  { month: "Jul *", bookings: 0, revenue: 0, forecastRevenue: 49000, forecastBookings: 60, isForecast: true },
  { month: "Aug *", bookings: 0, revenue: 0, forecastRevenue: 54000, forecastBookings: 66, isForecast: true },
]

const serviceBreakdown = [
  { name: "Hair Colour", bookings: 14, revenue: 16800, fill: "#3D5A3A" },
  { name: "Haircut", bookings: 11, revenue: 6600, fill: "#7A9A6D" },
  { name: "Facial", bookings: 9, revenue: 7200, fill: "#C4A76C" },
  { name: "Bridal", bookings: 4, revenue: 24000, fill: "#E8E0D6" },
  { name: "Manicure", bookings: 5, revenue: 2500, fill: "#A3906B" },
  { name: "Beard Trim", bookings: 4, revenue: 1400, fill: "#6E6960" },
]

const stylistPerformance = [
  { name: "Meena", bookings: 22, revenue: 18200, rating: 4.9, color: "#3D5A3A" },
  { name: "Raj", bookings: 15, revenue: 7500, rating: 4.8, color: "#C4A76C" },
  { name: "Priya", bookings: 12, revenue: 9600, rating: 4.7, color: "#7A9A6D" },
  { name: "Anita", bookings: 8, revenue: 5100, rating: 4.6, color: "#6E6960" },
]

const customerPieData = [
  { name: "New Guests", value: 60, color: "#3D5A3A" }, // Sage
  { name: "Returning Guests", value: 40, color: "#C4A76C" }, // Gold
]

const sentimentPieData = [
  { name: "Positive (4-5★)", value: 84, color: "#3D5A3A" },
  { name: "Neutral (3★)", value: 12, color: "#C4A76C" },
  { name: "Negative (1-2★)", value: 4, color: "#B85450" },
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
  { label: "Total Bookings", value: "47", prev: "42", trend: "up" as const },
  { label: "Revenue", value: "₹38,400", prev: "₹34,400", trend: "up" as const },
  { label: "Avg. Booking Value", value: "₹817", prev: "₹819", trend: "down" as const },
  { label: "No-show Rate", value: "8.5%", prev: "9.1%", trend: "up" as const },
  { label: "New Customers", value: "28", prev: "25", trend: "up" as const },
  { label: "Profile Views", value: "312", prev: "287", trend: "up" as const },
  { label: "Booking Conversion", value: "15.2%", prev: "13.7%", trend: "up" as const },
  { label: "Cancellations", value: "3", prev: "4", trend: "up" as const },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month")
  const [mounted, setMounted] = useState(false)
  const [showForecast, setShowForecast] = useState(false) // Hackathon Feature

  useEffect(() => { setMounted(true) }, [])

  const activeChartData = showForecast ? forecastMonthlyData : historicalMonthlyData

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-blur-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#3D5A3A] tracking-tight">Analytics</h1>
          <p className="text-sm font-sans text-[#6E6960] mt-1 font-medium">Core business performance metrics and demand predictions</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* AI Forecast Toggle Button */}
          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              showForecast
                ? "bg-[#C4A76C] text-[#FAFAF7] border-[#C4A76C] shadow-xs"
                : "bg-white text-[#6E6960] border-[#E2D9CE]/60 hover:text-[#3D5A3A]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Projected Demand</span>
          </button>

          {/* Tab Selector */}
          <div className="flex items-center bg-[#E8E0D6]/40 rounded-xl p-1 border border-[#E2D9CE]/40 shadow-xs">
            {(["week", "month", "quarter"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  period === p
                    ? "bg-[#3D5A3A] text-[#FAFAF7] shadow-md shadow-[#3D5A3A]/10 scale-[1.02]"
                    : "text-[#6E6960] hover:text-[#3D5A3A]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi) => {
          const isUp = kpi.trend === "up"
          const isNoShow = kpi.label === "No-show Rate" || kpi.label === "Cancellations"
          
          // Color coding direction for bad metrics
          const isPositiveTrend = isNoShow ? !isUp : isUp

          return (
            <div key={kpi.label} className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-28">
              <span className="text-[10px] text-[#6E6960] font-bold uppercase tracking-wider font-sans">{kpi.label}</span>
              <p className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight font-sans mt-1">{kpi.value}</p>
              
              <div className="flex items-center gap-1.5 mt-2">
                {kpi.trend === "up" ? (
                  <TrendingUp className={`w-3.5 h-3.5 ${isPositiveTrend ? "text-emerald-600" : "text-red-500"}`} />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className={`w-3.5 h-3.5 ${isPositiveTrend ? "text-emerald-600" : "text-red-500"}`} />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className="text-[10px] text-[#6E6960] font-bold font-sans">
                  vs {kpi.prev} last cycle
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Monthly trend area chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3D5A3A]">Bookings & Revenue Performance</h3>
            <p className="text-xs text-[#6E6960] font-sans">Compare monthly active transactions against historical and predictive curves</p>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider font-sans text-[#6E6960]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A3A]" />
              Historical Revenue
            </span>
            {showForecast && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4A76C]" />
                Projected Revenue
              </span>
            )}
          </div>
        </div>

        <div className="h-[280px] w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3D5A3A" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3D5A3A" stopOpacity={0.01} />
                  </linearGradient>
                  {showForecast && (
                    <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4A76C" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#C4A76C" stopOpacity={0.01} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid #E2D9CE",
                    fontSize: 11,
                    background: "rgba(250,250,247,0.95)",
                    boxShadow: "0 10px 30px rgba(61,90,58,0.06)",
                    fontFamily: "var(--font-sans)"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-sans)", paddingTop: "10px" }} />
                
                {/* Historical Area */}
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#3D5A3A" fill="url(#gradRevenue)" strokeWidth={2.5} name="Revenue (₹)" />
                
                {/* AI Forecast Area */}
                {showForecast && (
                  <Area yAxisId="right" type="monotone" dataKey="forecastRevenue" stroke="#C4A76C" fill="url(#gradForecast)" strokeWidth={2} strokeDasharray="4 4" name="Projected (₹)" />
                )}
                
                <Bar yAxisId="left" dataKey="bookings" fill="#7A9A6D" radius={[5, 5, 0, 0]} opacity={0.7} name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Service breakdown + Best Performing days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Top Services Bar chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-5">Top Performing Services</h3>
          <div className="h-[230px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceBreakdown} layout="vertical" margin={{ top: 0, right: 5, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.4} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#1A1A1A", fontWeight: "bold" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2D9CE", fontSize: 10, background: "rgba(250,250,247,0.95)" }} />
                  <Bar dataKey="bookings" fill="#3D5A3A" radius={[0, 6, 6, 0]} name="Bookings" maxBarSize={16}>
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Best Performing Days Bar chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[#3D5A3A] mb-5">Weekly Traffic Distribution</h3>
          <div className="h-[230px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayPerformance} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={0.4} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6E6960", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2D9CE", fontSize: 10, background: "rgba(250,250,247,0.95)" }} />
                  <Bar dataKey="bookings" radius={[6, 6, 0, 0]} name="Bookings" maxBarSize={24}>
                    {dayPerformance.map((entry, idx) => (
                      <Cell key={idx} fill={entry.bookings >= 10 ? "#3D5A3A" : entry.bookings >= 6 ? "#7A9A6D" : "#E8E0D6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Stylist rankings + Guests split + Sentiment Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Stylist Rankings */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3D5A3A]">Stylist Share</h3>
            <p className="text-xs text-[#6E6960] font-sans">Stylist booking contribution breakdown</p>
          </div>

          <div className="space-y-4 my-4">
            {stylistPerformance.map((s, i) => {
              const maxBookings = Math.max(...stylistPerformance.map((x) => x.bookings))
              const pct = (s.bookings / maxBookings) * 100
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#E8E0D6]/60 flex items-center justify-center font-serif text-[10px] font-bold text-[#3D5A3A]">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-[#1A1A1A] font-sans">{s.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold font-sans">
                      <span className="text-[#6E6960]">{s.bookings} bookings</span>
                      <span className="text-[#3D5A3A]">₹{s.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-[#E8E0D6]/40 overflow-hidden border border-[#E2D9CE]/20">
                    <div className="h-full rounded-full bg-gradient-to-r transition-all duration-1000" style={{ width: `${pct}%`, backgroundImage: `linear-gradient(to right, ${s.color}, #7A9A6D)` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* New vs Returning Guest split Pie chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3D5A3A]">Client Acquisition</h3>
            <p className="text-xs text-[#6E6960] font-sans">Ratio of new vs. returning bookings</p>
          </div>

          <div className="flex items-center justify-center my-2 h-[150px]">
            {mounted && (
              <PieChart width={140} height={140}>
                <Pie data={customerPieData} cx={70} cy={70} innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value" stroke="none">
                  {customerPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2D9CE", fontSize: 10, background: "rgba(250,250,247,0.95)" }} formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            )}
          </div>

          <div className="space-y-1.5 border-t border-[#E2D9CE]/30 pt-3">
            {customerPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-sans text-[#6E6960] font-medium">{d.name}</span>
                <span className="ml-auto text-[10px] font-extrabold text-[#1A1A1A] font-sans">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Feedback Sentiment Analysis (Hackathon Feature!) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-[#E2D9CE]/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#3D5A3A]">Guest Sentiment</h3>
              <p className="text-xs text-[#6E6960] font-sans">Reviews aggregated score</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#C4A76C]/15 border border-[#C4A76C]/25 text-[#C4A76C] flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="flex items-center justify-center my-2 h-[150px]">
            {mounted && (
              <PieChart width={140} height={140}>
                <Pie data={sentimentPieData} cx={70} cy={70} innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value" stroke="none">
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2D9CE", fontSize: 10, background: "rgba(250,250,247,0.95)" }} formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            )}
          </div>

          <div className="space-y-1.5 border-t border-[#E2D9CE]/30 pt-3">
            {sentimentPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-sans text-[#6E6960] font-medium">{d.name}</span>
                <span className="ml-auto text-[10px] font-extrabold text-[#1A1A1A] font-sans">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
