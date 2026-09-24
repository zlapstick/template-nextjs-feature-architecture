"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
    SSO_STATE_COOKIE,
    accessTokenCookieOptions,
    refreshTokenCookieOptions,
} from "@/utils/cookies"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/utils/api-fetch"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8085/api"

/**
 * Inilah redirect_uri yang terdaftar di SSO. Penukaran code dilakukan oleh
 * backend Go supaya client_secret tidak pernah ada di proses Next.js ini.
 *
 * Cookie hanya bisa diset lewat Server Function atau Route Handler, jadi
 * fungsi ini dipanggil sebagai server action dari SsoCallbackHandler
 * (bukan lewat app/api) begitu halaman /login/callback dirender.
 */
export async function handleSsoCallback(formData: FormData) {
    const code = formData.get("code")
    const state = formData.get("state")

    if (typeof code !== "string" || !code) {
        redirect("/login?error=missing_code")
    }

    const c = await cookies()
    const expectedState = c.get(SSO_STATE_COOKIE)?.value

    if (!expectedState || expectedState !== state) {
        redirect("/login?error=invalid_state")
    }

    let res: Response
    try {
        res = await fetch(`${API_BASE_URL}/sso/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ code }),
            cache: "no-store",
        })
    } catch {
        redirect("/login?error=unavailable")
    }

    if (res.status === 403) {
        redirect("/login?error=not_registered")
    }
    if (!res.ok) {
        redirect("/login?error=exchange_failed")
    }

    const body = await res.json().catch(() => null)
    const accessToken: string | undefined = body?.data?.access_token
    const refreshToken: string | undefined = body?.data?.refresh_token

    if (!accessToken || !refreshToken) {
        redirect("/login?error=exchange_failed")
    }

    c.set(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions())
    c.set(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions())
    c.delete(SSO_STATE_COOKIE)

    redirect("/dashboard")
}
