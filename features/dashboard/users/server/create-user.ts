"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"
import { apiFieldErrors, zodFieldErrors } from "@/utils/form"
import { FormState } from "@/types/api"
import { createUserSchema, CreateUserField } from "../schemas/create-user"

export type UserFormState = FormState<CreateUserField>

export async function createUser(
    _prevState: UserFormState | undefined,
    formData: FormData,
): Promise<UserFormState> {
    const rawData = Object.fromEntries(formData) as Record<CreateUserField, string>

    const validation = createUserSchema.safeParse(rawData)
    if (!validation.success) {
        return { data: rawData, errors: zodFieldErrors(validation.error) }
    }

    const result = await apiRequest(`/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
    })

    if (!result.success) {
        const errors = apiFieldErrors(result.errors)
        return {
            data: rawData,
            errors: Object.keys(errors).length ? errors : { general: [result.message] },
        }
    }

    revalidatePath("/dashboard/users")
    return { success: true, message: "User berhasil didaftarkan!", data: rawData }
}
