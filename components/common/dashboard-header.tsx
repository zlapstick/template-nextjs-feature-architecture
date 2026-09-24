import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/common/theme-toggle"
import React from "react"

export default function DashboardHeader({
    breadcrumbItems,
}: {
    breadcrumbItems: {
        label: string
        href?: string
    }[]
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-primary text-white">
            <div className="flex items-center gap-2 px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
                />
                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap items-center text-white">
                        {breadcrumbItems.map((item, index) => {
                            const isLast = index === breadcrumbItems.length - 1

                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast || !item.href ? (
                                            <BreadcrumbPage className="text-white">
                                                {item.label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                href={item.href}
                                                className="text-white/80 hover:text-white"
                                            >
                                                {item.label}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>

                                    {!isLast && <BreadcrumbSeparator className="text-white/80" />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="ml-auto px-6">
                <ThemeToggle />
            </div>
        </header>
    )
}
