"use client"

import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { deleteAiModel } from "../server/delete-ai-model"
import { AiModelData } from "../server/get-ai-models"
import { PaginationMeta } from "@/types/api"

type Props = {
    items: AiModelData[]
    meta: PaginationMeta
}

export default function AiModelTable({ items, meta }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchParams.get("search_global") ?? "")
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(page))
        router.push(`${pathname}?${params.toString()}`)
    }

    function handleSearchSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (search) {
            params.set("search_global", search)
        } else {
            params.delete("search_global")
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    function handleDelete(id: string) {
        if (!window.confirm("Hapus AI model ini?")) return

        setDeletingId(id)
        startTransition(async () => {
            const result = await deleteAiModel(id)
            setDeletingId(null)
            if (!result.success) {
                window.alert(result.message)
                return
            }
            router.refresh()
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari AI model..."
                        className="rounded border px-3 py-2"
                    />
                    <button type="submit" className="rounded border px-3 py-2">
                        Cari
                    </button>
                </form>
                <Link href="/dashboard/ai-models/create" className="rounded bg-black px-4 py-2 text-white">
                    Tambah AI Model
                </Link>
            </div>

            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 pr-4">Nama</th>
                        <th className="py-2 pr-4">Provider</th>
                        <th className="py-2 pr-4">Nama Model</th>
                        <th className="py-2 pr-4">Tipe</th>
                        <th className="py-2 pr-4">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-4 text-center text-neutral-500">
                                Belum ada AI model
                            </td>
                        </tr>
                    )}
                    {items.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="py-2 pr-4">{item.name}</td>
                            <td className="py-2 pr-4">{item.provider}</td>
                            <td className="py-2 pr-4">{item.model_name}</td>
                            <td className="py-2 pr-4">{item.type}</td>
                            <td className="py-2 pr-4">
                                <div className="flex gap-3">
                                    <Link href={`/dashboard/ai-models/${item.id}/edit`} className="underline">
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isPending && deletingId === item.id}
                                        className="text-red-600 underline disabled:opacity-50"
                                    >
                                        {isPending && deletingId === item.id ? "Menghapus..." : "Hapus"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-between text-sm">
                <p>
                    Halaman {meta.page} dari {meta.totalPages} ({meta.total} data)
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => goToPage(meta.page - 1)}
                        disabled={meta.page <= 1}
                        className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                        Sebelumnya
                    </button>
                    <button
                        type="button"
                        onClick={() => goToPage(meta.page + 1)}
                        disabled={meta.page >= meta.totalPages}
                        className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </div>
    )
}
