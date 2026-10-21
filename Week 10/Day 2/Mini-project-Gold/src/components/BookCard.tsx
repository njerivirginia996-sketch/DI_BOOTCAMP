import type { CSSProperties } from 'react'
import type { Book } from '../model/Book'
import { useBookLibrary } from '../hooks/useBookLibrary'

type BookCardProps = { book: Book; index: number; searchTerm: string }

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'ig'))
  return parts.map((part, index) => part.toLocaleLowerCase() === query.trim().toLocaleLowerCase()
    ? <mark key={`${part}-${index}`}>{part}</mark>
    : part)
}

export function BookCard({ book, index, searchTerm }: BookCardProps) {
  const { toggleReadStatus, removeBook, setPagesRead } = useBookLibrary()
  const progress = Math.round((book.pagesRead / book.totalPages) * 100)

  return (
    <article className="book-card" style={{ '--card-index': index } as CSSProperties}>
      <div className={`book-cover cover-${index % 5}`} aria-hidden="true">
        <span className="cover-mark">READING ROOM <i>NO. {String(index + 1).padStart(2, '0')}</i></span>
        <span className="cover-rule" />
        <span className="cover-title">{book.title}</span>
        <span className="cover-author">{book.author}</span>
        <span className="cover-seal">{book.category.slice(0, 1).toUpperCase()}</span>
      </div>
      <div className="book-info">
        <div className="book-meta"><span className="category-label">{book.category}</span><span className={`status-label${book.isRead ? ' read' : book.pagesRead > 0 ? ' reading' : ''}`}>{book.isRead ? 'Finished' : book.pagesRead > 0 ? 'In progress' : 'To read'}</span></div>
        <h3>{highlight(book.title, searchTerm)}</h3>
        <p className="book-author">by {highlight(book.author, searchTerm)}</p>
        {book.description && <p className="book-description">{book.description}</p>}
        <div className="progress-heading"><span>READING PROGRESS</span><span>{progress}%</span></div>
        <input aria-label={`Pages read in ${book.title}`} className="progress-slider" max={book.totalPages} min="0" onChange={(event) => setPagesRead(book.id, Number(event.target.value))} style={{ '--progress': `${progress}%` } as CSSProperties} type="range" value={book.pagesRead} />
        <div className="pages-count">{book.pagesRead} <span>of</span> {book.totalPages} pages</div>
        <div className="book-actions">
          <button className={`read-toggle${book.isRead ? ' done' : ''}`} onClick={() => toggleReadStatus(book.id)} type="button"><span aria-hidden="true">{book.isRead ? '✓' : '○'}</span>{book.isRead ? 'Finished' : 'Mark as read'}</button>
          <button aria-label={`Remove ${book.title}`} className="remove-book" onClick={() => removeBook(book.id)} title="Remove book" type="button">×</button>
        </div>
      </div>
    </article>
  )
}