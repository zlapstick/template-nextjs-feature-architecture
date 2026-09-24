"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TextColumn from "./columns/text-column"
import ActionColumn, { ActionItem } from "./columns/action-column"
import FileUploadColumn from "./columns/file-upload-column"

type TableColumn<T> =
    TextColumnSchema | CustomColumnSchema<T> | ActionColumnSchema<T> | FileUploadColumnSchema

interface BaseColumn {
    key: string
    label: string
}

interface TextColumnSchema extends BaseColumn {
    type: "text-column"
    visible?: <T>(row: T) => boolean
}

interface CustomColumnSchema<T> extends BaseColumn {
    type: "custom-column"
    render: (row: T) => React.ReactNode
    visible?: (row: T) => boolean
}

interface ActionColumnSchema<T> extends BaseColumn {
    type: "action-column"
    actions: (row: T) => ActionItem<T>[]
    visible?: (row: T) => boolean
}

interface FileUploadColumnSchema extends BaseColumn {
    type: "file-upload-column"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderPreview?: (value: any) => React.ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visible?: (row: any) => boolean
}

export default function TableListLayout<T>({
    data,
    columns,
    rowKey,
}: {
    data: T[]
    columns: TableColumn<T>[]
    rowKey: (row: T) => string | number
}) {
    return (
        <div className="overflow-x-auto">
            <Table className="overflow-x-scroll">
                <TableHeader>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableHead
                                key={col.key}
                                className={` py-4  ${index === 0 ? "pl-5" : ""} ${
                                    index === columns.length - 1 ? "pr-5" : ""
                                }`}
                            >
                                {col.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="py-5 text-center">
                                Tidak ada data untuk ditampilkan.
                            </TableCell>
                        </TableRow>
                    )}
                    {data.map((row) => (
                        <TableRow key={rowKey(row)} className="h-14">
                            {columns.map((column, index) => {
                                const isFirst = index === 0
                                const isLast = index === columns.length - 1
                                const className = `${isFirst ? "pl-5" : ""} ${isLast ? "pr-5" : ""}`

                                switch (column.type) {
                                    case "text-column": {
                                        const shouldShow = column.visible?.(row) ?? true
                                        if (!shouldShow) {
                                            return (
                                                <TableCell key={column.key} className={className}>
                                                    -
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TextColumn
                                                key={column.key}
                                                row={row}
                                                columnKey={column.key}
                                                className={className}
                                            />
                                        )
                                    }
                                    case "custom-column": {
                                        const shouldShow = column.visible?.(row) ?? true
                                        if (!shouldShow) {
                                            return (
                                                <TableCell key={column.key} className={className}>
                                                    -
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TableCell key={column.key} className={className}>
                                                {column.render(row)}
                                            </TableCell>
                                        )
                                    }
                                    case "action-column": {
                                        const shouldShow = column.visible?.(row) ?? true
                                        if (!shouldShow) {
                                            return (
                                                <TableCell key={column.key} className={className}>
                                                    -
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <ActionColumn
                                                key={column.key}
                                                row={row}
                                                actions={column.actions}
                                                className={className}
                                            />
                                        )
                                    }
                                    case "file-upload-column": {
                                        const shouldShow = column.visible?.(row) ?? true
                                        if (!shouldShow) {
                                            return (
                                                <TableCell key={column.key} className={className}>
                                                    -
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <FileUploadColumn
                                                key={column.key}
                                                row={row}
                                                columnKey={column.key}
                                                renderPreview={column.renderPreview}
                                                className={className}
                                            />
                                        )
                                    }
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
