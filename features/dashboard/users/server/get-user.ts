"use server"

import { apiRequest } from "@/utils/api-fetch"
import { UserData } from "./get-users"

export async function getUser(id: string) {
    if (!id?.trim()) {
        return { success: false as const, message: "ID user harus diisi" }
    }
    return apiRequest<UserData>(`/users/${encodeURIComponent(id)}`)
}
