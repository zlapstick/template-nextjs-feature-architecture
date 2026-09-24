import { ZodError } from "zod"

export function zodFieldErrors<T extends Record<string, unknown>>(
    error: ZodError<T>,
): Record<string, string[]> {
    const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>
    const result: Record<string, string[]> = {}

    for (const [key, messages] of Object.entries(flat)) {
        if (messages?.length) result[key] = messages
    }

    return result
}

export function apiFieldErrors(errors: unknown): Record<string, string[]> {
    if (!errors || typeof errors !== "object") return {}

    const result: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
        result[key] = Array.isArray(value) ? value.map(String) : [String(value)]
    }

    return result
}
