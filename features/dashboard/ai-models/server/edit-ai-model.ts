"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"
import { apiFieldErrors, zodFieldErrors } from "@/utils/form"
import { AiModelField } from "../schemas/ai-model"
import { updateAiModelSchema } from "../schemas/update-ai-model"
import { AiModelFormState } from "./create-ai-model"

export async function editAiModel(
    id: string,
    _prevState: AiModelFormState | undefined,
    formData: FormData
): Promise<AiModelFormState> {
    const rawData = Object.fromEntries(formData) as Record<AiModelField, string>

    const validation = updateAiModelSchema.safeParse(rawData)
    if (!validation.success) {
        return { data: rawData, errors: zodFieldErrors(validation.error) }
    }

    const result = await apiRequest(`/ai-models/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
    })

    if (!result.success) {
        const errors = apiFieldErrors(result.errors)
        return { data: rawData, errors: Object.keys(errors).length ? errors : { general: [result.message] } }
    }

    revalidatePath("/dashboard/ai-models")
    revalidatePath(`/dashboard/ai-models/${id}/edit`)
    return { success: true, message: "AI model berhasil diperbarui!", data: rawData }
}
