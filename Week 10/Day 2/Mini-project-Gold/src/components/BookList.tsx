import { useBookLibrary } from '../hooks/useBookLibrary'
import { useAppSelector } from '../app/hooks'
import { BookCard } from './BookCard'

export function BookList() {
  const { visibleBooks } = useBookLibrary()
  const searchTerm = useAppSelector((state) => state.books.searchTerm)

  if (visibleBooks.length === 0) {
    return <div className="empty-state"><div className="empty-art" aria-hidden="true"><span>✳</span><span>BOOKS<br />TO COME</span></div><div><p className="eyebrow">NOTHING ON THIS SHELF</p><h3>{searchTerm ? 'No books match that search.' : 'Every great library starts somewhere.'}</h3><p>{searchTerm ? 'Try another title or author.' : 'Add a book to start your reading list.'}</p></div></div>
  }

  return <div className="book-grid">{visibleBooks.map((book, index) => <BookCard book={book} index={index} key={book.id} searchTerm={searchTerm} />)}</div>
}