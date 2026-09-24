"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function SearchBar({
    placeholder,
    className = "w-full",
    paramKey = "query",
    perPageParamKey = "perPage",
    paginationParamKey = "page",
    defaultPerPage = 12,
}: {
    placeholder: string
    className?: string
    paramKey?: string
    perPageParamKey?: string
    paginationParamKey?: string
    defaultPerPage?: number
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentValue = searchParams.get(paramKey) ?? ""
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== currentValue) {
            inputRef.current.value = currentValue
        }
    }, [currentValue])

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set(paginationParamKey, "1")
        params.set(perPageParamKey, defaultPerPage.toString())

        if (term) {
            params.set(paramKey, term)
        } else {
            params.delete(paramKey)
        }

        router.replace(`${pathname}?${params.toString()}`)
    }, 500)

    return (
        <div className="relative flex flex-1">
            <Input
                ref={inputRef}
                type="text"
                className={`w-full rounded-4xl border border-input py-2 pl-10 text-sm outline-2 ${className}`}
                placeholder={placeholder}
                defaultValue={currentValue}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}
