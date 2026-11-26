import { describe, expect, it } from 'vitest'
import { getTableView } from '../data-table'

const rows = [
  { id: 'a', values: ['Mata kuliah 10', 4] },
  { id: 'b', values: ['Mata kuliah 2', 2] },
  { id: 'c', values: ['Proyek', 12] },
  { id: 'd', values: ['Mata kuliah 3', 3] },
]

describe('data table view', () => {
  it('sorts and filters the entire dataset before slicing the page', () => {
    const result = getTableView(rows, { query: 'KULIAH', sort: { column: 0, direction: 'asc' }, page: 2, pageSize: 2 })
    expect(result.rows.map(row => row.id)).toEqual(['a'])
    expect(result.total).toBe(3)
    expect(result.page).toBe(2)
  })

  it('clamps a stale page and sorts numeric values numerically', () => {
    const result = getTableView(rows, { query: '', sort: { column: 1, direction: 'desc' }, page: 9, pageSize: 3 })
    expect(result.pages).toBe(2)
    expect(result.rows.map(row => row.id)).toEqual(['b'])
    expect(rows[0].id).toBe('a')
  })

  it('reports an empty result on page one', () => {
    expect(getTableView(rows, { query: 'tidak ditemukan', sort: null, page: 4, pageSize: 5 }))
      .toEqual({ rows: [], total: 0, page: 1, pages: 1 })
  })

  it('sorts formatted Indonesian currency by its numeric amount', () => {
    const fees = [
      { values: ['Rp1.000.000'], sortValues: { 0: 1_000_000 } },
      { values: ['Rp950.000'], sortValues: { 0: 950_000 } },
    ]
    const result = getTableView(fees, { query: 'Rp', sort: { column: 0, direction: 'asc' }, page: 1, pageSize: 10 })
    expect(result.rows).toEqual([fees[1], fees[0]])
  })
})
