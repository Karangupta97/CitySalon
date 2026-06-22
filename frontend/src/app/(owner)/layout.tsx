"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  IconCalendar,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconScissors,
  IconSearch,
  IconSettings,
  IconBuildingStore,
  IconUserCircle,
  IconUsers,
  IconBell,
} from "@tabler/icons-react"

import { useAuth } from "@/components/boty/auth-context"
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
  useSidebar,
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
  ],
}

function SidebarLogo() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <a href="/owner/dashboard" className="flex items-center justify-center">
          {isCollapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-all duration-300">
              <Image
                src="/icon-light-32x32.svg"
                alt="CitySalon"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-1 transition-all duration-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0">
                <Image
                  src="/icon-light-32x32.svg"
                  alt="CitySalon"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[15px] font-bold text-[#3D5A3A] tracking-wide leading-none">
                  CitySalon
                </span>
                <span className="text-[9px] font-medium text-[#6E6960]/70 tracking-wider uppercase mt-0.5">
                  Owner Portal
                </span>
              </div>
            </div>
          )}
        </a>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function getInitials(name: string) {
  if (!name) return "RS"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function AppSidebar({ user, logout, ...props }: React.ComponentProps<typeof Sidebar> & { user: any; logout?: () => void }) {
  const sidebarUser = {
    name: user?.businessName || user?.full_name || "Radiance Studio",
    email: user?.email || "hello@radiancebeauty.in",
    avatar: "",
  }
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-[#E2D9CE]/40">
      <SidebarHeader className="border-b border-[#E2D9CE]/40 bg-sidebar/50 px-3 py-4">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar/20 px-2 py-4">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto border-t border-[#E2D9CE]/30 pt-3" />
      </SidebarContent>
      <SidebarFooter className="border-t border-[#E2D9CE]/40 bg-sidebar/50 px-2 py-3">
        <NavUser user={sidebarUser} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  
  // Resolve breadcrumbs dynamically based on path
  const pathParts = pathname.split("/").filter(Boolean)
  const isDashboard = pathParts.includes("dashboard") && pathParts.length === 2

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/salon/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D5A3A]"></div>
      </div>
    )
  }

  const initials = getInitials(user.businessName || user.full_name || "Radiance Studio")

  return (
    <SidebarProvider>
      <AppSidebar user={user} logout={logout} />
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
                {initials}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#1A1A1A] leading-tight text-ellipsis overflow-hidden whitespace-nowrap max-w-[120px]">
                  {user.businessName || user.full_name || "Radiance Studio"}
                </span>
                <span className="text-[9px] font-semibold text-[#6E6960]/80 leading-none">
                  {user.role === "owner" ? "Salon Owner" : user.role || "Salon Owner"}
                </span>
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
