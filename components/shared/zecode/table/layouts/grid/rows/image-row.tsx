import { getNestedValue } from "@/components/shared/zecode/utils"

interface ImageRowSchema<T> {
    key: string
    alt?: (row: T) => string
    aspectRatio?: string
    defaultImage?: string
}

export default function ImageRow<T>({ row, field }: { row: T; field: ImageRowSchema<T> }) {
    const { key, alt, aspectRatio = "aspect-square", defaultImage = "" } = field
    const imageSrc = getNestedValue<string>(row, key) || defaultImage

    return (
        <img
            src={imageSrc}
            alt={alt?.(row) ?? "Image"}
            className={`${aspectRatio} w-full rounded-lg object-cover`}
        />
    )
}
