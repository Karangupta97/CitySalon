"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  UserCircle,
  BarChart3,
  Store,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react"

const navItems = [
  { label: "Overview", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/owner/dashboard/appointments", icon: Calendar },
  { label: "Services", href: "/owner/dashboard/services", icon: Scissors },
  { label: "Staff", href: "/owner/dashboard/staff", icon: Users },
  { label: "Customers", href: "/owner/dashboard/customers", icon: UserCircle },
  { label: "Analytics", href: "/owner/dashboard/analytics", icon: BarChart3 },
  { label: "Salon Profile", href: "/owner/dashboard/profile", icon: Store },
]

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {/* ─── Mobile Overlay ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "lg:w-[72px]" : "lg:w-[240px]"}
          w-[240px]
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Store className="w-4.5 h-4.5 text-white" />
            </div>
            {!collapsed && (
              <div className="whitespace-nowrap">
                <p className="text-sm font-bold text-gray-900 leading-tight">CitySalon</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Owner Portal</p>
              </div>
            )}
          </Link>
          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto" aria-label="Dashboard navigation">
          {!collapsed && (
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold px-3 mb-2">
              Menu
            </p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/owner/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`
                      flex items-center gap-3 rounded-xl transition-all duration-200
                      ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        isActive ? "text-indigo-600" : ""
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-[13px]">{item.label}</span>
                    )}
                    {!collapsed && isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <div className="hidden lg:flex p-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors text-xs"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Search input */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F4F0] border border-gray-200/60 w-[260px] focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none flex-1"
              />
              <span className="text-[9px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              type="button"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
              RS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
