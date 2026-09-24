import React from "react"
import { ResponsiveGrid } from "@/components/shared/zecode/types/form"
import TextInput from "@/components/shared/zecode/form/fields/text-input"
import TextArea from "@/components/shared/zecode/form/fields/text-area"
import FileUpload from "@/components/shared/zecode/form/fields/file-upload"
import Select from "@/components/shared/zecode/form/fields/select"

type BasicFormLayoutProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[]
    grid?: number
    gap?: number
}

export default function BasicFormLayout({ fields, grid = 1, gap = 4 }: BasicFormLayoutProps) {
    const gridCols = getGridClass(grid)
    const gapClass = `gap-${gap}`

    return (
        <div className={`grid ${gridCols} ${gapClass}`}>
            {fields.map((field, index) => {
                const shouldShow = field.visible !== false

                if (!shouldShow) {
                    return null
                }

                const { type, visible, className, ...fieldProps } = field

                switch (type) {
                    case "text-input":
                        return (
                            <TextInput
                                key={field.name || index}
                                {...fieldProps}
                                containerClassName={className}
                            />
                        )
                    case "textarea":
                        return (
                            <TextArea
                                key={field.name || index}
                                {...fieldProps}
                                containerClassName={className}
                            />
                        )
                    case "file-upload":
                        return (
                            <FileUpload
                                key={field.name || index}
                                {...fieldProps}
                                containerClassName={className}
                            />
                        )
                    case "select":
                        return (
                            <Select
                                key={field.name || index}
                                {...fieldProps}
                                containerClassName={className}
                            />
                        )
                    case "custom-field":
                        return (
                            <div key={field.name || index} className={className}>
                                {field.render?.()}
                            </div>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}

const getGridClass = (grid: number | ResponsiveGrid): string => {
    if (typeof grid === "number") {
        const gridMap: Record<number, string> = {
            1: "grid-cols-1",
            2: "grid-cols-1 sm:grid-cols-2",
            3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
            12: "grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12",
        }
        return gridMap[grid] || "grid-cols-1"
    }

    const classes: string[] = []
    if (grid.default) classes.push(`grid-cols-${grid.default}`)
    if (grid.sm) classes.push(`sm:grid-cols-${grid.sm}`)
    if (grid.md) classes.push(`md:grid-cols-${grid.md}`)
    if (grid.lg) classes.push(`lg:grid-cols-${grid.lg}`)
    if (grid.xl) classes.push(`xl:grid-cols-${grid.xl}`)

    return classes.length > 0 ? classes.join(" ") : "grid-cols-1"
}
