import { z } from "zod"

export const aiModelTypes = ["chat", "image"] as const

export const aiModelFieldSchemas = {
    name: z
        .string("Nama harus string")
        .min(1, "Nama AI model diperlukan")
        .min(3, "Nama minimal 3 karakter"),
    provider: z
        .string("Provider harus string")
        .min(1, "Provider diperlukan"),
    model_name: z
        .string("Nama model harus string")
        .min(1, "Nama model diperlukan"),
    type: z.enum(aiModelTypes, "Tipe AI model tidak valid"),
}

export type AiModelField = keyof typeof aiModelFieldSchemas
