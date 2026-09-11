import { z } from "zod"
import { aiModelFieldSchemas } from "./ai-model"

export const createAiModelSchema = z.object(aiModelFieldSchemas)

export type CreateAiModelInput = z.infer<typeof createAiModelSchema>
