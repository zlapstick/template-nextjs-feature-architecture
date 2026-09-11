import { z } from "zod"
import { aiModelFieldSchemas } from "./ai-model"

export const updateAiModelSchema = z.object(aiModelFieldSchemas)

export type UpdateAiModelInput = z.infer<typeof updateAiModelSchema>
