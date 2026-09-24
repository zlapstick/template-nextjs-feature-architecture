"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { generatePagination } from "@/utils/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function PaginationTable({
    totalPages,
    paramKey = "page",
}: {
    totalPages: number
    paramKey?: string
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPage = Number(searchParams.get(paramKey)) || 1

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(paramKey, page.toString())
        router.push(`${pathname}?${params.toString()}`)
        router.refresh()
    }

    const allPages = generatePagination(currentPage, totalPages)

    if (totalPages <= 1) return null

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                        className={
                            currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {allPages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    const isActive = currentPage === page

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={isActive}
                                onClick={() => !isActive && goToPage(page as number)}
                                className={isActive ? "pointer-events-none" : "cursor-pointer"}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                        className={
                            currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
