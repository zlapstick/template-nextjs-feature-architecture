"use client"

import { Card } from "@/components/ui/card"
import ImageRow from "./rows/image-row"
import TextRow from "./rows/text-row"
import CustomRow from "./rows/custom-row"
import { PrimaryActions } from "./rows/primary-action-row"
import { MenuActions } from "./rows/menu-action-row"

type GridField<T> = ImageFieldSchema<T> | TextFieldSchema<T> | CustomFieldSchema<T>

interface BaseField {
    key: string
}

interface ImageFieldSchema<T> extends BaseField {
    type: "image-row"
    alt?: (row: T) => string
    aspectRatio?: string
    defaultImage?: string
}

interface TextFieldSchema<T> extends BaseField {
    type: "text-row"
    label?: string
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
    weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold"
    className?: string
}

interface CustomFieldSchema<T> extends BaseField {
    type: "custom-row"
    render: (row: T) => React.ReactNode
}

interface GridActionsConfig<T> {
    primary?: (row: T) => (
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
    )[]
    menu?: (row: T) => (
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
    )[]
}

export default function TableGridLayout<T>({
    data,
    fields,
    actions,
    rowKey,
    gridCols = { default: 1, md: 2, lg: 3 },
    cardClassName,
}: {
    data: T[]
    fields: GridField<T>[]
    actions?: GridActionsConfig<T>
    rowKey: (row: T) => string | number
    gridCols?: {
        default?: number
        md?: number
        lg?: number
        xl?: number
    }
    cardClassName?: (row: T) => string
}) {
    const gridColsMap = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
    }

    const mdGridColsMap = {
        1: "md:grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        5: "md:grid-cols-5",
        6: "md:grid-cols-6",
    }

    const lgGridColsMap = {
        1: "lg:grid-cols-1",
        2: "lg:grid-cols-2",
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
        5: "lg:grid-cols-5",
        6: "lg:grid-cols-6",
    }

    const xlGridColsMap = {
        1: "xl:grid-cols-1",
        2: "xl:grid-cols-2",
        3: "xl:grid-cols-3",
        4: "xl:grid-cols-4",
        5: "xl:grid-cols-5",
        6: "xl:grid-cols-6",
    }

    const gridClasses = [
        gridColsMap[(gridCols.default as keyof typeof gridColsMap) || 1],
        gridCols.md && mdGridColsMap[gridCols.md as keyof typeof mdGridColsMap],
        gridCols.lg && lgGridColsMap[gridCols.lg as keyof typeof lgGridColsMap],
        gridCols.xl && xlGridColsMap[gridCols.xl as keyof typeof xlGridColsMap],
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <div className={`grid gap-5 p-5 ${gridClasses}`}>
            {data.length === 0 && (
                <div className="col-span-full text-center text-base">
                    Tidak ada data untuk ditampilkan.
                </div>
            )}

            {data.map((row) => (
                <Card
                    key={rowKey(row)}
                    className={`relative flex flex-col gap-2 p-0 ${cardClassName ? cardClassName(row) : ""}`}
                >
                    {fields.map((field) => {
                        switch (field.type) {
                            case "image-row":
                                return <ImageRow key={field.key} row={row} field={field} />
                            case "text-row":
                                return <TextRow key={field.key} row={row} field={field} />
                            case "custom-row":
                                return <CustomRow key={field.key} row={row} field={field} />
                            default:
                                return null
                        }
                    })}

                    {actions?.primary && <PrimaryActions row={row} actions={actions.primary} />}

                    {actions?.menu && <MenuActions row={row} actions={actions.menu} />}
                </Card>
            ))}
        </div>
    )
}
