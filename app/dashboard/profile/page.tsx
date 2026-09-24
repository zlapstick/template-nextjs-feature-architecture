import { requireSession } from "@/utils/sessions"

const roleLabels: Record<string, string> = {
    superadmin: "Superadmin",
    user: "User",
}

export default async function Page() {
    const session = await requireSession()

    const rows: { label: string; value: string }[] = [
        { label: "Nama", value: session.name },
        { label: "Email", value: session.email },
        { label: "Role", value: roleLabels[session.role] ?? session.role },
        { label: "ID", value: session.id },
    ]

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">Profil Saya</h1>
            <p className="mb-4 text-sm text-neutral-500">
                Nama dan email berasal dari akun SSO Anda. Hubungi superadmin bila ada yang perlu
                diubah.
            </p>

            <dl className="flex max-w-md flex-col gap-3 text-sm">
                {rows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-1">
                        <dt className="font-medium">{row.label}</dt>
                        <dd className="text-neutral-600">{row.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
