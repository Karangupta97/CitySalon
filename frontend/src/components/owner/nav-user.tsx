"use client"

import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile, state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={`data-[state=open]:bg-[#E8E0D6]/30 data-[state=open]:text-[#3D5A3A] hover:bg-[#E8E0D6]/20 rounded-xl transition-all duration-200 group/user cursor-pointer ${
                                isCollapsed ? "h-9 w-9 mx-auto p-0 flex items-center justify-center" : "py-2.5 px-3"
                            }`}
                        >
                            <Avatar className={`rounded-xl border border-[#E2D9CE] flex items-center justify-center bg-[#3D5A3A] text-[#FAFAF7] font-sans font-bold shadow-sm transition-all duration-300 ${
                                isCollapsed ? "h-8 w-8 text-[10px]" : "h-9 w-9 text-[11px]"
                            }`}>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-xl bg-transparent text-[#FAFAF7]">RS</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-xs leading-tight ml-2.5 group-data-[collapsible=icon]:hidden font-sans">
                                <span className="truncate font-semibold text-[#1A1A1A] text-[13px]">{user.name}</span>
                                <span className="truncate text-[10px] text-[#6E6960]/80 mt-0.5">
                                    {user.email}
                                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-3.5 text-[#6E6960]/60 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border border-[#E2D9CE]/60 shadow-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                                <Avatar className="h-9 w-9 rounded-xl border border-[#E2D9CE] bg-[#3D5A3A]">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-xl bg-transparent text-[#FAFAF7] text-xs font-bold">RS</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-[#1A1A1A]">{user.name}</span>
                                    <span className="truncate text-xs text-[#6E6960]">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <IconUserCircle />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconCreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconNotification />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <IconLogout />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
