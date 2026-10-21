export interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string
  totalPages: number
  pagesRead: number
  isRead: boolean
  dateAdded: string
}

export type NewBook = Pick<Book, 'title' | 'author' | 'category' | 'description' | 'totalPages' | 'pagesRead'>

export class BookItem implements Book {
  id: string
  title: string
  author: string
  category: string
  description: string
  totalPages: number
  pagesRead: number
  isRead: boolean
  dateAdded: string

  constructor(input: NewBook, id: string = crypto.randomUUID(), dateAdded = new Date().toISOString(), isRead = false) {
    this.id = id
    this.title = input.title.trim()
    this.author = input.author.trim()
    this.category = input.category
    this.description = input.description.trim()
    this.totalPages = input.totalPages
    this.pagesRead = Math.min(Math.max(0, input.pagesRead), input.totalPages)
    this.isRead = isRead || this.pagesRead >= this.totalPages
    this.dateAdded = dateAdded
  }

  get progress(): number {
    return this.totalPages > 0 ? Math.round((this.pagesRead / this.totalPages) * 100) : 0
  }

  serialize(): Book {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      category: this.category,
      description: this.description,
      totalPages: this.totalPages,
      pagesRead: this.pagesRead,
      isRead: this.isRead,
      dateAdded: this.dateAdded,
    }
  }

  static isBook(value: unknown): value is Book {
    if (typeof value !== 'object' || value === null) return false
    const book = value as Partial<Book>
    return typeof book.id === 'string'
      && typeof book.title === 'string'
      && book.title.trim().length > 0
      && typeof book.author === 'string'
      && book.author.trim().length > 0
      && typeof book.category === 'string'
      && typeof book.description === 'string'
      && typeof book.totalPages === 'number'
      && Number.isFinite(book.totalPages)
      && Number.isInteger(book.totalPages)
      && book.totalPages > 0
      && typeof book.pagesRead === 'number'
      && Number.isFinite(book.pagesRead)
      && Number.isInteger(book.pagesRead)
      && book.pagesRead >= 0
      && book.pagesRead <= book.totalPages
      && typeof book.isRead === 'boolean'
      && typeof book.dateAdded === 'string'
  }

  static from(book: Book): BookItem {
    return new BookItem(
      {
        title: book.title,
        author: book.author,
        category: book.category,
        description: book.description,
        totalPages: book.totalPages,
        pagesRead: book.pagesRead,
      },
      book.id,
      book.dateAdded,
      book.isRead,
    )
  }
}