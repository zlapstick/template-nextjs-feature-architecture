import { getAiModels } from "@/features/dashboard/ai-models/server/get-ai-models"
import AiModelTable from "@/features/dashboard/ai-models/components/ai-models-table"

export default async function Page({ searchParams }: PageProps<"/dashboard/ai-models">) {
    const params = await searchParams
    const page = Number(params.page) || 1
    const search_global = typeof params.search_global === "string" ? params.search_global : undefined

    const result = await getAiModels({ page, search_global })

    if (!result.success) {
        return (
            <div className="p-6">
                <h1 className="mb-4 text-xl font-semibold">AI Models</h1>
                <p className="text-red-600">{result.message}</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">AI Models</h1>
            <AiModelTable items={result.data.items} meta={result.data.meta} />
        </div>
    )
}
