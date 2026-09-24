export type ResponsiveGrid = {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export type ResponsiveSpan = {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export interface FieldBaseProps {
    label?: string
    name: string
    value?: string | number | boolean | null
    defaultValue?: any
    placeholder?: string
    errors?: string | null | string[]
    colspan?: number | ResponsiveSpan
    hideLabel?: boolean
    description?: string
    inputClassName?: string
    containerClassName?: string
    required?: boolean
    disabled?: boolean
    onValueChange?: (value: any, name?: string) => void
}

export interface TextAreaProps extends FieldBaseProps {
    rows?: number
    maxLength?: number
}

export const getColSpanClass = (span: number | ResponsiveSpan): string => {
    if (typeof span === "number") return `col-span-${span}`

    const classes: string[] = []
    if (span.default) classes.push(`col-span-${span.default}`)
    if (span.sm) classes.push(`sm:col-span-${span.sm}`)
    if (span.md) classes.push(`md:col-span-${span.md}`)
    if (span.lg) classes.push(`lg:col-span-${span.lg}`)
    if (span.xl) classes.push(`xl:col-span-${span.xl}`)

    return classes.length > 0 ? classes.join(" ") : "col-span-1"
}
