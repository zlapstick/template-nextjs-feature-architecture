import DashboardHeader from "@/components/common/dashboard-header"
import { notFound } from "next/navigation"
import UsersEdit from "@/features/dashboard/users/components/users-edit"
import { getUser } from "@/features/dashboard/users/server/get-user"
import { requireRole } from "@/utils/sessions"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ubah User",
}

export default async function Page({ params }: PageProps<"/dashboard/users/[id]/edit">) {
    await requireRole("superadmin")

    const { id } = await params
    const result = await getUser(id)

    if (!result.success) {
        notFound()
    }

    return (
        <>
            <DashboardHeader
                breadcrumbItems={[
                    { label: "Dashboard", href: `/dashboard` },
                    { label: "Manajemen User", href: `/dashboard/users` },
                    { label: "Ubah", href: `/dashboard/users/${id}/edit` },
                ]}
            />
            <main className="bg-muted/40 flex h-full flex-1 flex-col gap-5 p-6">
                <h1 className="text-2xl font-bold">Ubah User</h1>
                <UsersEdit id={id} user={result.data} />
            </main>
        </>
    )
}
