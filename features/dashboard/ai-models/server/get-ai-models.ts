"use server"

import { apiRequest } from "@/utils/api-fetch"
import { normalizeMeta } from "@/utils/pagination"
import { PaginationMeta, Result } from "@/types/api"

export type AiModelData = {
    id: string
    name: string
    provider: string
    model_name: string
    type: "chat" | "image"
}

export type AiModelResponse = {
    items: AiModelData[]
    meta: PaginationMeta
}

export async function getAiModels(options?: {
    page?: number
    perPage?: number
    search_global?: string
    type?: "chat" | "image"
}): Promise<Result<AiModelResponse>> {
    const params = new URLSearchParams()
    if (options?.page) params.set("page", String(options.page))
    if (options?.perPage) params.set("per_page", String(options.perPage))
    if (options?.search_global) params.set("search_global", options.search_global)
    if (options?.type) params.set("type", options.type)

    const result = await apiRequest<AiModelData[]>(`/ai-models?${params}`)
    if (!result.success) return result

    return {
        success: true,
        data: { items: result.data ?? [], meta: normalizeMeta(result.meta) },
    }
}
