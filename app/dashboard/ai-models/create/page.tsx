import AiModelCreate from "@/features/dashboard/ai-models/components/ai-models-create"

export default function Page() {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">Tambah AI Model</h1>
            <AiModelCreate />
        </div>
    )
}
