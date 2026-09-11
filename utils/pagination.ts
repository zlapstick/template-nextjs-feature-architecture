import { PaginationMeta } from "@/types/api"

export function normalizeMeta(meta: unknown): PaginationMeta {
    const raw = (meta ?? {}) as Record<string, unknown>

    const page = Number(raw.page ?? raw.current_page ?? 1) || 1
    const perPage = Number(raw.perPage ?? raw.per_page ?? 10) || 10
    const total = Number(raw.total ?? 0) || 0
    const totalPages = Number(raw.totalPages ?? raw.total_pages ?? raw.last_page ?? Math.ceil(total / perPage)) || 1

    return { page, perPage, total, totalPages }
}
