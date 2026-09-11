"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"

export async function deleteAiModel(id: string) {
    if (!id?.trim()) {
        return { success: false as const, message: "ID AI model harus diisi" }
    }

    const result = await apiRequest<null>(`/ai-models/${encodeURIComponent(id)}`, { method: "DELETE" })
    if (result.success) {
        revalidatePath("/dashboard/ai-models")
    }

    return result
}
