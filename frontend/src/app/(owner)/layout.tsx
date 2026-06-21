"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconCalendar,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconScissors,
  IconSearch,
  IconSettings,
  IconBuildingStore,
  IconUserCircle,
  IconUsers,
  IconBell,
} from "@tabler/icons-react"

import { NavMain } from "@/components/owner/nav-main"
import { NavSecondary } from "@/components/owner/nav-secondary"
import { NavUser } from "@/components/owner/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Radiance Studio",
    email: "hello@radiancebeauty.in",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/owner/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Appointments",
      url: "/owner/dashboard/appointments",
      icon: IconCalendar,
    },
    {
      title: "Services",
      url: "/owner/dashboard/services",
      icon: IconScissors,
    },
    {
      title: "Staff",
      url: "/owner/dashboard/staff",
      icon: IconUsers,
    },
    {
      title: "Customers",
      url: "/owner/dashboard/customers",
      icon: IconUserCircle,
    },
    {
      title: "Analytics",
      url: "/owner/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Salon Profile",
      url: "/owner/dashboard/profile",
      icon: IconBuildingStore,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/owner/dashboard/profile",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-[#E2D9CE]/50">
      <SidebarHeader className="border-b border-[#E2D9CE]/50 bg-sidebar/50 px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-[#E8E0D6]/20 rounded-lg transition-all duration-200"
            >
              <a href="/owner/dashboard" className="flex items-center gap-2">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-[#3D5A3A] text-white shadow-xs">
                  <IconInnerShadowTop className="size-4 text-[#C4A76C]" />
                </div>
                <span className="font-serif text-base font-bold text-[#3D5A3A] tracking-wider leading-none">CitySalon</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar/20 px-2 py-3">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto border-t border-[#E2D9CE]/30 pt-2" />
      </SidebarContent>
      <SidebarFooter className="border-t border-[#E2D9CE]/50 bg-sidebar/50 px-2 py-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Resolve breadcrumbs dynamically based on path
  const pathParts = pathname.split("/").filter(Boolean)
  const isDashboard = pathParts.includes("dashboard") && pathParts.length === 2

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FAFAF7]">
        {/* Dynamic header control bar */}
        <header className="flex h-15 shrink-0 items-center justify-between border-b border-[#E2D9CE]/40 px-4 md:px-6 bg-[#FAFAF7]/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 hover:bg-[#E8E0D6]/40 text-[#3D5A3A] h-8 w-8 rounded-lg border border-[#E2D9CE]/50 transition-all duration-200" />
            <div className="h-4 w-px bg-[#E2D9CE]/60 hidden sm:block" />
            
            {/* Elegant Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#6E6960]/80 font-sans">
              <span>Owner</span>
              <span className="text-[#E2D9CE] text-xs">/</span>
              {isDashboard ? (
                <span className="text-[#3D5A3A]">Dashboard</span>
              ) : (
                <>
                  <span className="hover:text-[#3D5A3A] transition-colors cursor-pointer">Dashboard</span>
                  <span className="text-[#E2D9CE] text-xs">/</span>
                  <span className="text-[#3D5A3A]">
                    {pathParts[pathParts.length - 1].replace(/-/g, " ")}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {/* Quick date widget */}
            <div className="hidden md:flex flex-col text-right pr-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E6960]/60 font-sans">Current Day</span>
              <span className="text-xs font-semibold text-[#3D5A3A] font-sans">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            {/* Quick search input */}
            <div className="relative hidden md:block">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2D9CE]/60 bg-white hover:bg-[#E8E0D6]/20 text-[10px] font-sans text-[#6E6960] cursor-pointer transition-all duration-200 outline-none">
                <IconSearch className="w-3.5 h-3.5 text-[#3D5A3A]" />
                <span>Search...</span>
                <kbd className="px-1.5 py-0.5 text-[8px] font-bold bg-[#E8E0D6] rounded text-[#3D5A3A] leading-none ml-1.5">⌘K</kbd>
              </button>
            </div>

            {/* Notifications panel toggle */}
            <div className="relative">
              <button className="p-2 rounded-lg border border-[#E2D9CE]/50 bg-white hover:bg-[#E8E0D6]/20 text-[#3D5A3A] cursor-pointer transition-all duration-200 relative outline-none">
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C4A76C]" />
                <IconBell className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-[#E2D9CE]/60" />

            {/* Micro User widget */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#E2D9CE] flex items-center justify-center bg-[#3D5A3A] text-[#FAFAF7] text-xs font-bold font-serif select-none shadow-xs">
                RS
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#1A1A1A] leading-tight">Radiance Studio</span>
                <span className="text-[9px] font-semibold text-[#6E6960]/80 leading-none">Salon Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard inner content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#FAFAF7]/30 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
