export type FieldErrors<Fields extends string = string> = Partial<
    Record<Fields | "general", string[]>
>

export type FormState<Fields extends string = string> = {
    success?: boolean
    message?: string
    data?: Partial<Record<Fields, string>>
    errors?: FieldErrors<Fields>
}

export type PaginationMeta = {
    page: number
    perPage: number
    total: number
    totalPages: number
}

export type Result<T> =
    | { success: true; message?: string; data: T; meta?: unknown }
    | { success: false; message: string; errors?: Record<string, string[]> }
