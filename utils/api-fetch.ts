import { redirect } from "next/navigation"
import { Result } from "@/types/api"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000/api"

/**
 * Next.js control-flow errors (redirect/notFound) are thrown as special
 * errors caught by the framework's error boundary. Any try/catch around
 * a fetch that can trigger one of these must rethrow, or the navigation
 * silently turns into a normal error.
 */
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

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            ...init.headers,
        },
        cache: "no-store",
    })

    if (res.status === 401) {
        redirect("/login")
    }

    return res
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<Result<T>> {
    try {
        const res = await apiFetch(path, init)
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
            data: (json?.data ?? json) as T,
            meta: json?.meta,
        }
    } catch (error) {
        rethrowControlFlow(error)
        return { success: false, message: "Tidak dapat terhubung ke server" }
    }
}
