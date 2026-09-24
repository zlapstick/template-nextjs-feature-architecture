"use client"

import { TableCell } from "@/components/ui/table"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export type ActionItem<T> =
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
          type: "modal"
          dialogTitle?: string | ((row: T) => string)
          dialogDescription?: string | ((row: T) => string)
          render: (row: T) => React.ReactNode
          label?: string
          icon?: React.ReactNode
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

export default function ActionColumn<T>({
    row,
    actions,
    className,
}: {
    row: T
    actions: (row: T) => ActionItem<T>[]
    className?: string
}) {
    const [open, setOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentDeleteAction, setCurrentDeleteAction] = useState<Extract<
        ActionItem<T>,
        { type: "delete" }
    > | null>(null)
    const [currentModalAction, setCurrentModalAction] = useState<Extract<
        ActionItem<T>,
        { type: "modal" }
    > | null>(null)
    const actionItems = actions(row)

    if (actionItems.length === 0) {
        return <TableCell className={className}></TableCell>
    }

    return (
        <TableCell className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-48 p-2">
                    <div className="flex flex-col gap-1">
                        {actionItems.map((action, index) => {
                            if (action.type === "custom") {
                                return (
                                    <div key={index} className="w-full">
                                        {action.render(row)}
                                    </div>
                                )
                            }

                            if (action.type === "edit") {
                                return (
                                    <Link
                                        key={index}
                                        href={action.href(row)}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        {action.label ?? "Edit"}
                                    </Link>
                                )
                            }

                            if (action.type === "view") {
                                return (
                                    <Link
                                        key={index}
                                        href={action.href(row)}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {action.label ?? "View"}
                                    </Link>
                                )
                            }

                            if (action.type === "modal") {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setOpen(false)
                                            setCurrentModalAction(action)
                                            setModalOpen(true)
                                        }}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                    >
                                        {action.icon ?? <Eye className="h-4 w-4" />}
                                        {action.label ?? "Detail"}
                                    </button>
                                )
                            }

                            if (action.type === "delete") {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setOpen(false)
                                            setCurrentDeleteAction(action)
                                            setDeleteDialogOpen(true)
                                        }}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {action.label ?? "Hapus"}
                                    </button>
                                )
                            }

                            return null
                        })}
                    </div>
                </PopoverContent>
            </Popover>

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

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0">
                    <DialogHeader className="bg-primary p-5 text-primary-foreground">
                        {currentModalAction?.dialogTitle && (
                            <DialogTitle>
                                {typeof currentModalAction.dialogTitle === "function"
                                    ? currentModalAction.dialogTitle(row)
                                    : currentModalAction.dialogTitle}
                            </DialogTitle>
                        )}
                        {currentModalAction?.dialogDescription && (
                            <DialogDescription className="text-primary-foreground/80">
                                {typeof currentModalAction.dialogDescription === "function"
                                    ? currentModalAction.dialogDescription(row)
                                    : currentModalAction.dialogDescription}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    {currentModalAction?.render(row)}
                </DialogContent>
            </Dialog>
        </TableCell>
    )
}
