"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent className="flex flex-col gap-3">
        {/* Quick Action Button */}
        <SidebarMenu className={isCollapsed ? "px-1" : "px-2"}>
          <SidebarMenuItem className="flex items-center">
            <SidebarMenuButton
              tooltip="Quick Create"
              className={`w-full bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-xl font-sans font-semibold text-xs tracking-wider cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-300 border border-[#3D5A3A]/20 shadow-sm hover:shadow-md ${
                isCollapsed ? "h-9 p-0" : "h-10 px-3"
              }`}
            >
              <IconCirclePlusFilled className={`text-[#C4A76C] shrink-0 transition-all duration-300 ${isCollapsed ? "size-5" : "size-4"}`} />
              <span className="group-data-[collapsible=icon]:hidden">Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main Navigation Links */}
        <SidebarMenu className={`gap-0.5 ${isCollapsed ? "px-1" : "px-2"}`}>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/owner/dashboard" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  asChild
                  className={`transition-all duration-200 rounded-xl group/btn ${
                    isCollapsed
                      ? `h-9 w-9 mx-auto flex items-center justify-center p-0 ${
                          isActive
                            ? "bg-[#3D5A3A] text-white shadow-sm"
                            : "text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/50"
                        }`
                      : `py-2.5 px-3 ${
                          isActive
                            ? "bg-[#3D5A3A] text-white font-bold shadow-sm"
                            : "text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/40"
                        }`
                  }`}
                >
                  <Link href={item.url} className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                    {item.icon && (
                      <item.icon
                        className={`transition-all duration-200 shrink-0 ${
                          isCollapsed ? "size-[18px]" : "size-4"
                        } ${
                          isActive
                            ? "text-[#C4A76C]"
                            : "text-[#6E6960] group-hover/btn:text-[#3D5A3A]"
                        }`}
                      />
                    )}
                    <span className="font-sans text-[13px] font-medium tracking-wide group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
