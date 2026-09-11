"use server"

import { apiRequest } from "@/utils/api-fetch"
import { AiModelData } from "./get-ai-models"

export async function getAiModel(id: string) {
    if (!id?.trim()) {
        return { success: false as const, message: "ID AI model harus diisi" }
    }
    return apiRequest<AiModelData>(`/ai-models/${encodeURIComponent(id)}`)
}
