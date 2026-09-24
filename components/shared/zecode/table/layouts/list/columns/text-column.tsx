import { TableCell } from "@/components/ui/table"
import { getNestedValue } from "@/components/shared/zecode/utils"

export default function TextColumn<T>({
    row,
    columnKey,
    className,
}: {
    row: T
    columnKey: string
    className?: string
}) {
    const value = getNestedValue<React.ReactNode>(row, columnKey)
    return <TableCell className={className}>{value}</TableCell>
}
