'use client'

import { useId, useState, type ReactNode } from 'react'
import { getTableView, type TableRowValues, type TableSort } from '@/lib/data-table'
import { cn } from '@/lib/utils'

export type DataTableColumn = { label: string; className?: string }
export type DataTableRow = TableRowValues & {
  id: string | number
  cells?: readonly ReactNode[]
}

const PAGE_SIZES = [5, 10, 25, 50]

export function DataTable({
  label,
  columns,
  rows,
  admin = false,
  className,
}: {
  label: string
  columns: readonly DataTableColumn[]
  rows: readonly DataTableRow[]
  admin?: boolean
  className?: string
}) {
  const printAll = !admin
  const id = useId()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<TableSort | null>(null)
  const [requestedPage, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const view = getTableView(rows, { query, sort, page: requestedPage, pageSize })
  const controls = admin ? 'ad-table-controls' : 'flex flex-wrap items-end gap-3 py-3'
  const field = admin ? 'ad-table-filter' : 'grid gap-1 text-sm font-semibold'
  const input = admin ? '' : 'min-h-10 rounded-lg border border-ink-300 bg-white px-3 text-navy'
  const button = admin ? 'ad-btn' : 'min-h-10 rounded-lg border border-ink-300 bg-white px-3 text-sm font-semibold disabled:opacity-40'
  const status = view.total
    ? `${(view.page - 1) * pageSize + 1}–${Math.min(view.page * pageSize, view.total)} dari ${view.total}`
    : '0 baris'

  function renderRows(shown: readonly DataTableRow[]) {
    return shown.map(row => (
      <tr key={row.id} className={admin ? undefined : 'border-b border-ink-200 align-top'}>
        {columns.map((column, index) => {
          const Cell = index === 0 ? 'th' : 'td'
          return (
            <Cell key={column.label} scope={index === 0 ? 'row' : undefined} className={cn(!admin && 'px-3 py-2.5', column.className)}>
              {row.cells?.[index] ?? row.values[index] ?? '—'}
            </Cell>
          )
        })}
      </tr>
    ))
  }

  return (
    <section aria-label={label} className={cn(!admin && 'min-w-0', className)}>
      <div className={cn(controls, 'no-print')}>
        <label htmlFor={`${id}-search`} className={field}>
          Filter
          <input id={`${id}-search`} type="search" className={input} value={query} placeholder="Cari dalam tabel" onChange={event => {
            setQuery(event.target.value)
            setPage(1)
          }} />
        </label>
        <label htmlFor={`${id}-size`} className={field}>
          Baris per halaman
          <select id={`${id}-size`} value={pageSize} className={input} onChange={event => {
            setPageSize(Number(event.target.value))
            setPage(1)
          }}>
            {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>
      <div className={admin ? 'ad-table-wrap' : 'overflow-x-auto print:overflow-visible'} tabIndex={0} role="region" aria-label={`Tabel ${label}`}>
        <table className={admin ? 'ad-matrix' : 'w-full min-w-[24rem] border-collapse text-left text-sm print:min-w-0'}>
          <thead>
            <tr className={admin ? undefined : 'border-b-2 border-navy bg-ink-50'}>
              {columns.map((column, index) => {
                const direction = sort?.column === index ? sort.direction : null
                return (
                  <th key={column.label} scope="col" aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined} className={cn(!admin && 'px-3 py-2', column.className)}>
                    <button type="button" className={cn(admin ? 'ad-table-sort' : 'inline-flex min-h-8 items-center gap-1.5 text-left font-semibold', 'no-print')} onClick={() => {
                      setSort({ column: index, direction: direction === 'asc' ? 'desc' : 'asc' })
                      setPage(1)
                    }}>
                      {column.label} <span aria-hidden="true">{direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}</span>
                    </button>
                    <span className={admin ? 'ad-table-print-heading' : 'hidden print:inline'}>{column.label}</span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className={printAll ? 'no-print' : undefined}>
            {view.rows.length ? renderRows(view.rows) : (
              <tr><td colSpan={columns.length} className={admin ? undefined : 'px-3 py-5'}>{query.trim() ? 'Tidak ada hasil yang cocok.' : 'Belum ada data.'}</td></tr>
            )}
          </tbody>
          {printAll ? <tbody className="hidden print:table-row-group">{renderRows(rows)}</tbody> : null}
        </table>
      </div>
      <div className={cn(admin ? 'ad-table-controls' : 'flex flex-wrap items-center gap-2 py-3 text-sm', 'no-print')}>
        <span role="status" className={admin ? 'ad-note' : 'mr-auto text-ink-600'}>{status}</span>
        <button type="button" className={button} disabled={view.page === 1} onClick={() => setPage(view.page - 1)}>Sebelumnya</button>
        <span aria-label="Halaman saat ini">{view.page} / {view.pages}</span>
        <button type="button" className={button} disabled={view.page === view.pages} onClick={() => setPage(view.page + 1)}>Berikutnya</button>
      </div>
    </section>
  )
}
