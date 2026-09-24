export function getNestedValue<R = unknown>(obj: unknown, path: string): R {
    return path
        .split(".")
        .reduce<unknown>((current, key) => (current as Record<string, unknown>)?.[key], obj) as R
}
