import { Card } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"
import { ArrowRight, Link } from "lucide-react"
import { StatisticCard } from "../../types/statistic"

export default function StatistikCard({
    label = "Pengguna",
    value = 1,
    link = "",
    icon,
    iconBgColor = "bg-primary",
    iconColor = "text-primary-foreground",
    containerClassName = "",
    iconClassName = "",
    colSpan = 1,
}: StatisticCard) {
    const Icon = icon ? (LucideIcons as any)[icon] : null
    const colSpanClass = generateColSpanClass(colSpan, 1)

    return (
        <Card
            className={`flex w-full flex-col justify-between gap-0 overflow-hidden rounded-lg p-0 ${colSpanClass} ${containerClassName}`}
        >
            <div className="flex w-full items-center gap-5 p-5">
                {Icon && (
                    <div
                        className={`flex items-center justify-center rounded-lg ${iconBgColor} p-4 ${iconClassName}`}
                    >
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                )}
                <div>
                    <h3 className="text-sm text-muted-foreground">{label}</h3>
                    <span className="text-xl font-bold">{value}</span>
                </div>
            </div>

            {link && (
                <Link
                    href={link}
                    className="flex w-full items-center justify-between bg-slate-50 px-5 py-3 text-sm hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                    <span className="w-full">Lihat Detail</span>
                    <ArrowRight className="inline-block h-4 w-4" />
                </Link>
            )}
        </Card>
    )
}

const _ =
    "col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12 sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12 md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5 md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12 lg:col-span-1 lg:col-span-2 lg:col-span-3 lg:col-span-4 lg:col-span-5 lg:col-span-6 lg:col-span-7 lg:col-span-8 lg:col-span-9 lg:col-span-10 lg:col-span-11 lg:col-span-12 xl:col-span-1 xl:col-span-2 xl:col-span-3 xl:col-span-4 xl:col-span-5 xl:col-span-6 xl:col-span-7 xl:col-span-8 xl:col-span-9 xl:col-span-10 xl:col-span-11 xl:col-span-12"

function generateColSpanClass(colSpan: StatisticCard["colSpan"], defaultSpan: number): string {
    if (typeof colSpan === "number") {
        return `col-span-${colSpan}`
    }

    return Object.entries(colSpan || {})
        .map(([breakpoint, span]) => {
            const spanValue = span || defaultSpan
            return breakpoint === "default"
                ? `col-span-${spanValue}`
                : `${breakpoint}:col-span-${spanValue}`
        })
        .join(" ")
}
