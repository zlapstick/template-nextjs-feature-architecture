"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { FieldBaseProps, getColSpanClass } from "@/components/shared/zecode/types/form"
import Link from "next/link"

interface FileUploadProps extends FieldBaseProps {
    accept?: string
    maxSize?: number
    currentFile?: string | null
    currentFileLabel?: string
}

export default function FileUpload({
    label,
    name,
    onValueChange,
    errors = null,
    colspan = 1,
    required = true,
    disabled = false,
    hideLabel = false,
    description,
    containerClassName,
    inputClassName,
    accept = "image/*",
    maxSize = 10,
    currentFile,
    currentFileLabel = "File saat ini",
}: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const errorMessage = Array.isArray(errors) ? errors[0] : errors

    const handleFileChange = (file: File | null) => {
        if (file) {
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`File terlalu besar. Maksimal ${maxSize}MB`)
                return
            }
        }
        setSelectedFile(file)
        onValueChange?.(file, name)
    }

    const handleClearFile = () => {
        setSelectedFile(null)
        onValueChange?.(null, name)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        handleFileChange(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0] || null
        handleFileChange(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className={cn(getColSpanClass(colspan), containerClassName)}>
            {!hideLabel && label && (
                <Label htmlFor={name} className="mb-2 block text-sm font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            {description && <p className="mb-2 text-sm text-muted-foreground">{description}</p>}

            {currentFile && !selectedFile && (
                <div className="mb-3 overflow-hidden rounded-lg border">
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <p className="text-sm font-medium text-primary">{currentFileLabel}:</p>
                            <p className="text-sm truncate">{currentFile.split("/").pop()}</p>
                        </div>
                        <Button asChild size="sm">
                            <Link href={currentFile} target="_blank" rel="noreferrer">
                                Lihat
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {selectedFile && (
                <div className="mb-3 overflow-hidden rounded-lg border">
                    <div className="flex items-center justify-between p-3">
                        <div>
                            <p className="text-sm font-medium text-primary">File baru:</p>
                            <p className="text-sm truncate">
                                {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={handleClearFile}
                            className="text-destructive hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <div
                className={cn(
                    "relative rounded-lg border-2 border-dashed p-6 transition-colors",
                    dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    "hover:border-primary hover:bg-primary/5",
                    errorMessage && "border-destructive",
                    disabled && "cursor-not-allowed opacity-50",
                    inputClassName,
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <Input
                    id={name}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    disabled={disabled}
                    aria-invalid={errorMessage ? "true" : "false"}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                />

                <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    {selectedFile ? (
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Drag & drop file atau{" "}
                                <span className="font-medium text-primary">klik untuk browse</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {accept && `Format: ${accept}`} • Maksimal {maxSize}MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {errorMessage && (
                <p id={`${name}-error`} className="mt-2 text-sm text-destructive" role="alert">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
