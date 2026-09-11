"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"
import { apiFieldErrors, zodFieldErrors } from "@/utils/form"
import { FormState } from "@/types/api"
import { AiModelField } from "../schemas/ai-model"
import { createAiModelSchema } from "../schemas/create-ai-model"

export type AiModelFormState = FormState<AiModelField>

export async function createAiModel(_prevState: AiModelFormState | undefined, formData: FormData): Promise<AiModelFormState> {
    const rawData = Object.fromEntries(formData) as Record<AiModelField, string>

    const validation = createAiModelSchema.safeParse(rawData)
    if (!validation.success) {
        return { data: rawData, errors: zodFieldErrors(validation.error) }
    }

    const result = await apiRequest(`/ai-models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
    })

    if (!result.success) {
        const errors = apiFieldErrors(result.errors)
        return { data: rawData, errors: Object.keys(errors).length ? errors : { general: [result.message] } }
    }

    revalidatePath("/dashboard/ai-models")
    return { success: true, message: "AI model berhasil dibuat!", data: rawData }
}
