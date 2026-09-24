import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Result } from "@/types/api"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8085/api"

export const ACCESS_TOKEN_COOKIE = "access_token"
export const REFRESH_TOKEN_COOKIE = "refresh_token"

function isControlFlowError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        ((error as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
            (error as { digest: string }).digest === "NEXT_NOT_FOUND")
    )
}

export function rethrowControlFlow(error: unknown): void {
    if (isControlFlowError(error)) {
        throw error
    }
}

export type ApiFetchOptions = {
    redirectOnUnauthorized?: boolean
}

export async function apiFetch(
    path: string,
    init: RequestInit = {},
    options: ApiFetchOptions = {},
): Promise<Response> {
    const { redirectOnUnauthorized = true } = options

    const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...init.headers,
        },
        cache: "no-store",
    })

    if (res.status === 401 && redirectOnUnauthorized) {
        redirect("/login")
    }

    return res
}

export async function apiRequest<T>(
    path: string,
    init?: RequestInit,
    options?: ApiFetchOptions,
): Promise<Result<T>> {
    try {
        const res = await apiFetch(path, init, options)
        const json = await res.json().catch(() => null)

        if (!res.ok) {
            return {
                success: false,
                message: json?.message || "Terjadi kesalahan pada server",
                errors: json?.errors,
            }
        }

        return {
            success: true,
            message: json?.message,
            data: (json?.data ?? json) as T,
            meta: json?.meta,
        }
    } catch (error) {
        rethrowControlFlow(error)
        return { success: false, message: "Tidak dapat terhubung ke server" }
    }
}
