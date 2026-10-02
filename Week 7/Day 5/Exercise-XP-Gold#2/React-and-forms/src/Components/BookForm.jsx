import { useState } from 'react'

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  year: '',
}

function BookForm() {
  const [book, setBook] = useState(emptyBook)
  const [submittedBook, setSubmittedBook] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setBook((currentBook) => ({ ...currentBook, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const bookData = { ...book, year: Number(book.year) }
    setSubmittedBook(bookData)
    console.log(bookData)
  }

  return (
    <div className="exercise-content">
      <form className="exercise-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="book-title">
          Title
          <input className="field-control" id="book-title" name="title" value={book.title} onChange={handleChange} required />
        </label>
        <label className="field-label" htmlFor="book-author">
          Author
          <input className="field-control" id="book-author" name="author" value={book.author} onChange={handleChange} required />
        </label>
        <label className="field-label" htmlFor="book-genre">
          Genre
          <input className="field-control" id="book-genre" name="genre" value={book.genre} onChange={handleChange} required />
        </label>
        <label className="field-label" htmlFor="book-year">
          Publication year
          <input className="field-control" id="book-year" name="year" type="number" min="0" step="1" value={book.year} onChange={handleChange} required />
        </label>
        <button className="action-button" type="submit">Add book</button>
      </form>

      {submittedBook && (
        <div className="submission-result" aria-live="polite">
          <p className="success-message">Book added successfully.</p>
          <div className="book-summary">
            <h3 className="summary-title">{submittedBook.title}</h3>
            <p><strong>Author:</strong> {submittedBook.author}</p>
            <p><strong>Genre:</strong> {submittedBook.genre}</p>
            <p><strong>Year:</strong> {submittedBook.year}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookForm