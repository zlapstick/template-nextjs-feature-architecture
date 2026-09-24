export type StatisticsGrid = {
    gridCols?:
        | number
        | {
              default?: number
              sm?: number
              md?: number
              lg?: number
              xl?: number
          }
    gridClassName?: string
    stats: StatisticCard[]
}

export type StatisticCard = {
    label?: string
    value?: number | string
    link?: string
    icon?: string
    iconBgColor?: string
    iconColor?: string
    containerClassName?: string
    iconClassName?: string
    colSpan?:
        | number
        | {
              default?: number
              sm?: number
              md?: number
              lg?: number
              xl?: number
          }
}
