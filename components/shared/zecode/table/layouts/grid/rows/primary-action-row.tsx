"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

export type PrimaryActionItem<T> =
    | {
          type: "edit"
          href: (row: T) => string
          label?: string
      }
    | {
          type: "view"
          href: (row: T) => string
          label?: string
      }
    | {
          type: "delete"
          dialogTitle?: string | ((row: T) => string)
          dialogDescription?: string | ((row: T) => string)
          method: (row: T) => void | Promise<{ success: boolean; message?: string }>
          onSuccess?: (result: { success: boolean; message?: string }, row: T) => void
          label?: string
      }
    | {
          type: "custom"
          render: (row: T) => React.ReactNode
      }

export function PrimaryActions<T>({
    row,
    actions,
}: {
    row: T
    actions: (row: T) => PrimaryActionItem<T>[]
}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [currentDeleteAction, setCurrentDeleteAction] = useState<Extract<
        PrimaryActionItem<T>,
        { type: "delete" }
    > | null>(null)

    const actionItems = actions(row)

    return (
        <>
            <div className="flex w-full gap-2">
                {actionItems.map((action, index) => {
                    if (action.type === "custom") {
                        return (
                            <div key={index} className="flex-1">
                                {action.render(row)}
                            </div>
                        )
                    }

                    if (action.type === "edit") {
                        return (
                            <Link key={index} href={action.href(row)} className="flex-1">
                                <Button className="w-full">
                                    <Pencil /> {action.label || "Edit"}
                                </Button>
                            </Link>
                        )
                    }

                    if (action.type === "view") {
                        return (
                            <Link key={index} href={action.href(row)} className="flex-1">
                                <Button className="w-full">
                                    <Eye /> {action.label || "View"}
                                </Button>
                            </Link>
                        )
                    }

                    if (action.type === "delete") {
                        return (
                            <Button
                                key={index}
                                className="w-fit"
                                variant="destructive"
                                onClick={() => {
                                    setCurrentDeleteAction(action)
                                    setDeleteDialogOpen(true)
                                }}
                            >
                                <Trash2 />
                            </Button>
                        )
                    }

                    return null
                })}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {currentDeleteAction?.dialogTitle
                                ? typeof currentDeleteAction.dialogTitle === "function"
                                    ? currentDeleteAction.dialogTitle(row)
                                    : currentDeleteAction.dialogTitle
                                : "Apakah Anda yakin?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {currentDeleteAction?.dialogDescription
                                ? typeof currentDeleteAction.dialogDescription === "function"
                                    ? currentDeleteAction.dialogDescription(row)
                                    : currentDeleteAction.dialogDescription
                                : "Aksi ini tidak dapat dibatalkan. Data akan dihapus secara permanen."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                const result = await currentDeleteAction?.method(row)
                                if (result && currentDeleteAction?.onSuccess) {
                                    currentDeleteAction.onSuccess(result, row)
                                }
                                setDeleteDialogOpen(false)
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
