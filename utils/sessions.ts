import { cache } from "react"
import { redirect } from "next/navigation"
import { apiRequest } from "@/utils/api-fetch"

export type Role = "superadmin" | "user"

export type SessionUser = {
    id: string
    name: string
    email: string
    role: Role
}

export const getSession = cache(async (): Promise<SessionUser | null> => {
    const result = await apiRequest<SessionUser>("/auth/me")
    return result.success ? result.data : null
})

export const getSessionForGuestCheck = cache(async (): Promise<SessionUser | null> => {
    const result = await apiRequest<SessionUser>("/auth/me", undefined, {
        redirectOnUnauthorized: false,
    })
    return result.success ? result.data : null
})

export async function requireSession(): Promise<SessionUser> {
    const session = await getSession()
    if (!session) redirect("/login")
    return session
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
    const session = await requireSession()
    if (!roles.includes(session.role)) redirect("/dashboard")
    return session
}
