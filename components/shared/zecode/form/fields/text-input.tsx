import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { FieldBaseProps, getColSpanClass } from "../../types/form"

interface TextInputProps extends FieldBaseProps {
    inputType?: string
    min?: number
    max?: number
    step?: number
    showPasswordToggle?: boolean
    prefix?: React.ReactNode
    autoComplete?:
        "on" | "off" | "name" | "username" | "email" | "current-password" | "new-password"
}

export default function TextInput({
    label,
    name,
    value,
    defaultValue,
    placeholder,
    inputType,
    min,
    max,
    step,
    errors = null,
    colspan = 1,
    required = true,
    disabled = false,
    hideLabel = false,
    description,
    inputClassName,
    containerClassName,
    showPasswordToggle = true,
    prefix,
    autoComplete,
    onValueChange,
    ...props
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const finalInputType = inputType || "text"
    const isPasswordType = finalInputType === "password"
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

            <div className="relative">
                <Input
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={normalizedValue}
                    defaultValue={
                        normalizedValue === undefined ? normalizedDefaultValue : undefined
                    }
                    className={cn(
                        "w-full",
                        isPasswordType && showPasswordToggle && "pr-10",
                        errorMessage && "border-red-500 focus-visible:ring-red-500",
                        inputClassName,
                    )}
                    type={isPasswordType && showPassword ? "text" : finalInputType}
                    min={min}
                    max={max}
                    step={step}
                    required={required}
                    disabled={disabled}
                    prefix={prefix}
                    autoComplete={autoComplete}
                    aria-invalid={errorMessage ? "true" : "false"}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                    onChange={(e) => {
                        onValueChange?.(e.target.value, name)
                    }}
                    {...props}
                />

                {isPasswordType && showPasswordToggle && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
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
