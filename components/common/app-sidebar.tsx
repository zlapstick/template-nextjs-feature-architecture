"use client"

import { NavMain } from "@/components/common/nav-main"
import { NavUser } from "@/components/common/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import type { SessionUser } from "@/utils/sessions"
import Link from "next/link"
import * as React from "react"
import { LayoutDashboard, UserCircle, Users } from "lucide-react"

export function AppSidebar({
    currentUser,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    currentUser?: SessionUser | null
}) {
    const navMain = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Profil Saya", url: "/dashboard/profile", icon: UserCircle },
        ...(currentUser?.role === "superadmin"
            ? [{ title: "Manajemen User", url: "/dashboard/users", icon: Users }]
            : []),
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <LayoutDashboard className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="font-bold">Manajemen KPI</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={currentUser ?? null} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
