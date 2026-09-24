"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { apiRequest, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/utils/api-fetch"

type LogoutUrlData = { logout_url: string }

export async function logout() {
    const c = await cookies()
    const refreshToken = c.get(REFRESH_TOKEN_COOKIE)?.value

    if (refreshToken) {
        await apiRequest(
            "/auth/logout",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            },
            { redirectOnUnauthorized: false },
        )
    }

    const result = await apiRequest<LogoutUrlData>("/sso/logout-url", undefined, {
        redirectOnUnauthorized: false,
    })

    c.delete(ACCESS_TOKEN_COOKIE)
    c.delete(REFRESH_TOKEN_COOKIE)

    redirect(result.success ? result.data.logout_url : "/login")
}
