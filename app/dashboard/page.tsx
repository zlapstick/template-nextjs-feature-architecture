import Link from "next/link"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/common/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { requireSession } from "@/utils/sessions"

export default async function Page() {
    const session = await requireSession()

    if (session.role !== "superadmin") {
        redirect("/dashboard/profile")
    }

    return (
        <>
            <DashboardHeader breadcrumbItems={[{ label: "Dashboard", href: `/dashboard` }]} />
            <main className="bg-muted/40 flex h-full flex-1 flex-col gap-5 p-6">
                <Card className="flex w-full flex-col gap-3 p-6">
                    <h1 className="text-2xl font-bold">Beranda</h1>
                    <p className="text-sm text-muted-foreground">
                        Selamat datang, {session.name}. Tahap ini baru mencakup manajemen user.
                    </p>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/dashboard/users">Manajemen User</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/profile">Profil Saya</Link>
                        </Button>
                    </div>
                </Card>
            </main>
        </>
    )
}
