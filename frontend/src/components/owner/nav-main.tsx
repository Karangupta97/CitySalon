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

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent className="flex flex-col gap-4">
        {/* Quick Action Button */}
        <SidebarMenu className="px-2">
          <SidebarMenuItem className="flex items-center">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="w-full h-9 bg-[#3D5A3A] hover:bg-[#2B3F29] text-white rounded-lg font-sans font-semibold text-xs tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 group-data-[collapsible=icon]:p-0 border border-transparent shadow-xs"
            >
              <IconCirclePlusFilled className="size-4 text-[#C4A76C] shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main Navigation Links */}
        <SidebarMenu className="gap-1 px-2">
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
                  className={`transition-all duration-200 rounded-lg py-2 px-3 group/btn ${
                    isActive
                      ? "bg-[#3D5A3A] text-white font-bold"
                      : "text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/40"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon
                        className={`size-4 transition-transform duration-200 shrink-0 ${
                          isActive
                            ? "text-[#C4A76C]"
                            : "text-[#6E6960] group-hover/btn:text-[#3D5A3A]"
                        }`}
                      />
                    )}
                    <span className="font-sans text-xs font-semibold tracking-wide group-data-[collapsible=icon]:hidden">{item.title}</span>
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

