"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { editAiModel } from "../server/edit-ai-model"
import { aiModelTypes } from "../schemas/ai-model"
import { AiModelData } from "../server/get-ai-models"

type Props = {
    id: string
    aiModel: AiModelData
}

export default function AiModelEdit({ id, aiModel }: Props) {
    const router = useRouter()
    const editAiModelWithId = editAiModel.bind(null, id)
    const [state, formAction, pending] = useActionState(editAiModelWithId, {
        data: {
            name: aiModel.name,
            provider: aiModel.provider,
            model_name: aiModel.model_name,
            type: aiModel.type,
        },
    })

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard/ai-models")
        }
    }, [state?.success, router])

    return (
        <form action={formAction} className="flex max-w-md flex-col gap-4">
            {state?.errors?.general && (
                <p className="text-sm text-red-600">{state.errors.general.join(", ")}</p>
            )}

            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">
                    Nama
                </label>
                <input
                    id="name"
                    name="name"
                    defaultValue={state?.data?.name}
                    className="rounded border px-3 py-2"
                />
                {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name.join(", ")}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="provider" className="text-sm font-medium">
                    Provider
                </label>
                <input
                    id="provider"
                    name="provider"
                    defaultValue={state?.data?.provider}
                    className="rounded border px-3 py-2"
                />
                {state?.errors?.provider && <p className="text-sm text-red-600">{state.errors.provider.join(", ")}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="model_name" className="text-sm font-medium">
                    Nama Model
                </label>
                <input
                    id="model_name"
                    name="model_name"
                    defaultValue={state?.data?.model_name}
                    className="rounded border px-3 py-2"
                />
                {state?.errors?.model_name && (
                    <p className="text-sm text-red-600">{state.errors.model_name.join(", ")}</p>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="type" className="text-sm font-medium">
                    Tipe
                </label>
                <select
                    id="type"
                    name="type"
                    defaultValue={state?.data?.type ?? aiModelTypes[0]}
                    className="rounded border px-3 py-2"
                >
                    {aiModelTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {state?.errors?.type && <p className="text-sm text-red-600">{state.errors.type.join(", ")}</p>}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {pending ? "Menyimpan..." : "Simpan"}
                </button>
                <Link href="/dashboard/ai-models" className="rounded border px-4 py-2">
                    Batal
                </Link>
            </div>
        </form>
    )
}
