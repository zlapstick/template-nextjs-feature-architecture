"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { FieldBaseProps, getColSpanClass } from "@/components/shared/zecode/types/form"

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends FieldBaseProps {
    options: SelectOption[]
}

export default function Select({
    label,
    name,
    value,
    defaultValue,
    placeholder,
    errors = null,
    colspan = 1,
    required = true,
    disabled = false,
    hideLabel = false,
    description,
    inputClassName,
    containerClassName,
    onValueChange,
    options = [],
    ...props
}: SelectProps) {
    const errorMessage = Array.isArray(errors) ? errors[0] : errors
    const normalizedValue =
        typeof value === "string" || typeof value === "number" ? value : undefined
    const normalizedDefaultValue =
        typeof defaultValue === "string" || typeof defaultValue === "number"
            ? defaultValue
            : undefined

    return (
        <div className={cn(getColSpanClass(colspan), containerClassName)}>
            {!hideLabel && label && (
                <Label htmlFor={name} className="mb-2 block text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            {description && <p className="mb-2 text-sm text-muted-foreground">{description}</p>}

            <select
                id={name}
                name={name}
                value={normalizedValue}
                defaultValue={normalizedValue === undefined ? normalizedDefaultValue : undefined}
                className={cn(
                    "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    errorMessage && "border-destructive focus-visible:ring-destructive/20",
                    inputClassName,
                )}
                required={required}
                disabled={disabled}
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? `${name}-error` : undefined}
                onChange={(e) => {
                    onValueChange?.(e.target.value, name)
                }}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {errorMessage && (
                <p id={`${name}-error`} className="mt-2 text-sm text-red-500" role="alert">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
