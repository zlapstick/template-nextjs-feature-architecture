import DashboardHeader from "@/components/common/dashboard-header"
import UsersCreate from "@/features/dashboard/users/components/users-create"
import { requireRole } from "@/utils/sessions"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tambah User",
}

export default async function Page() {
    await requireRole("superadmin")

    return (
        <>
            <DashboardHeader
                breadcrumbItems={[
                    { label: "Dashboard", href: `/dashboard` },
                    { label: "Manajemen User", href: `/dashboard/users` },
                    { label: "Tambah", href: `/dashboard/users/create` },
                ]}
            />
            <main className="bg-muted/40 flex h-full flex-1 flex-col gap-5 p-6">
                <h1 className="text-2xl font-bold">Tambah User</h1>
                <UsersCreate />
            </main>
        </>
    )
}
