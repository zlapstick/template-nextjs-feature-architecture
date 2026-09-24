"use server"

import { apiRequest } from "@/utils/api-fetch"
import { normalizeMeta } from "@/utils/pagination"
import { PaginationMeta, Result } from "@/types/api"
import { userRoles } from "../schemas/user"

export type UserData = {
    id: string
    name: string
    email: string
    role: (typeof userRoles)[number]
}

export type UsersResponse = {
    items: UserData[]
    meta: PaginationMeta
}

export async function getUsers(options?: {
    page?: number
    perPage?: number
    search_global?: string
}): Promise<Result<UsersResponse>> {
    const params = new URLSearchParams()
    if (options?.page) params.set("page", String(options.page))
    if (options?.perPage) params.set("per_page", String(options.perPage))
    if (options?.search_global) params.set("search_global", options.search_global)

    const result = await apiRequest<UserData[]>(`/users?${params}`)
    if (!result.success) return result

    return {
        success: true,
        data: { items: result.data ?? [], meta: normalizeMeta(result.meta) },
    }
}
