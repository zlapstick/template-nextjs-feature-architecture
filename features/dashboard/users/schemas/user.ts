import { z } from "zod"

export const userRoles = ["superadmin", "user"] as const

export const userRoleLabels: Record<(typeof userRoles)[number], string> = {
    superadmin: "Superadmin",
    user: "User",
}

export const userFieldSchemas = {
    name: z.string("Nama harus string").min(1, "Nama diperlukan").min(3, "Nama minimal 3 karakter"),
    email: z.string("Email harus string").min(1, "Email diperlukan").email("Email tidak valid"),
    role: z.enum(userRoles, "Role tidak valid"),
}

export type UserField = keyof typeof userFieldSchemas
