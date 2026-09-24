"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function PerPage({
    options = [10, 25, 50, 100, "all"],
    defaultValue = 10,
    paramKey = "perPage",
    paginationParamKey = "page",
}: {
    options?: (number | "all")[]
    defaultValue?: number
    paramKey?: string
    paginationParamKey?: string
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPerPage = searchParams.get(paramKey) || defaultValue.toString()

    const handlePerPageChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set(paginationParamKey, "1")

        if (value === defaultValue.toString()) {
            params.delete(paramKey)
        } else {
            params.set(paramKey, value)
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                key={`${paramKey}-${currentPerPage}`}
                value={currentPerPage}
                onValueChange={handlePerPageChange}
            >
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder={currentPerPage} />
                </SelectTrigger>
                <SelectContent side="top" align="end" className="end-0 top-0">
                    {options.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                            {option === "all" ? "Semua" : option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
