import { BarChart3, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SsoLoginForm } from "../../features/auth/login/components/sso-login-form"
import { SsoAutoRedirect } from "../../features/auth/login/components/sso-auto-redirect"
import { logout } from "@/features/auth/login/server/logout"

const errorMessages: Record<string, string> = {
    not_registered: "Akun Anda belum terdaftar di aplikasi ini. Hubungi superadmin.",
    invalid_state: "Sesi login tidak valid atau sudah kadaluarsa. Silakan coba lagi.",
    missing_code: "Login dibatalkan atau tidak menghasilkan kode otorisasi.",
    exchange_failed: "Kode otorisasi tidak valid atau sudah kadaluarsa. Silakan coba lagi.",
    unavailable: "Tidak dapat terhubung ke server. Coba beberapa saat lagi.",
}

const highlights = [
    "Pantau capaian KPI tim secara real-time",
    "Kelola user & role lewat satu akun SSO",
    "Laporan performa yang selalu up to date",
]

export default async function Page({ searchParams }: PageProps<"/login">) {
    const params = await searchParams
    const error = typeof params.error === "string" ? params.error : undefined
    const message = error ? (errorMessages[error] ?? "Login gagal. Silakan coba lagi.") : undefined

    if (!message) {
        return <SsoAutoRedirect />
    }

    return (
        <div className="grid grid-cols-1 bg-background lg:h-screen lg:grid-cols-2">
            <div className="bg-primary text-primary-foreground flex flex-col justify-center gap-6 p-10 lg:h-screen">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/15 flex size-12 items-center justify-center rounded-lg">
                        <BarChart3 className="size-6" />
                    </div>
                    <span className="text-2xl font-bold">Manajemen KPI</span>
                </div>
                <p className="text-primary-foreground/80 max-w-sm text-sm">
                    Satu tempat untuk memantau, mengelola, dan melaporkan capaian KPI tim Anda.
                </p>
                <ul className="flex flex-col gap-3">
                    {highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                            <span>{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-muted/40 flex flex-1 items-center justify-center p-6">
                <Card className="flex w-full max-w-sm flex-col gap-5 p-6">
                    <div>
                        <h1 className="text-xl font-semibold">Masuk</h1>
                        <p className="text-sm text-muted-foreground">
                            Masuk menggunakan akun SSO Anda.
                        </p>
                    </div>

                    {message && <p className="text-sm text-destructive">{message}</p>}

                    {error === "not_registered" ? (
                        // Sesi SSO-nya masih aktif dengan akun yang sama, jadi tombol "Masuk
                        // dengan SSO" biasa cuma akan mental ke error ini lagi. Harus logout
                        // dulu dari SSO supaya lain kali browser diarahkan ke form login SSO,
                        // bukan langsung ditukar sebagai akun yang sama.
                        <form action={logout}>
                            <Button type="submit" variant="outline" className="w-full">
                                Gunakan akun lain
                            </Button>
                        </form>
                    ) : (
                        <SsoLoginForm />
                    )}
                </Card>
            </div>
        </div>
    )
}
