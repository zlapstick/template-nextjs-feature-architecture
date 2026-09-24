import { Button } from "@/components/ui/button"
import { loginWithSso } from "@/features/auth/login/server/login"

export function SsoLoginForm() {
    return (
        <form action={loginWithSso}>
            <Button type="submit" className="w-full">
                Masuk dengan SSO
            </Button>
        </form>
    )
}
