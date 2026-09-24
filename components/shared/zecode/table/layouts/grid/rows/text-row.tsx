import { cn } from "@/lib/utils"
import { getNestedValue } from "@/components/shared/zecode/utils"

const SIZE_CLASS: Record<"xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl", string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
}

const WEIGHT_CLASS: Record<"normal" | "medium" | "semibold" | "bold" | "extrabold", string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
}

interface TextRowSchema {
    key: string
    label?: string
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
    weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold"
    className?: string
}

export default function TextRow<T>({ row, field }: { row: T; field: TextRowSchema }) {
    const { key, label, size = "base", weight = "semibold", className } = field
    const value = getNestedValue<React.ReactNode>(row, key)

    return (
        <div className="flex flex-col gap-1 px-3">
            {label && <span className="text-xs text-muted-foreground">{label}</span>}
            <span className={cn(SIZE_CLASS[size], WEIGHT_CLASS[weight], className)}>{value}</span>
        </div>
    )
}
