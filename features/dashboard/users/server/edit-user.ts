"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"
import { apiFieldErrors, zodFieldErrors } from "@/utils/form"
import { FormState } from "@/types/api"
import { updateUserSchema, UpdateUserField } from "../schemas/update-user"

export type EditUserFormState = FormState<UpdateUserField>

export async function editUser(
    id: string,
    _prevState: EditUserFormState | undefined,
    formData: FormData,
): Promise<EditUserFormState> {
    const rawData = Object.fromEntries(formData) as Record<UpdateUserField, string>

    const validation = updateUserSchema.safeParse(rawData)
    if (!validation.success) {
        return { data: rawData, errors: zodFieldErrors(validation.error) }
    }

    const result = await apiRequest(`/users/${encodeURIComponent(id)}`, {
        method: "PUT",
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
    revalidatePath(`/dashboard/users/${id}/edit`)
    return { success: true, message: "User berhasil diperbarui!", data: rawData }
}
