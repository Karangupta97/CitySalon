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
  GripVertical,
  RotateCcw,
  Percent,
  Clock,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Maximize2,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  MessageSquare,
  Send,
  Check
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
  Cell
} from "recharts"
import { format, subDays, startOfWeek, endOfWeek } from "date-fns"
import { DateRange } from "react-day-picker"

import { getAnalyticsData, AnalyticsDataset, RecentBookingData } from "@/lib/mockAnalytics"
import { ChartCard } from "@/components/owner/ChartCard"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Custom Tooltip for Recharts (Linear/Stripe Dark Style) ───
const DarkChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-2.5 rounded-lg shadow-xl text-xs font-mono select-none">
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
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-06") // For Month selector
  const [selectedYear, setSelectedYear] = useState<string>("2026") // For Year selector
  
  // Custom Date Range State
  const [customRange, setCustomRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  })

  // ─── Canva-style Grid Coordinates and Positions ───
  interface CardPosition {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  const DEFAULT_POSITIONS: Record<string, CardPosition> = {
    "studio-insights": { x: 0, y: 0, w: 4, h: 5 },
    "revenue-trend": { x: 4, y: 0, w: 8, h: 5 },
    "service-breakdown": { x: 0, y: 5, w: 4, h: 4 },
    "heatmap": { x: 4, y: 5, w: 8, h: 4 },
    "funnel": { x: 0, y: 9, w: 4, h: 4 },
    "transactions": { x: 4, y: 9, w: 8, h: 5 },
  }

  const WORKSPACE_PRESETS: Record<string, { label: string; positions: Record<string, CardPosition> }> = {
    default: {
      label: "Default Layout",
      positions: DEFAULT_POSITIONS
    },
    studio: {
      label: "Creator Studio Focus",
      positions: {
        "studio-insights": { x: 0, y: 0, w: 6, h: 6 },
        "funnel": { x: 6, y: 0, w: 6, h: 6 },
        "revenue-trend": { x: 0, y: 6, w: 8, h: 5 },
        "service-breakdown": { x: 8, y: 6, w: 4, h: 5 },
        "transactions": { x: 0, y: 11, w: 12, h: 5 },
        "heatmap": { x: 0, y: 16, w: 12, h: 4 },
      }
    },
    financial: {
      label: "Financial Audit Focus",
      positions: {
        "revenue-trend": { x: 0, y: 0, w: 12, h: 5 },
        "transactions": { x: 0, y: 5, w: 8, h: 5 },
        "service-breakdown": { x: 8, y: 5, w: 4, h: 5 },
        "studio-insights": { x: 0, y: 10, w: 4, h: 5 },
        "heatmap": { x: 4, y: 10, w: 8, h: 5 },
        "funnel": { x: 0, y: 15, w: 12, h: 4 },
      }
    },
    operations: {
      label: "Operations & Traffic",
      positions: {
        "heatmap": { x: 0, y: 0, w: 8, h: 5 },
        "service-breakdown": { x: 8, y: 0, w: 4, h: 5 },
        "funnel": { x: 0, y: 5, w: 4, h: 5 },
        "revenue-trend": { x: 4, y: 5, w: 8, h: 5 },
        "studio-insights": { x: 0, y: 10, w: 4, h: 5 },
        "transactions": { x: 4, y: 10, w: 8, h: 5 },
      }
    },
    compact: {
      label: "Compact Density Layout",
      positions: {
        "studio-insights": { x: 0, y: 0, w: 4, h: 4 },
        "revenue-trend": { x: 4, y: 0, w: 8, h: 4 },
        "service-breakdown": { x: 0, y: 4, w: 4, h: 4 },
        "heatmap": { x: 4, y: 4, w: 4, h: 4 },
        "funnel": { x: 8, y: 4, w: 4, h: 4 },
        "transactions": { x: 0, y: 8, w: 12, h: 4 },
      }
    }
  }

  const [positions, setPositions] = useState<Record<string, CardPosition>>({})

  // Custom Pointer Interaction State
  interface DragState {
    cardId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    currentCol: number;
    currentRow: number;
    offsetX: number;
    offsetY: number;
  }

  interface ResizeState {
    cardId: string;
    startX: number;
    startY: number;
    initialW: number;
    initialH: number;
    currentW: number;
    currentH: number;
    direction: "right" | "bottom" | "corner";
  }

  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  // YouTube Studio Features State (Review replies)
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [replies, setReplies] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("owner-studio-replies-v1")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Chart Metric Mode: "both" | "revenue" | "bookings"
  const [chartMode, setChartMode] = useState<"both" | "revenue" | "bookings">("both")

  // Booking search & pagination
  const [bookingSearch, setBookingSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Trigger mounts & restore positions from localStorage
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("owner-analytics-canvas-positions-v6")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length === Object.keys(DEFAULT_POSITIONS).length) {
            setPositions(parsed)
          } else {
            setPositions(DEFAULT_POSITIONS)
          }
        } catch (e) {
          setPositions(DEFAULT_POSITIONS)
        }
      } else {
        setPositions(DEFAULT_POSITIONS)
      }
    }
  }, [])

  // Persist replies changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("owner-studio-replies-v1", JSON.stringify(replies))
    }
  }, [replies, mounted])

  // Drag Pointer handlers
  const handleDragPointerDown = (e: React.PointerEvent, cardId: string) => {
    if (e.button !== 0) return // left click only
    e.preventDefault()

    const cardPos = positions[cardId]
    if (!cardPos) return

    setDragState({
      cardId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: cardPos.x,
      initialY: cardPos.y,
      currentCol: cardPos.x,
      currentRow: cardPos.y,
      offsetX: 0,
      offsetY: 0
    })

    const targetElement = e.currentTarget as HTMLElement
    targetElement.setPointerCapture(e.pointerId)
  }

  const handleDragPointerMove = (e: React.PointerEvent) => {
    if (!dragState) return
    e.preventDefault()

    const canvasElement = document.getElementById("analytics-canvas")
    if (!canvasElement) return

    const rect = canvasElement.getBoundingClientRect()
    const gap = 16
    const colWidth = (rect.width - 11 * gap) / 12
    const colWidthWithGap = colWidth + gap
    const rowHeightWithGap = 100 + gap

    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY

    const dCol = Math.round(dx / colWidthWithGap)
    const dRow = Math.round(dy / rowHeightWithGap)

    const cardPos = positions[dragState.cardId]
    if (!cardPos) return

    const targetX = Math.min(12 - cardPos.w, Math.max(0, dragState.initialX + dCol))
    const targetY = Math.max(0, dragState.initialY + dRow)

    setDragState(prev => prev ? {
      ...prev,
      offsetX: dx,
      offsetY: dy,
      currentCol: targetX,
      currentRow: targetY
    } : null)
  }

  const handleDragPointerUp = (e: React.PointerEvent) => {
    if (!dragState) return
    e.preventDefault()
    
    const targetElement = e.currentTarget as HTMLElement
    try {
      targetElement.releasePointerCapture(e.pointerId)
    } catch (err) {}

    const finalX = dragState.currentCol
    const finalY = dragState.currentRow
    const cardId = dragState.cardId
    const cardPos = positions[cardId]

    if (cardPos) {
      const nextPositions = { ...positions }
      let resolvedY = finalY
      let hasOverlap = true

      // Overlap Resolution Algorithm ("auto adjacent anywhere")
      while (hasOverlap) {
        hasOverlap = false
        for (const [id, pos] of Object.entries(nextPositions)) {
          if (id === cardId) continue
          const overlapX = finalX < pos.x + pos.w && finalX + cardPos.w > pos.x
          const overlapY = resolvedY < pos.y + pos.h && resolvedY + cardPos.h > pos.y
          if (overlapX && overlapY) {
            resolvedY = pos.y + pos.h
            hasOverlap = true
            break
          }
        }
      }

      nextPositions[cardId] = {
        ...cardPos,
        x: finalX,
        y: resolvedY
      }

      setPositions(nextPositions)
      localStorage.setItem("owner-analytics-canvas-positions-v6", JSON.stringify(nextPositions))
    }

    setDragState(null)
  }

  // Resize Pointer handlers
  const handleResizePointerDown = (e: React.PointerEvent, cardId: string, direction: "right" | "bottom" | "corner") => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    const cardPos = positions[cardId]
    if (!cardPos) return

    setResizeState({
      cardId,
      startX: e.clientX,
      startY: e.clientY,
      initialW: cardPos.w,
      initialH: cardPos.h,
      currentW: cardPos.w,
      currentH: cardPos.h,
      direction
    })

    const targetElement = e.currentTarget as HTMLElement
    targetElement.setPointerCapture(e.pointerId)
  }

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!resizeState) return
    e.preventDefault()

    const canvasElement = document.getElementById("analytics-canvas")
    if (!canvasElement) return

    const rect = canvasElement.getBoundingClientRect()
    const gap = 16
    const colWidth = (rect.width - 11 * gap) / 12
    const colWidthWithGap = colWidth + gap
    const rowHeightWithGap = 100 + gap

    const dx = e.clientX - resizeState.startX
    const dy = e.clientY - resizeState.startY

    let targetW = resizeState.initialW
    let targetH = resizeState.initialH

    const cardPos = positions[resizeState.cardId]
    if (!cardPos) return

    if (resizeState.direction === "right" || resizeState.direction === "corner") {
      const dCol = Math.round(dx / colWidthWithGap)
      targetW = Math.min(12 - cardPos.x, Math.max(2, resizeState.initialW + dCol))
    }

    if (resizeState.direction === "bottom" || resizeState.direction === "corner") {
      const dRow = Math.round(dy / rowHeightWithGap)
      targetH = Math.max(2, Math.min(10, resizeState.initialH + dRow))
    }

    setResizeState(prev => prev ? {
      ...prev,
      currentW: targetW,
      currentH: targetH
    } : null)
  }

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (!resizeState) return
    e.preventDefault()

    const targetElement = e.currentTarget as HTMLElement
    try {
      targetElement.releasePointerCapture(e.pointerId)
    } catch (err) {}

    const finalW = resizeState.currentW
    const finalH = resizeState.currentH
    const cardId = resizeState.cardId
    const cardPos = positions[cardId]

    if (cardPos) {
      const nextPositions = {
        ...positions,
        [cardId]: {
          ...cardPos,
          w: finalW,
          h: finalH
        }
      }
      setPositions(nextPositions)
      localStorage.setItem("owner-analytics-canvas-positions-v6", JSON.stringify(nextPositions))
    }

    setResizeState(null)
  }

  const resetLayout = () => {
    setPositions(DEFAULT_POSITIONS)
    localStorage.setItem("owner-analytics-canvas-positions-v6", JSON.stringify(DEFAULT_POSITIONS))
  }

  const isLayoutModified = () => {
    return JSON.stringify(positions) !== JSON.stringify(DEFAULT_POSITIONS)
  }

  const getActivePresetKey = () => {
    for (const [key, preset] of Object.entries(WORKSPACE_PRESETS)) {
      if (JSON.stringify(positions) === JSON.stringify(preset.positions)) {
        return key
      }
    }
    return "custom"
  }

  const getCardStyle = (cardId: string) => {
    const cardPos = positions[cardId]
    if (!cardPos) return {}

    const isDragging = dragState && dragState.cardId === cardId
    const isResizing = resizeState && resizeState.cardId === cardId

    const x = cardPos.x
    const y = cardPos.y
    const w = isResizing ? resizeState.currentW : cardPos.w
    const h = isResizing ? resizeState.currentH : cardPos.h

    return {
      position: "absolute" as const,
      left: `calc((100% - 11 * 16px) / 12 * ${x} + ${x} * 16px)`,
      width: `calc((100% - 11 * 16px) / 12 * ${w} + ${w - 1} * 16px)`,
      top: `calc(${y} * 100px + ${y} * 16px)`,
      height: `calc(${h} * 100px + ${h - 1} * 16px)`,
      transform: isDragging ? `translate3d(${dragState.offsetX}px, ${dragState.offsetY}px, 0)` : undefined,
      transition: isDragging || isResizing ? "none" : "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      zIndex: isDragging ? 50 : isResizing ? 40 : 10,
    }
  }

  const getCanvasHeight = () => {
    let maxBottom = 0
    Object.entries(positions).forEach(([id, pos]) => {
      let h = pos.h
      if (resizeState && resizeState.cardId === id) {
        h = resizeState.currentH
      }
      let bottom = pos.y + h
      if (dragState && dragState.cardId === id) {
        bottom = dragState.currentRow + h
      }
      if (bottom > maxBottom) {
        maxBottom = bottom
      }
    })
    return maxBottom * (100 + 16) + 32
  }

  const renderGhostPreview = () => {
    if (!dragState) return null
    const cardPos = positions[dragState.cardId]
    if (!cardPos) return null

    const x = dragState.currentCol
    const y = dragState.currentRow
    const w = cardPos.w
    const h = cardPos.h

    return (
      <div
        className="absolute border-2 border-dashed border-[#3D5A3A]/40 bg-[#3D5A3A]/5 rounded-xl pointer-events-none transition-all duration-75"
        style={{
          left: `calc((100% - 11 * 16px) / 12 * ${x} + ${x} * 16px)`,
          width: `calc((100% - 11 * 16px) / 12 * ${w} + ${w - 1} * 16px)`,
          top: `calc(${y} * 100px + ${y} * 16px)`,
          height: `calc(${h} * 100px + ${h - 1} * 16px)`,
          zIndex: 5,
        }}
      />
    )
  }

  // Send review reply
  const sendReply = (reviewId: string) => {
    const text = replyInputs[reviewId]
    if (!text || !text.trim()) return

    setReplies(prev => ({
      ...prev,
      [reviewId]: text.trim()
    }))
    setReplyInputs(prev => ({
      ...prev,
      [reviewId]: ""
    }))
  }

  // Options lists for month
  const getMonthOptions = () => {
    return [
      { value: "2026-01", label: "Jan 2026" },
      { value: "2026-02", label: "Feb 2026" },
      { value: "2026-03", label: "Mar 2026" },
      { value: "2026-04", label: "Apr 2026" },
      { value: "2026-05", label: "May 2026" },
      { value: "2026-06", label: "Jun 2026" },
      { value: "2026-07", label: "Jul 2026" },
      { value: "2026-08", label: "Aug 2026" },
      { value: "2026-09", label: "Sep 2026" },
      { value: "2026-10", label: "Oct 2026" },
      { value: "2026-11", label: "Nov 2026" },
      { value: "2026-12", label: "Dec 2026" },
    ]
  }

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

  if (!mounted || Object.keys(positions).length === 0) {
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
    { name: "1. Profile Visitors", count: Math.round(totalBksNum * 5.2), pct: 100, label: "Discovery" },
    { name: "2. Checked Calendar", count: Math.round(totalBksNum * 2.8), pct: Math.round((2.8 / 5.2) * 100), label: "Intent" },
    { name: "3. Initiated Booking", count: Math.round(totalBksNum * 1.4), pct: Math.round((1.4 / 5.2) * 100), label: "Checkout" },
    { name: "4. Completed Booking", count: totalBksNum, pct: Math.round((1.0 / 5.2) * 100), label: "Success" },
    { name: "5. Rebooked / Loyal", count: Math.round(totalBksNum * (parseFloat(data.kpis.repeatCustomerRate.value) / 100)), pct: Math.round(((totalBksNum * (parseFloat(data.kpis.repeatCustomerRate.value) / 100)) / (totalBksNum * 5.2)) * 100), label: "Loyalty" }
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

  // Visual drag grip handle in header (pointer dragging)
  const cardTitleWithControls = (cardId: string, titleText: string) => (
    <div className="flex items-center gap-1.5 select-none shrink-0 font-sans">
      
      {/* Drag Grip Handle */}
      <div
        onPointerDown={(e) => handleDragPointerDown(e, cardId)}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        className="flex items-center gap-0.5 cursor-grab active:cursor-grabbing group p-1 -m-1 touch-none"
        title="Drag card to move"
      >
        <GripVertical className="w-3.5 h-3.5 text-stone-400 opacity-50 group-hover:opacity-90 transition-opacity" />
      </div>

      <span className="font-serif text-base font-bold text-[#3D5A3A] tracking-tight mr-1">
        {titleText}
      </span>

      {/* Grid Coordinates Badge */}
      {positions[cardId] && (
        <span className="font-mono text-[8px] text-[#6E6960]/60 font-bold bg-[#E8E0D6]/30 px-1 py-0.5 rounded">
          {positions[cardId].w} × {positions[cardId].h}
        </span>
      )}

    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-5 animate-blur-in select-none">
      
      {/* ─── Header & Date Controls ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E2D9CE]/30 pb-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[#3D5A3A] tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-[11px] font-sans text-[#6E6960] mt-0.5 font-semibold leading-normal">
            Operational Audit Statement:{" "}
            <span className="text-[#3D5A3A] font-bold underline font-mono">{data.periodLabel}</span>
          </p>
        </div>

        {/* ─── Unified Period Picker Bar ─── */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Segmented Preset Bar */}
          <div className="flex items-center bg-[#E8E0D6]/30 rounded-lg p-0.5 border border-[#E2D9CE]/45 shadow-xs">
            {(["day", "week", "month", "quarter", "year", "festival", "custom"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodChange(p)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  period === p
                    ? "bg-[#3D5A3A] text-white shadow-xs"
                    : "text-[#6E6960] hover:text-[#3D5A3A]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Sub-Option Selector */}
          <div className="flex items-center gap-2">
            
            {/* Day Sub-picker */}
            {period === "day" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                    {format(singleDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={singleDate}
                    onSelect={(date) => date && setSingleDate(date)}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Week Sub-picker */}
            {period === "week" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20">
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
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] w-36">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2D9CE]/40 text-stone-850">
                  {getMonthOptions().map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Quarter Sub-picker */}
            {period === "quarter" && (
              <Select value={subOption} onValueChange={setSubOption}>
                <SelectTrigger className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] w-24">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2D9CE]/40 text-stone-850">
                  <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Year Sub-picker */}
            {period === "year" && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] w-24">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2D9CE]/40 text-stone-850">
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Festival Sub-picker */}
            {period === "festival" && (
              <Select value={subOption} onValueChange={setSubOption}>
                <SelectTrigger className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] w-48">
                  <SelectValue placeholder="Festival Preset" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2D9CE]/40 text-stone-850">
                  <SelectItem value="diwali">Diwali (Oct 28 - Nov 03)</SelectItem>
                  <SelectItem value="eid">Eid Festive Week</SelectItem>
                  <SelectItem value="christmas">Christmas & New Year</SelectItem>
                  <SelectItem value="wedding">Wedding Peak Season</SelectItem>
                  <SelectItem value="holi">Holi Spikes</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Custom Range Sub-picker */}
            {period === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-mono font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20">
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

            {/* Workspace Preset Selector */}
            <Select
              value={getActivePresetKey()}
              onValueChange={(val) => {
                if (val !== "custom" && WORKSPACE_PRESETS[val]) {
                  setPositions(WORKSPACE_PRESETS[val].positions)
                  localStorage.setItem("owner-analytics-canvas-positions-v6", JSON.stringify(WORKSPACE_PRESETS[val].positions))
                }
              }}
            >
              <SelectTrigger className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] w-48 shadow-xs">
                <SelectValue placeholder="Workspace Layout" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E2D9CE]/40 text-stone-850">
                {Object.entries(WORKSPACE_PRESETS).map(([key, p]) => (
                  <SelectItem key={key} value={key}>
                    {p.label}
                  </SelectItem>
                ))}
                {getActivePresetKey() === "custom" && (
                  <SelectItem value="custom" disabled>
                    Custom Layout *
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Reset Layout Button */}
            {isLayoutModified() && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetLayout}
                className="h-8 border-[#E2D9CE]/40 bg-white text-xs font-bold text-[#3D5A3A] hover:bg-[#E8E0D6]/20 px-2.5"
                title="Reset layout and sizes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}

          </div>

        </div>
      </div>

      {/* ─── KPI Row (6 Cards, Tightened Layout) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {(Object.keys(data.kpis) as Array<keyof typeof data.kpis>).map((key) => {
          const kpi = data.kpis[key]
          const isUp = kpi.trend === "up"
          const isPositiveTrend = kpi.isNegativeBetter ? !isUp : isUp
          const strokeColor = isPositiveTrend ? "#10b981" : "#f43f5e"
          const sparklineData = kpi.sparkline.map((val, idx) => ({ id: idx, value: val }))

          return (
            <div
              key={key}
              className="p-3 rounded-lg bg-white border border-[#E2D9CE]/45 hover:border-[#3D5A3A]/30 transition-all duration-200 flex flex-col justify-between h-[105px] overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#6E6960] font-bold uppercase tracking-wider font-sans truncate pr-2">
                  {kpi.label}
                </span>
                
                <span
                  className={cn(
                    "text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0",
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

              <div className="mt-0.5">
                <p className="text-lg font-extrabold text-[#1A1A1A] tracking-tight font-mono tabular-nums leading-none">
                  {kpi.value}
                </p>
                <p className="text-[8px] text-[#6E6960] font-sans font-medium mt-0.5">
                  Prev: <span className="font-mono">{kpi.prevValue}</span>
                </p>
              </div>

              <div className="h-5 w-full mt-1.5 -mx-1 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={strokeColor}
                      strokeWidth={1.2}
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

      {/* ─── Custom Canva-style Free-Moving & Resizable Canvas ─── */}
      <div
        id="analytics-canvas"
        className="relative w-full rounded-2xl border border-[#E2D9CE]/50 p-4 transition-all duration-300 overflow-hidden"
        style={{
          height: `${getCanvasHeight()}px`,
          backgroundImage: "radial-gradient(circle, rgba(61, 90, 58, 0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          backgroundColor: "rgba(250, 250, 247, 0.25)"
        }}
      >
               {Object.keys(positions).map((cardId) => {
          const cardPos = positions[cardId]
          if (!cardPos) return null

          const isDragging = dragState && dragState.cardId === cardId
          const isResizing = resizeState && resizeState.cardId === cardId

          const w = isResizing ? resizeState.currentW : cardPos.w
          const h = isResizing ? resizeState.currentH : cardPos.h

          const cardStyle = getCardStyle(cardId)

          // Border resize handle elements
          const resizeRightHandle = (
            <div
              onPointerDown={(e) => handleResizePointerDown(e, cardId, "right")}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-30 touch-none hover:bg-stone-300/10 transition-colors"
              title="Drag right edge to resize width"
            />
          )

          const resizeBottomHandle = (
            <div
              onPointerDown={(e) => handleResizePointerDown(e, cardId, "bottom")}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize z-30 touch-none hover:bg-stone-300/10 transition-colors"
              title="Drag bottom edge to resize height"
            />
          )

          const resizeCornerHandle = (
            <div
              onPointerDown={(e) => handleResizePointerDown(e, cardId, "corner")}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-end justify-end select-none z-30 touch-none opacity-0 group-hover/card:opacity-100 transition-opacity"
              title="Drag corner to resize card size"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" className="text-stone-400 dark:text-stone-500">
                <path d="M8 0L0 8M8 3L3 8M8 6L6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          )

          switch (cardId) {
            
            case "studio-insights": {
              // YouTube Studio style reviews list
              const studioReviews = [
                { id: "rev-1", author: "Priya Sharma", rating: 5, text: "The facial cleanup was extremely relaxing. Will visit again!", service: "Facial" },
                { id: "rev-2", author: "Rohit Kapoor", rating: 4, text: "Quick beard trim by Raj. Nice clean setup.", service: "Beard Trim" }
              ]

              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Creator Studio Insights")}
                  subtitle={h < 4 ? undefined : "Latest checkout audit & interactive review replies"}
                  w={w}
                  h={h}
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className="flex flex-col w-full h-full justify-between">
                    {/* Latest Checkout Stats (YouTube Studio Video Performance style) */}
                    <div className={cn("pb-2 select-none", h <= 2 ? "" : "border-b border-[#E2D9CE]/30")}>
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="text-[8px] font-bold text-[#C4A76C] uppercase font-mono tracking-wider">Latest Session Performance</p>
                          <h4 className="text-[10px] font-extrabold text-[#1A1A1A] font-sans mt-0.5 truncate">Bridal Package — Kavya Reddy</h4>
                        </div>
                        {w >= 5 && (
                          <span className="text-[7px] font-bold px-1.5 py-0.5 bg-[#3D5A3A]/10 text-[#3D5A3A] rounded font-sans shrink-0">
                            20m ago
                          </span>
                        )}
                      </div>

                      {h >= 2 && (
                        <div className={cn("grid gap-1 mt-1.5 bg-stone-50/50 rounded-lg border border-[#E2D9CE]/25", h <= 2 ? "grid-cols-2 p-1.5" : "grid-cols-1 p-2")}>
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-[#6E6960] font-semibold">Revenue Rank:</span>
                            <span className="font-mono font-extrabold text-[#3D5A3A] flex items-center gap-0.5">
                              1 of 10 <TrendingUp className="w-2.5 h-2.5 text-emerald-700" />
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-[#6E6960] font-semibold">Total Value:</span>
                            <span className="font-mono font-extrabold text-[#1A1A1A]">₹6,500</span>
                          </div>
                          {h >= 3 && (
                            <div className="flex items-center justify-between text-[9px] col-span-full border-t border-[#E2D9CE]/20 pt-1 mt-1">
                              <span className="text-[#6E6960] font-semibold">Rating Status:</span>
                              <span className="font-mono font-extrabold text-[#3D5A3A] flex items-center gap-0.5">
                                5.0 ★ <Star className="w-2.5 h-2.5 fill-[#C4A76C] text-[#C4A76C]" />
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Recent Customer Reviews & Interactive Replies */}
                    {h >= 3 && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#3D5A3A]" />
                          <h4 className="text-[10px] font-extrabold text-[#1A1A1A] font-sans">Recent Reviews</h4>
                        </div>

                        <div className="space-y-1.5">
                          {studioReviews.slice(0, h <= 3 ? 1 : 2).map((rev) => {
                            const hasReply = !!replies[rev.id]

                            return (
                              <div key={rev.id} className="p-1.5 rounded-lg border border-[#E2D9CE]/30 bg-[#FAFAF7]/45 text-[9px] space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-[#1A1A1A]">{rev.author}</span>
                                  {w >= 5 && (
                                    <div className="flex items-center gap-0.5">
                                      {Array.from({ length: rev.rating }).map((_, i) => (
                                        <Star key={i} className="w-2 h-2 text-[#C4A76C] fill-current" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <p className="text-[#6E6960] font-medium leading-relaxed italic truncate">
                                  "{rev.text}"
                                </p>

                                {/* Render threaded conversation responses */}
                                {hasReply ? (
                                  <div className="bg-[#3D5A3A]/5 border border-[#3D5A3A]/10 p-1 rounded mt-1 flex items-start gap-1">
                                    <div className="w-3 h-3 rounded bg-[#3D5A3A]/10 border border-[#3D5A3A]/20 flex items-center justify-center text-[7px] font-bold text-[#3D5A3A] shrink-0 mt-0.5">O</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[7px] font-bold text-[#3D5A3A]">Owner Reply</p>
                                      <p className="text-[8px] text-[#1A1A1A] font-sans mt-0.5 leading-normal truncate">
                                        {replies[rev.id]}
                                      </p>
                                    </div>
                                    <Check className="w-2 h-2 text-[#3D5A3A] shrink-0 mt-0.5" />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-stone-200/40">
                                    <input
                                      type="text"
                                      placeholder="Reply..."
                                      value={replyInputs[rev.id] || ""}
                                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                      className="flex-1 bg-white border border-[#E2D9CE]/35 rounded px-1.5 py-0.5 text-[8px] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]/60"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => sendReply(rev.id)}
                                      className="h-4.5 px-1 bg-[#3D5A3A] hover:bg-[#2B3F29] text-white text-[7px] font-bold uppercase rounded flex items-center gap-0.5 cursor-pointer shrink-0"
                                    >
                                      <Send className="w-1.5 h-1.5" />
                                      Reply
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </ChartCard>
              )
            }

            case "revenue-trend":
              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Revenue & Booking Trends")}
                  subtitle={h < 4 ? undefined : "Financial auditing curves matching selected intervals"}
                  w={w}
                  h={h}
                  headerActions={
                    w < 5 ? (
                      <span className="text-[9px] font-bold text-[#3D5A3A] bg-[#3D5A3A]/10 px-2 py-0.5 rounded font-mono uppercase">
                        {chartMode}
                      </span>
                    ) : (
                      <div className="flex items-center bg-[#E8E0D6]/20 rounded-lg p-0.5 border border-[#E2D9CE]/30">
                        {(["both", "revenue", "bookings"] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setChartMode(m)
                            }}
                            className={`px-2 py-0.5 rounded-md text-[8px] font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                              chartMode === m ? "bg-[#3D5A3A] text-white shadow-xs" : "text-[#6E6960] hover:text-[#3D5A3A]"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )
                  }
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className="w-full h-full flex flex-col justify-between">
                    <div className={cn("flex-1 w-full", h <= 2 ? "min-h-[50px]" : "min-h-[100px]")}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chartData} margin={{ top: 10, right: 5, left: h <= 2 ? -40 : -20, bottom: 0 }}>
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
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={h <= 2 ? 0.05 : 0.3} vertical={false} />
                          <XAxis
                            dataKey="label"
                            tick={h <= 2 ? false : { fontSize: 8, fill: "#6E6960", fontWeight: "bold" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          {(chartMode === "both" || chartMode === "revenue") && (
                            <YAxis
                              yAxisId="rev"
                              orientation="left"
                              tick={h <= 2 ? false : { fontSize: 8, fill: "#6E6960", fontWeight: "bold" }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                              width={h <= 2 ? 0 : 25}
                            />
                          )}
                          {(chartMode === "both" || chartMode === "bookings") && (
                            <YAxis
                              yAxisId="bks"
                              orientation={chartMode === "bookings" ? "left" : "right"}
                              tick={h <= 2 ? false : { fontSize: 8, fill: "#6E6960", fontWeight: "bold" }}
                              axisLine={false}
                              tickLine={false}
                              width={h <= 2 ? 0 : 20}
                            />
                          )}
                          
                          <Tooltip content={<DarkChartTooltip />} />

                          {(chartMode === "both" || chartMode === "revenue") && (
                            <Area
                              yAxisId="rev"
                              type="monotone"
                              dataKey="revenue"
                              stroke="#3D5A3A"
                              fill="url(#primaryRevenueGrad)"
                              strokeWidth={1.8}
                              name="Revenue (₹)"
                            />
                          )}

                          {(chartMode === "both" || chartMode === "bookings") && (
                            <Area
                              yAxisId="bks"
                              type="monotone"
                              dataKey="bookings"
                              stroke="#7A9A6D"
                              fill="url(#primaryBookingsGrad)"
                              strokeWidth={1.8}
                              name="Bookings"
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </ChartCard>
              )

            case "service-breakdown":
              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card flex flex-col justify-between",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Service Division")}
                  subtitle={h < 4 ? undefined : "Bookings share split by catalog items"}
                  w={w}
                  h={h}
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className="w-full h-full flex flex-col justify-between">
                    <div className={cn("flex-1 w-full select-none", h <= 2 ? "min-h-[50px]" : "min-h-[100px]")}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.topServices} layout="vertical" margin={{ top: 0, right: 5, left: h <= 2 ? -5 : 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" opacity={h <= 2 ? 0.05 : 0.3} horizontal={false} />
                          <XAxis type="number" tick={h <= 2 ? false : { fontSize: 8, fill: "#6E6960" }} axisLine={false} tickLine={false} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: h <= 2 ? 7 : 9, fill: "#1A1A1A", fontWeight: "bold" }}
                            axisLine={false}
                            tickLine={false}
                            width={h <= 2 ? 40 : 70}
                          />
                          <Tooltip content={<DarkChartTooltip />} />
                          <Bar dataKey="revenue" fill="#3D5A3A" radius={[0, 4, 4, 0]} name="Revenue (₹)" maxBarSize={12}>
                            {data.topServices.map((entry, idx) => (
                              <Cell key={idx} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {h >= 4 && (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 pt-2 border-t border-[#E2D9CE]/30 shrink-0">
                        {data.topServices.slice(0, 4).map((s) => (
                          <div key={s.name} className="flex items-center gap-1 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            <span className="text-[9px] font-semibold text-[#6E6960] truncate">{s.name}</span>
                            <span className="text-[9px] font-bold text-[#1A1A1A] ml-auto font-mono">₹{(s.revenue / 1000).toFixed(1)}k</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ChartCard>
              )

            case "heatmap":
              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Weekly Traffic Heatmap")}
                  subtitle={h < 4 ? undefined : "Hourly booking distribution audit. Peak periods fade to deep Olive"}
                  w={w}
                  h={h}
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className="w-full h-full flex flex-col justify-between">
                    <div className={cn("flex-grow flex flex-col justify-between select-none", w <= 5 ? "min-w-[300px]" : "min-w-[620px]")}>
                      
                      {/* Heatmap header: Hours row */}
                      {h >= 3 && (
                        <div className="flex items-center mb-1 text-center font-mono text-[9px] font-bold text-[#6E6960] shrink-0">
                          <div className={cn("text-left font-sans font-semibold shrink-0", w <= 5 ? "w-5" : "w-10")}>Day</div>
                          <div className={cn("flex-1 grid grid-cols-12", w <= 5 ? "gap-1" : "gap-1.5")}>
                            {Array.from({ length: 12 }, (_, i) => i + 9).map((hr, idx) => (
                              <div key={hr} className="truncate">
                                {w <= 5 && idx % 2 === 1 ? "" : (hr > 12 ? `${hr - 12}P` : hr === 12 ? "12P" : `${hr}A`)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Heatmap rows */}
                      <div className="space-y-1 flex-grow flex flex-col justify-center">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                          return (
                            <div key={day} className="flex items-center flex-1">
                              <div className={cn("text-[9px] font-bold text-[#1A1A1A] font-sans shrink-0", w <= 5 ? "w-5" : "w-10")}>{w <= 5 ? day[0] : day}</div>
                              
                              <div className={cn("flex-1 grid grid-cols-12", w <= 5 ? "gap-1" : "gap-1.5")}>
                                {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => {
                                  const cell = data.heatmap.find(h => h.day === day && h.hour === hour)
                                  const bookings = cell ? cell.bookings : 0
                                  
                                  let cellBg = "bg-stone-50 border border-stone-200/40"
                                  if (bookings >= 8) cellBg = "bg-[#3D5A3A]"
                                  else if (bookings >= 5) cellBg = "bg-[#3D5A3A]/70"
                                  else if (bookings >= 3) cellBg = "bg-[#3D5A3A]/40"
                                  else if (bookings >= 1) cellBg = "bg-[#3D5A3A]/15"

                                  const displayTime = hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`

                                  return (
                                    <div
                                      key={hour}
                                      className="relative group/cell aspect-square flex-1"
                                    >
                                      <div
                                        className={cn(
                                          "w-full h-full rounded-[4px] transition-all duration-150 cursor-pointer",
                                          cellBg,
                                          bookings >= 5 ? "hover:ring-1 hover:ring-[#1A1A1A] hover:scale-105" : "hover:bg-stone-200"
                                        )}
                                      />
                                      
                                      {/* Tooltip Popup (isolated to group/cell hover) */}
                                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block bg-slate-950 border border-slate-800 text-white text-[9px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap z-50">
                                        <span className="font-semibold text-slate-400">{day} at {displayTime}</span>
                                        <div className="text-[10px] font-bold text-white mt-0.5">{bookings} bookings</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Legend */}
                      {h >= 4 && w >= 6 && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2D9CE]/30 text-[9px] font-sans font-bold text-[#6E6960] shrink-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>Density:</span>
                            <span className="w-2 h-2 rounded bg-stone-50 border border-stone-200" />
                            <span className="font-medium text-[8px]">0</span>
                            <span className="w-2 h-2 rounded bg-[#3D5A3A]/15" />
                            <span className="font-medium text-[8px]">1-2</span>
                            <span className="w-2 h-2 rounded bg-[#3D5A3A]/40" />
                            <span className="font-medium text-[8px]">3-4</span>
                            <span className="w-2 h-2 rounded bg-[#3D5A3A]/70" />
                            <span className="font-medium text-[8px]">5-7</span>
                            <span className="w-2 h-2 rounded bg-[#3D5A3A]" />
                            <span className="font-medium text-[8px]">8+</span>
                          </div>
                          <span className="text-[8px] font-semibold text-stone-400">Hover blocks</span>
                        </div>
                      )}

                    </div>
                  </div>
                </ChartCard>
              )

            case "funnel":
              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Retention & Leakage Funnel")}
                  subtitle={h < 4 ? undefined : "Conversion rates mapping discoverability to loyalty status"}
                  w={w}
                  h={h}
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className={cn("w-full h-full flex flex-col justify-between select-none", h < 4 ? "gap-1" : "gap-3")}>
                    {funnelSteps.map((step, idx) => {
                      const previousStepCount = idx > 0 ? funnelSteps[idx - 1].count : step.count
                      const stepConversion = previousStepCount > 0 ? Math.round((step.count / previousStepCount) * 100) : 100

                      return (
                        <div key={step.name} className="flex-1 flex flex-col justify-center gap-0.5">
                          <div className={cn("flex justify-between items-center font-sans font-bold text-[#1A1A1A]", h < 3 ? "text-[8px]" : "text-[9px]")}>
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-[#6E6960] truncate">{step.name}</span>
                              {h >= 3 && <span className="text-[8px] font-mono text-stone-400 shrink-0">({step.label})</span>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono text-[#3D5A3A] font-extrabold">{step.count.toLocaleString()}</span>
                              {idx > 0 && h >= 3 && (
                                <span className="text-[7px] font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1 rounded">
                                  {stepConversion}%
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className={cn("rounded-md bg-[#E8E0D6]/15 border border-[#E2D9CE]/30 relative overflow-hidden flex items-center px-2", h < 3 ? "h-2.5" : "h-4")}>
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
                            
                            {h >= 3 && (
                              <span className="relative z-10 text-[8px] font-mono font-bold text-[#1A1A1A] ml-auto">
                                {idx === 0 ? "100%" : `${step.pct}%`}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>
              )

            case "transactions": {
              const transactionsH = h
              const dynamicItemsPerPage = transactionsH <= 3 ? 2 : transactionsH === 4 ? 3 : 5
              const localTotalPages = Math.max(1, Math.ceil(filteredBookings.length / dynamicItemsPerPage))
              const localPaginatedBookings = filteredBookings.slice((currentPage - 1) * dynamicItemsPerPage, currentPage * dynamicItemsPerPage)
              const isCompactTable = w < 6

              return (
                <ChartCard
                  key={cardId}
                  id={`card-wrapper-${cardId}`}
                  style={cardStyle}
                  className={cn(
                    "absolute overflow-hidden group/card",
                    isDragging && "opacity-35 shadow-xl scale-[1.01] pointer-events-none"
                  )}
                  title={cardTitleWithControls(cardId, "Recent Transactions Ledger")}
                  subtitle={h < 4 ? undefined : "Audit log of client triggers and completed payments"}
                  w={w}
                  h={h}
                  headerActions={
                    w >= 6 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2" />
                        <input
                          type="text"
                          placeholder="Search logs..."
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          className="pl-7 pr-2 py-1 bg-white border border-[#E2D9CE]/40 rounded-lg text-[10px] font-sans text-[#1A1A1A] focus:outline-none focus:border-[#3D5A3A]/60 w-44"
                        />
                      </div>
                    )
                  }
                >
                  {resizeRightHandle}
                  {resizeBottomHandle}
                  {resizeCornerHandle}

                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="overflow-x-auto select-none border border-[#E2D9CE]/40 rounded-lg w-full">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="bg-stone-50/50 border-b border-[#E2D9CE]/40 text-[#6E6960] font-bold uppercase text-[8px] tracking-wider">
                            {w >= 8 && <th className={isCompactTable ? "px-1.5 py-1" : "px-3 py-2"}>ID</th>}
                            <th className={isCompactTable ? "px-1.5 py-1" : "px-3 py-2"}>Client</th>
                            <th className={isCompactTable ? "px-1.5 py-1" : "px-3 py-2"}>Service</th>
                            {w >= 6 && <th className={isCompactTable ? "px-1.5 py-1" : "px-3 py-2"}>Stylist</th>}
                            {w >= 7 && <th className={isCompactTable ? "px-1.5 py-1" : "px-3 py-2"}>Date & Time</th>}
                            <th className={isCompactTable ? "px-1.5 py-1 text-right" : "px-3 py-2 text-right"}>Amount</th>
                            <th className={isCompactTable ? "px-1.5 py-1 text-center" : "px-3 py-2 text-center"}>Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2D9CE]/30">
                          {localPaginatedBookings.length > 0 ? (
                            localPaginatedBookings.map((bk) => (
                              <tr key={bk.id} className="hover:bg-stone-50/30 transition-all duration-150 text-[#1A1A1A]">
                                {w >= 8 && <td className={cn("font-mono font-bold", isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]")}>{bk.id}</td>}
                                <td className={cn("font-semibold", isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]")}>{bk.name}</td>
                                <td className={cn("text-[#6E6960]", isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]")}>{bk.service}</td>
                                {w >= 6 && <td className={cn("font-semibold text-[#3D5A3A]", isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]")}>{bk.stylist}</td>}
                                {w >= 7 && (
                                  <td className={isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]"}>
                                    <span className="font-mono font-semibold">{bk.date}</span>
                                    <span className="text-[8px] text-stone-400 ml-1 font-bold font-mono">{bk.time}</span>
                                  </td>
                                )}
                                <td className={cn("text-right font-mono font-bold", isCompactTable ? "px-1.5 py-1 text-[9px]" : "px-3 py-2.5 text-[11px]")}>₹{bk.amount}</td>
                                <td className={isCompactTable ? "px-1.5 py-1 text-center" : "px-3 py-2.5 text-center"}>{getStatusBadge(bk.status)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-3 py-8 text-center text-[#6E6960] font-medium">
                                No transaction entries matched search criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {localTotalPages > 1 && (
                      <div className="flex items-center justify-between mt-2 border-t border-[#E2D9CE]/25 pt-2 text-[10px] font-sans text-[#6E6960] select-none font-semibold shrink-0">
                        <span>
                          Page <span className="font-mono text-[#3D5A3A] font-bold">{currentPage}</span> of{" "}
                          <span className="font-mono text-[#3D5A3A] font-bold">{localTotalPages}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="h-7 px-2 border-[#E2D9CE]/45 text-[#3D5A3A] hover:bg-[#E8E0D6]/10 text-[9px]"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(localTotalPages, prev + 1))}
                            disabled={currentPage === localTotalPages}
                            className="h-7 px-2 border-[#E2D9CE]/45 text-[#3D5A3A] hover:bg-[#E8E0D6]/10 text-[9px]"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </ChartCard>
              )
            }

            default:
              return null
          }
        })}
      </div>

    </div>
  )
}
