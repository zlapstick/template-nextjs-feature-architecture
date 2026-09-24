interface CustomRowSchema<T> {
    key: string
    render: (row: T) => React.ReactNode
}

export default function CustomRow<T>({ row, field }: { row: T; field: CustomRowSchema<T> }) {
    return <div>{field.render(row)}</div>
}
