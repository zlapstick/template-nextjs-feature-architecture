import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SsoCallbackHandler } from "@/features/auth/login/components/sso-callback-handler"

export default async function Page({ searchParams }: PageProps<"/login/callback">) {
    const params = await searchParams
    const code = typeof params.code === "string" ? params.code : undefined
    const state = typeof params.state === "string" ? params.state : undefined

    if (!code) {
        redirect("/login?error=missing_code")
    }

    return (
        <div className="bg-muted/40 flex min-h-screen items-center justify-center p-6">
            <Card className="flex w-full max-w-sm flex-col items-center gap-3 p-6 text-center">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Menghubungkan ke SSO...</p>
                <SsoCallbackHandler code={code} state={state ?? ""} />
            </Card>
        </div>
    )
}
