import { BookItem, type Book, type NewBook } from '../model/Book'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  addBook as addBookAction,
  addCategory as addCategoryAction,
  removeBook as removeBookAction,
  removeCategory as removeCategoryAction,
  setCategoryFilter,
  setPagesRead as setPagesReadAction,
  setReadingFilter,
  setReadingGoal as setReadingGoalAction,
  setSearchTerm,
  setSortField,
  toggleReadStatus as toggleReadStatusAction,
  toggleSortDirection,
  type ReadingFilter,
  type SortField,
} from '../app/booksSlice'

export function useBookLibrary() {
  const dispatch = useAppDispatch()
  const library = useAppSelector((state) => state.books)
  const query = library.searchTerm.trim().toLocaleLowerCase()

  const visibleBooks = library.items
    .filter((book) => {
      const matchesStatus = library.readingFilter === 'all'
        || (library.readingFilter === 'read' && book.isRead)
        || (library.readingFilter === 'unread' && !book.isRead && book.pagesRead === 0)
        || (library.readingFilter === 'reading' && !book.isRead && book.pagesRead > 0)
      const matchesCategory = library.categoryFilter === 'all' || book.category === library.categoryFilter
      const searchableText = `${book.title} ${book.author} ${book.category} ${book.description}`.toLocaleLowerCase()
      return matchesStatus && matchesCategory && searchableText.includes(query)
    })
    .sort((left, right) => {
      const comparison = library.sortField === 'dateAdded'
        ? left.dateAdded.localeCompare(right.dateAdded)
        : left[library.sortField].localeCompare(right[library.sortField], undefined, { sensitivity: 'base' })
      return library.sortDirection === 'asc' ? comparison : -comparison
    })

  const finishedCount = library.items.filter((book) => book.isRead).length
  const pagesRead = library.items.reduce((total, book) => total + book.pagesRead, 0)

  function addBook(input: NewBook): Book {
    const book = new BookItem(input).serialize()
    dispatch(addBookAction(book))
    return book
  }

  function removeBook(id: string): void {
    dispatch(removeBookAction(id))
  }

  function toggleReadStatus(id: string): void {
    dispatch(toggleReadStatusAction(id))
  }

  function setPagesRead(id: string, pages: number): void {
    dispatch(setPagesReadAction({ id, pagesRead: pages }))
  }

  function setStatusFilter(filter: ReadingFilter): void {
    dispatch(setReadingFilter(filter))
  }

  function setCategory(category: string): void {
    dispatch(setCategoryFilter(category))
  }

  function createCategory(category: string): void {
    dispatch(addCategoryAction(category))
  }

  function deleteCategory(category: string): void {
    dispatch(removeCategoryAction(category))
  }

  function setGoal(goal: number): void {
    dispatch(setReadingGoalAction(goal))
  }

  function setSorting(field: SortField): void {
    dispatch(setSortField(field))
  }

  return {
    books: library.items,
    visibleBooks,
    categories: library.categories,
    readingFilter: library.readingFilter,
    categoryFilter: library.categoryFilter,
    searchTerm: library.searchTerm,
    sortField: library.sortField,
    sortDirection: library.sortDirection,
    readingGoal: library.readingGoal,
    finishedCount,
    pagesRead,
    addBook,
    removeBook,
    toggleReadStatus,
    setPagesRead,
    setStatusFilter,
    setCategory,
    createCategory,
    deleteCategory,
    setGoal,
    setSorting,
    changeSortDirection: () => dispatch(toggleSortDirection()),
    changeSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
  }
}