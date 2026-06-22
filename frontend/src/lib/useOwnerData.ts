/**
 * useOwnerData — Central hook for owner dashboard data.
 *
 * Returns:
 *  - Demo/judge/dev-team accounts → rich static mock data
 *  - Real owners → live data fetched from the backend API
 *  - Real owners with no salon yet → empty/onboarding state
 */

import { useState, useEffect } from "react"
import { useAuth } from "@/components/boty/auth-context"
import { apiFetch } from "@/lib/api"
import mockDashboardData from "@/data/mock-owner-dashboard.json"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OwnerKPI {
  label: string
  value: string
  change: string
  trend: "up" | "down"
}

export interface OwnerAppointment {
  time: string
  name: string
  service: string
  stylist: string
  amount: number
  status: "confirmed" | "in-progress" | "completed" | "pending" | "cancelled"
}

export interface OwnerService {
  name: string
  value: number
  fill: string
}

export interface OwnerStaff {
  name: string
  bookings: number
  revenue: number
  color: string
  initial: string
  rank: number
}

export interface OwnerDashboardData {
  salonName: string
  isDemo: boolean
  hasSalon: boolean
  salonId: string | null
  kpis: {
    totalBookings: string
    bookingsChange: string
    bookingsTrend: "up" | "down"
    revenue: string
    revenueChange: string
    revenueTrend: "up" | "down"
    avgBookingValue: string
    avgChange: string
    avgTrend: "up" | "down"
    newCustomers: string
    customersChange: string
    customersTrend: "up" | "down"
  }
  weeklyRevenue: { day: string; current: number; previous: number }[]
  todaySchedule: OwnerAppointment[]
  topServices: OwnerService[]
  stylistLeaderboard: OwnerStaff[]
  isLoading: boolean
  error: string | null
}

// ─── Mock Data (Demo / Judge / Dev Team) ─────────────────────────────────────

const MOCK_WEEKLY = mockDashboardData.weeklyRevenue
const MOCK_SCHEDULE: OwnerAppointment[] = mockDashboardData.todaySchedule as OwnerAppointment[]
const MOCK_SERVICES: OwnerService[] = mockDashboardData.topServices as OwnerService[]
const MOCK_STAFF: OwnerStaff[] = mockDashboardData.stylistLeaderboard as OwnerStaff[]
const MOCK_KPIS = mockDashboardData.kpis as OwnerDashboardData["kpis"]

// ─── Empty State (Real owner with no salon yet) ───────────────────────────────

const EMPTY_DATA: Omit<OwnerDashboardData, "isDemo" | "hasSalon" | "salonId" | "salonName" | "isLoading" | "error"> = {
  kpis: {
    totalBookings: "0",
    bookingsChange: "—",
    bookingsTrend: "up",
    revenue: "₹0",
    revenueChange: "—",
    revenueTrend: "up",
    avgBookingValue: "₹0",
    avgChange: "—",
    avgTrend: "up",
    newCustomers: "0",
    customersChange: "—",
    customersTrend: "up",
  },
  weeklyRevenue: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    current: 0,
    previous: 0,
  })),
  todaySchedule: [],
  topServices: [],
  stylistLeaderboard: [],
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOwnerData(): OwnerDashboardData {
  const { user } = useAuth()
  const [data, setData] = useState<OwnerDashboardData>({
    salonName: "Your Salon",
    isDemo: false,
    hasSalon: false,
    salonId: null,
    ...EMPTY_DATA,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!user) {
      setData((prev) => ({ ...prev, isLoading: false }))
      return
    }

    // ── Demo / Judge / Dev Team: return mock data instantly ──────────────────
    if (user.isDemo) {
      setData({
        salonName: user.businessName || user.full_name || "Demo Salon",
        isDemo: true,
        hasSalon: true,
        salonId: user.salonId ?? null,
        kpis: MOCK_KPIS,
        weeklyRevenue: MOCK_WEEKLY,
        todaySchedule: MOCK_SCHEDULE,
        topServices: MOCK_SERVICES,
        stylistLeaderboard: MOCK_STAFF,
        isLoading: false,
        error: null,
      })
      return
    }

    // ── Real Owner: fetch live data ──────────────────────────────────────────
    async function fetchRealData() {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setData((prev) => ({ ...prev, isLoading: false }))
          return
        }

        // 1. Resolve salon — use stored salonId or fetch from /owner/salons
        let salonId = user!.salonId
        let salonName = user!.businessName || user!.full_name || "Your Salon"

        if (!salonId) {
          try {
            const salonsRes: any = await apiFetch("/owner/salons", {
              headers: { Authorization: `Bearer ${token}` },
            })
            const salons = salonsRes?.data || []
            if (salons.length > 0) {
              salonId = salons[0].id
              salonName = salons[0].name || salonName
            }
          } catch {
            // No salon yet — show empty state
            setData({
              salonName,
              isDemo: false,
              hasSalon: false,
              salonId: null,
              ...EMPTY_DATA,
              isLoading: false,
              error: null,
            })
            return
          }
        }

        if (!salonId) {
          setData({
            salonName,
            isDemo: false,
            hasSalon: false,
            salonId: null,
            ...EMPTY_DATA,
            isLoading: false,
            error: null,
          })
          return
        }

        // 2. Fetch analytics for current month
        const now = new Date()
        const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
        const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
          new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        ).padStart(2, "0")}`

        const [analyticsRes, appointmentsRes]: [any, any] = await Promise.all([
          apiFetch(`/owner/${salonId}/analytics?startDate=${startDate}&endDate=${endDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiFetch(`/owner/${salonId}/appointments?date=${now.toISOString().split("T")[0]}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const analytics = analyticsRes?.data || {}
        const appointments: any[] = appointmentsRes?.data || []

        // 3. Map real API data to dashboard shape
        const kpis = {
          totalBookings: String(analytics.totalBookings ?? 0),
          bookingsChange: analytics.weeklyTrend?.length > 1 ? "+0%" : "—",
          bookingsTrend: "up" as const,
          revenue: `₹${(analytics.revenue ?? 0).toLocaleString("en-IN")}`,
          revenueChange: "—",
          revenueTrend: "up" as const,
          avgBookingValue: `₹${(analytics.avgBookingValue ?? 0).toLocaleString("en-IN")}`,
          avgChange: "—",
          avgTrend: "up" as const,
          newCustomers: String(analytics.totalCustomers ?? 0),
          customersChange: "—",
          customersTrend: "up" as const,
        }

        // Map weekly trend to chart data
        const weeklyRevenue = (analytics.weeklyTrend ?? []).slice(-7).map((d: any, i: number) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] ?? d.date,
          current: d.revenue ?? 0,
          previous: Math.round((d.revenue ?? 0) * 0.85), // no previous period data available
        }))

        // Pad to 7 days if fewer
        while (weeklyRevenue.length < 7) {
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          weeklyRevenue.unshift({ day: days[weeklyRevenue.length], current: 0, previous: 0 })
        }

        // Map today's appointments
        const todaySchedule: OwnerAppointment[] = appointments.map((a: any) => ({
          time: a.start_time
            ? new Date(`1970-01-01T${a.start_time}`).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—",
          name: a.customer_name ?? "Guest",
          service: (a.service_names ?? []).join(", ") || "—",
          stylist: a.staff_name ?? "—",
          amount: a.total_price ?? 0,
          status: a.status ?? "pending",
        }))

        setData({
          salonName,
          isDemo: false,
          hasSalon: true,
          salonId,
          kpis,
          weeklyRevenue,
          todaySchedule,
          topServices: [], // populated from analytics.topService if needed
          stylistLeaderboard: [],
          isLoading: false,
          error: null,
        })
      } catch (err: any) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load dashboard data.",
        }))
      }
    }

    fetchRealData()
  }, [user])

  return data
}
