import DashboardHeader from "@/components/common/dashboard-header"
import PaginationTable from "@/components/shared/zecode/table/pagination/pagination-table"
import PerPage from "@/components/shared/zecode/table/pagination/perpage-table"
import SearchBar from "@/components/shared/zecode/table/search-bar/search-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import UsersTable from "@/features/dashboard/users/components/users-table"
import { getUsers } from "@/features/dashboard/users/server/get-users"
import { requireRole } from "@/utils/sessions"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Manajemen User",
}

export default async function Page({ searchParams }: PageProps<"/dashboard/users">) {
    const session = await requireRole("superadmin")

    const params = await searchParams
    const page = Number(params.page) || 1
    const perPage = Number(params.perPage) || undefined
    const search_global =
        typeof params.search_global === "string" ? params.search_global : undefined

    const result = await getUsers({ page, perPage, search_global })

    if (!result.success) {
        return (
            <>
                <DashboardHeader
                    breadcrumbItems={[
                        { label: "Dashboard", href: `/dashboard` },
                        { label: "Manajemen User", href: `/dashboard/users` },
                    ]}
                />
                <main className="bg-muted/40 flex h-full flex-1 flex-col gap-5 p-6">
                    <p className="text-destructive">{result.message}</p>
                </main>
            </>
        )
    }

    const { meta, items } = result.data
    const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.perPage + 1
    const to = Math.min(meta.page * meta.perPage, meta.total)

    return (
        <>
            <DashboardHeader
                breadcrumbItems={[
                    { label: "Dashboard", href: `/dashboard` },
                    { label: "Manajemen User", href: `/dashboard/users` },
                ]}
            />
            <main className="bg-muted/40 flex h-full flex-1 flex-col gap-5 p-6">
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl font-bold">Manajemen User</h1>
                    <Link className="flex" href="/dashboard/users/create">
                        <Button>Tambah User</Button>
                    </Link>
                </div>
                <Card className="flex w-full flex-col gap-0 p-0">
                    <div className="flex w-full justify-end p-5">
                        <div className="flex w-full gap-2 md:max-w-86">
                            <SearchBar
                                placeholder="Cari berdasarkan SSO User ID..."
                                paramKey="search_global"
                                perPageParamKey="perPage"
                                paginationParamKey="page"
                            />
                        </div>
                    </div>
                    <hr />
                    <UsersTable items={items} currentUserId={session.id} />
                    {items.length > 0 && (
                        <>
                            <hr />
                            <div className="grid w-full grid-cols-1 items-center gap-3 p-5 lg:grid-cols-3">
                                <div className="text-center text-sm text-muted-foreground lg:text-left">
                                    Menampilkan <span className="font-medium">{from}</span> -{" "}
                                    <span className="font-medium">{to}</span> dari{" "}
                                    <span className="font-medium">{meta.total}</span> data
                                </div>
                                <div className="flex justify-center">
                                    <PaginationTable totalPages={meta.totalPages} />
                                </div>
                                <div className="flex h-10 justify-center lg:justify-end">
                                    <PerPage options={[10, 25, 50, 100]} />
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </main>
        </>
    )
}
