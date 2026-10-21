import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { BookItem, type Book } from '../model/Book'

export type ReadingFilter = 'all' | 'unread' | 'reading' | 'read'
export type SortField = 'dateAdded' | 'title' | 'author'
export type SortDirection = 'asc' | 'desc'

export interface BooksState {
  items: Book[]
  categories: string[]
  readingFilter: ReadingFilter
  categoryFilter: string
  searchTerm: string
  sortField: SortField
  sortDirection: SortDirection
  readingGoal: number
}

const defaultCategories = ['Fiction', 'Nonfiction', 'Memoir', 'History', 'Science', 'Uncategorized']

function createInitialState(): BooksState {
  const emptyState: BooksState = {
    items: [],
    categories: defaultCategories,
    readingFilter: 'all',
    categoryFilter: 'all',
    searchTerm: '',
    sortField: 'dateAdded',
    sortDirection: 'desc',
    readingGoal: 24,
  }

  try {
    const savedValue = localStorage.getItem('shelf-library')
    if (!savedValue) return emptyState
    const saved: unknown = JSON.parse(savedValue)
    if (typeof saved !== 'object' || saved === null) return emptyState
    const data = saved as Partial<BooksState>
    return {
      ...emptyState,
      items: Array.isArray(data.items) ? data.items.filter(BookItem.isBook) : [],
      categories: Array.isArray(data.categories)
        ? [...new Set([...defaultCategories, ...data.categories.filter((item): item is string => typeof item === 'string')])]
        : defaultCategories,
      readingGoal: typeof data.readingGoal === 'number' && data.readingGoal > 0 ? data.readingGoal : emptyState.readingGoal,
    }
  } catch {
    return emptyState
  }
}

const booksSlice = createSlice({
  name: 'books',
  initialState: createInitialState(),
  reducers: {
    addBook(state, action: PayloadAction<Book>) {
      state.items.unshift(action.payload)
    },
    removeBook(state, action: PayloadAction<string>) {
      state.items = state.items.filter((book) => book.id !== action.payload)
    },
    toggleReadStatus(state, action: PayloadAction<string>) {
      const book = state.items.find((item) => item.id === action.payload)
      if (!book) return
      book.isRead = !book.isRead
      book.pagesRead = book.isRead ? book.totalPages : 0
    },
    setPagesRead(state, action: PayloadAction<{ id: string; pagesRead: number }>) {
      const book = state.items.find((item) => item.id === action.payload.id)
      if (!book) return
      book.pagesRead = Math.max(0, Math.min(book.totalPages, Math.round(action.payload.pagesRead)))
      book.isRead = book.pagesRead === book.totalPages
    },
    setReadingFilter(state, action: PayloadAction<ReadingFilter>) {
      state.readingFilter = action.payload
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.sortField = action.payload
    },
    toggleSortDirection(state) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
    },
    addCategory(state, action: PayloadAction<string>) {
      const category = action.payload.trim()
      if (category && !state.categories.some((item) => item.toLocaleLowerCase() === category.toLocaleLowerCase())) {
        state.categories.push(category)
      }
    },
    removeCategory(state, action: PayloadAction<string>) {
      const category = action.payload
      if (category === 'Uncategorized' || !state.categories.includes(category)) return
      state.items.forEach((book) => {
        if (book.category === category) book.category = 'Uncategorized'
      })
      state.categories = state.categories.filter((item) => item !== category)
      if (state.categoryFilter === category) state.categoryFilter = 'all'
    },
    setReadingGoal(state, action: PayloadAction<number>) {
      if (Number.isFinite(action.payload) && action.payload > 0) state.readingGoal = Math.round(action.payload)
    },
    importLibrary(state, action: PayloadAction<{ items: Book[]; categories: string[]; readingGoal?: number }>) {
      state.items = action.payload.items
      state.categories = [...new Set([...defaultCategories, ...action.payload.categories])]
      if (action.payload.readingGoal && action.payload.readingGoal > 0) state.readingGoal = action.payload.readingGoal
    },
  },
})

export const {
  addBook,
  removeBook,
  toggleReadStatus,
  setPagesRead,
  setReadingFilter,
  setCategoryFilter,
  setSearchTerm,
  setSortField,
  toggleSortDirection,
  addCategory,
  removeCategory,
  setReadingGoal,
  importLibrary,
} = booksSlice.actions

export default booksSlice.reducer