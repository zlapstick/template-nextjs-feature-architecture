import { TableCell } from "@/components/ui/table"
import { getNestedValue } from "@/components/shared/zecode/utils"

export default function FileUploadColumn<T>({
    row,
    columnKey,
    className,
    renderPreview,
}: {
    row: T
    columnKey: string
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderPreview?: (value: any) => React.ReactNode
}) {
    const value = getNestedValue<string>(row, columnKey)

    if (renderPreview) {
        return <TableCell className={className}>{renderPreview(value)}</TableCell>
    }

    return (
        <TableCell className={className}>
            {value ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline truncate max-w-xs inline-block"
                    title={value}
                >
                    {typeof value === "string" ? value.split("/").pop() : String(value)}
                </a>
            ) : (
                <span className="text-muted-foreground">-</span>
            )}
        </TableCell>
    )
}
