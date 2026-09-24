import { z } from "zod"
import { userFieldSchemas } from "./user"

export const createUserSchema = z.object({
    ...userFieldSchemas,
    password: z
        .string("Password harus string")
        .min(1, "Password diperlukan")
        .min(8, "Password minimal 8 karakter"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateUserField = keyof CreateUserInput
