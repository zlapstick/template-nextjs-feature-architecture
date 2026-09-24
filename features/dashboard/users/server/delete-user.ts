"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/utils/api-fetch"

export async function deleteUser(id: string) {
    if (!id?.trim()) {
        return { success: false as const, message: "ID user harus diisi" }
    }

    const result = await apiRequest<null>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" })
    if (result.success) {
        revalidatePath("/dashboard/users")
    }

    return result
}
