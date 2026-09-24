import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/common/app-sidebar"
import { requireSession } from "@/utils/sessions"

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    const session = await requireSession()

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar currentUser={session} />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
