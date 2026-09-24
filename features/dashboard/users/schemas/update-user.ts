import { z } from "zod"
import { userFieldSchemas } from "./user"

export const updateUserSchema = z.object(userFieldSchemas)

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserField = keyof UpdateUserInput
