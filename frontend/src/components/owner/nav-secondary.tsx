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
    return (
        <SidebarGroup {...props} className="p-0">
            <SidebarGroupContent>
                <SidebarMenu className="gap-1 px-2">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className="text-[#6E6960] hover:text-[#3D5A3A] hover:bg-[#E8E0D6]/40 rounded-lg transition-all duration-200 py-2 px-3 group/sec"
                            >
                                <Link href={item.url} className="flex items-center gap-3">
                                    <item.icon className="size-4 text-[#6E6960] group-hover/sec:text-[#3D5A3A] transition-transform duration-200 shrink-0" />
                                    <span className="font-sans text-xs font-semibold tracking-wide group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

