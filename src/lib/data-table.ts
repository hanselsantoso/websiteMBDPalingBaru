export type TableValue = string | number | null
export type TableSort = { column: number; direction: 'asc' | 'desc' }
export type TableRowValues = {
  values: readonly TableValue[]
  sortValues?: Readonly<Record<number, TableValue>>
}

type ViewOptions = {
  query: string
  sort: TableSort | null
  page: number
  pageSize: number
}

const collator = new Intl.Collator('id', { numeric: true, sensitivity: 'base' })

export function getTableView<T extends TableRowValues>(rows: readonly T[], options: ViewOptions) {
  const query = options.query.trim().toLocaleLowerCase('id')
  const matches = rows.filter(row => row.values.some(value => String(value ?? '').toLocaleLowerCase('id').includes(query)))
  const { sort, pageSize } = options
  if (sort) {
    matches.sort((a, b) => {
      const left = a.sortValues?.[sort.column] ?? a.values[sort.column]
      const right = b.sortValues?.[sort.column] ?? b.values[sort.column]
      if (left == null || left === '') return right == null || right === '' ? 0 : 1
      if (right == null || right === '') return -1
      const result = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : collator.compare(String(left), String(right))
      return sort.direction === 'asc' ? result : -result
    })
  }
  const total = matches.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(pages, Math.max(1, options.page))
  const start = (page - 1) * pageSize
  return { rows: matches.slice(start, start + pageSize), total, page, pages }
}
