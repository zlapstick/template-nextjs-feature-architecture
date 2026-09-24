import { PaginationMeta } from "@/types/api"

export function normalizeMeta(meta: unknown): PaginationMeta {
    const raw = (meta ?? {}) as Record<string, unknown>

    const page = Number(raw.page ?? raw.current_page ?? 1) || 1
    const perPage = Number(raw.perPage ?? raw.per_page ?? 10) || 10
    const total = Number(raw.total ?? 0) || 0
    const totalPages =
        Number(raw.totalPages ?? raw.total_pages ?? raw.last_page ?? Math.ceil(total / perPage)) ||
        1

    return { page, perPage, total, totalPages }
}

export function generatePagination(currentPage: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages]
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}
