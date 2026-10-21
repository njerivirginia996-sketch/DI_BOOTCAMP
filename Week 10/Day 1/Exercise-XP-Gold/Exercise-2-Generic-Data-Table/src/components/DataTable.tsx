import { useState, type ReactNode } from 'react'

export type Identifiable = { id: number | string }
export type SortDirection = 'asc' | 'desc'
export type SortState<T> = { key: keyof T; direction: SortDirection }

export type TableColumn<T> = {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

type DataTableProps<T extends Identifiable> = {
  data: T[]
  columns: TableColumn<T>[]
  onSort?: (sort: SortState<T>) => void
  onSelect?: (selected: T[]) => void
}

function compareValues(left: unknown, right: unknown) {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' })
}

export function DataTable<T extends Identifiable>({ data, columns, onSort, onSelect }: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState<T> | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<T['id']>>(() => new Set())
  const sortedData = sort
    ? [...data].sort((left, right) => compareValues(left[sort.key], right[sort.key]) * (sort.direction === 'asc' ? 1 : -1))
    : data
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(row.id))

  function changeSort(key: keyof T) {
    const nextSort: SortState<T> = {
      key,
      direction: sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
    }
    setSort(nextSort)
    onSort?.(nextSort)
  }

  function updateSelection(nextIds: Set<T['id']>) {
    setSelectedIds(nextIds)
    onSelect?.(data.filter((row) => nextIds.has(row.id)))
  }

  function toggleRow(id: T['id']) {
    const nextIds = new Set(selectedIds)
    if (nextIds.has(id)) nextIds.delete(id)
    else nextIds.add(id)
    updateSelection(nextIds)
  }

  function toggleAll() {
    const nextIds = new Set(selectedIds)
    if (allSelected) data.forEach((row) => nextIds.delete(row.id))
    else data.forEach((row) => nextIds.add(row.id))
    updateSelection(nextIds)
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th className="select-column"><input type="checkbox" aria-label="Select all visible rows" checked={allSelected} onChange={toggleAll} /></th>
            {columns.map((column) => (
              <th key={String(column.key)} aria-sort={sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                {column.sortable
                  ? <button className="sort-button" type="button" onClick={() => changeSort(column.key)}>{column.title}<span aria-hidden="true">{sort?.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span></button>
                  : column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id} className={selectedIds.has(row.id) ? 'is-selected' : undefined}>
              <td className="select-column"><input type="checkbox" aria-label={`Select row ${String(row.id)}`} checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} /></td>
              {columns.map((column) => <td key={String(column.key)}>{column.render ? column.render(row) : String(row[column.key] ?? '')}</td>)}
            </tr>
          ))}
          {data.length === 0 && <tr><td className="empty-cell" colSpan={columns.length + 1}>No matching records.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
