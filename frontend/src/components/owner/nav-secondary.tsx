"use client"

import * as React from "react"
import Link from "next/link"
import { type Icon } from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: Icon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <SidebarGroup {...props} className="p-0">
            <SidebarGroupContent>
                <SidebarMenu className={`gap-0.5 ${isCollapsed ? "px-1" : "px-2"}`}>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                className={`transition-all duration-200 rounded-xl group/sec ${
                                    isCollapsed
                                        ? "h-9 w-9 mx-auto flex items-center justify-center p-0 text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/50"
                                        : "text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/40 py-2.5 px-3"
                                }`}
                            >
                                <Link href={item.url} className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                                    <item.icon className={`transition-all duration-200 shrink-0 group-hover/sec:text-[#3D5A3A] ${
                                        isCollapsed ? "size-[18px]" : "size-4"
                                    } text-[#6E6960]`} />
                                    <span className="font-sans text-[13px] font-medium tracking-wide group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
