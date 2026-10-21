import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSearchTerm } from '../app/booksSlice'
import { useBookLibrary } from '../hooks/useBookLibrary'

const filters = [
  { value: 'all', label: 'All books' },
  { value: 'unread', label: 'To read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Finished' },
] as const

export function BookToolbar() {
  const dispatch = useAppDispatch()
  const { books, readingFilter, sortField, sortDirection, setStatusFilter, setSorting, changeSortDirection } = useBookLibrary()
  const savedSearch = useAppSelector((state) => state.books.searchTerm)
  const [searchDraft, setSearchDraft] = useState(savedSearch)

  useEffect(() => {
    const timeout = window.setTimeout(() => dispatch(setSearchTerm(searchDraft)), 220)
    return () => window.clearTimeout(timeout)
  }, [dispatch, searchDraft])

  return (
    <section className="toolbar" aria-label="Filter and sort library">
      <div className="filter-tabs" role="group" aria-label="Reading status">
        {filters.map((filter) => {
          const count = filter.value === 'all' ? books.length : books.filter((book) => {
            if (filter.value === 'read') return book.isRead
            if (filter.value === 'reading') return !book.isRead && book.pagesRead > 0
            return !book.isRead && book.pagesRead === 0
          }).length
          return <button aria-pressed={readingFilter === filter.value} className={`filter-tab${readingFilter === filter.value ? ' active' : ''}`} key={filter.value} onClick={() => setStatusFilter(filter.value)} type="button">{filter.label}<span>{count}</span></button>
        })}
      </div>
      <div className="toolbar-controls">
        <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search by book title or author" onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search title or author" type="search" value={searchDraft} /></label>
        <label className="sort-select"><span className="sr-only">Sort books by</span><select onChange={(event) => setSorting(event.target.value as 'dateAdded' | 'title' | 'author')} value={sortField}><option value="dateAdded">Recently added</option><option value="title">Title</option><option value="author">Author</option></select></label>
        <button aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`} className="sort-direction" onClick={changeSortDirection} title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`} type="button">{sortDirection === 'asc' ? '↑' : '↓'}</button>
      </div>
    </section>
  )
}