"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { apiRequest } from "@/utils/api-fetch"
import { SSO_STATE_COOKIE, stateCookieOptions } from "@/utils/cookies"

type LoginUrlData = { authorize_url: string }

export async function loginWithSso() {
    const state = crypto.randomUUID()

    const result = await apiRequest<LoginUrlData>(
        `/sso/login-url?state=${encodeURIComponent(state)}`,
    )
    if (!result.success) {
        redirect("/login?error=unavailable")
    }

    const c = await cookies()
    c.set(SSO_STATE_COOKIE, state, stateCookieOptions())

    redirect(result.data.authorize_url)
}
