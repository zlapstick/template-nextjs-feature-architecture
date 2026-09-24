import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TextAreaProps, getColSpanClass } from "../../types/form"

export default function TextArea({
    label,
    name,
    placeholder,
    value,
    defaultValue,
    onValueChange,
    errors = null,
    colspan = 1,
    required = true,
    disabled = false,
    rows = 4,
    maxLength,
    hideLabel = false,
    description,
    inputClassName,
    containerClassName,
    ...props
}: TextAreaProps) {
    const errorMessage = Array.isArray(errors) ? errors[0] : errors
    const normalizedValue =
        typeof value === "string" || typeof value === "number" ? value : undefined
    const normalizedDefaultValue =
        typeof defaultValue === "string" || typeof defaultValue === "number"
            ? defaultValue
            : undefined
    const currentLength = (normalizedValue ?? normalizedDefaultValue ?? "").toString().length

    return (
        <div className={cn(getColSpanClass(colspan), containerClassName)}>
            {!hideLabel && label && (
                <Label htmlFor={name} className="mb-2 block text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            {description && <p className="mb-2 text-sm text-muted-foreground">{description}</p>}

            <div className="relative">
                <Textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={normalizedValue}
                    defaultValue={
                        normalizedValue === undefined ? normalizedDefaultValue : undefined
                    }
                    onChange={(e) => {
                        onValueChange?.(e.target.value, name)
                    }}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={cn(
                        "w-full resize-none p-3",
                        errorMessage && "border-red-500 focus-visible:ring-red-500",
                        inputClassName,
                    )}
                    aria-invalid={errorMessage ? "true" : "false"}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                    {...props}
                />

                {maxLength !== undefined && (
                    <div
                        className={cn(
                            "absolute right-3 bottom-2 text-[10px] font-medium transition-colors",
                            currentLength >= maxLength ? "text-red-500" : "text-muted-foreground",
                        )}
                    >
                        {currentLength} / {maxLength}
                    </div>
                )}
            </div>

            {errorMessage && (
                <p id={`${name}-error`} className="mt-2 text-sm text-red-500" role="alert">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
