import { notFound } from "next/navigation"
import { getAiModel } from "@/features/dashboard/ai-models/server/get-ai-model"
import AiModelEdit from "@/features/dashboard/ai-models/components/ai-models-edit"

export default async function Page({ params }: PageProps<"/dashboard/ai-models/[id]/edit">) {
    const { id } = await params
    const result = await getAiModel(id)

    if (!result.success) {
        notFound()
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">Edit AI Model</h1>
            <AiModelEdit id={id} aiModel={result.data} />
        </div>
    )
}
