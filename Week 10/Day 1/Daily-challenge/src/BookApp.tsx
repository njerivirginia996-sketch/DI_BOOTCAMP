import { useState, type FormEvent } from 'react'
import { List } from './components/List'
import './book-app.css'

type Genre = 'Fiction' | 'Essays' | 'History' | 'Science' | 'Poetry'

type Book = {
  id: string
  title: string
  author: string
  genre: Genre
}

const genres: Genre[] = ['Fiction', 'Essays', 'History', 'Science', 'Poetry']

const initialBooks: Book[] = [
  { id: 'book-01', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Fiction' },
  { id: 'book-02', title: 'A Field Guide to Getting Lost', author: 'Rebecca Solnit', genre: 'Essays' },
  { id: 'book-03', title: 'The Dawn of Everything', author: 'David Graeber & David Wengrow', genre: 'History' },
  { id: 'book-04', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', genre: 'Science' },
  { id: 'book-05', title: 'Devotions', author: 'Mary Oliver', genre: 'Poetry' },
]

function BookApp() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState<Genre>('Fiction')
  const [query, setQuery] = useState('')
  const [activeGenre, setActiveGenre] = useState<Genre | 'All'>('All')
  const [formError, setFormError] = useState('')

  const filteredBooks = books.filter((book) => {
    const matchesGenre = activeGenre === 'All' || book.genre === activeGenre
    const searchText = `${book.title} ${book.author} ${book.genre}`.toLowerCase()
    return matchesGenre && searchText.includes(query.trim().toLowerCase())
  })

  function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanAuthor = author.trim()
    if (!cleanTitle || !cleanAuthor) {
      setFormError('Add both a title and an author to continue.')
      return
    }

    const nextBook: Book = { id: crypto.randomUUID(), title: cleanTitle, author: cleanAuthor, genre }
    setBooks((currentBooks) => [nextBook, ...currentBooks])
    setTitle('')
    setAuthor('')
    setGenre('Fiction')
    setFormError('')
    setActiveGenre('All')
    setQuery('')
  }

  function removeBook(id: Book['id']) {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id))
  }

  return (
    <main className="library-app">
      <header className="library-header">
        <a className="library-brand" href="#top" aria-label="Commonplace Library home"><span className="brand-symbol">C</span><span>COMMONPLACE<small>PERSONAL LIBRARY</small></span></a>
        <div className="header-context"><span className="context-dot" /> DAILY CHALLENGE <span className="header-divider">/</span> TYPESCRIPT + REACT</div>
      </header>

      <div className="library-content" id="top">
        <section className="library-intro">
          <div>
            <p className="library-eyebrow">WEEK 10 <span>·</span> DAILY CHALLENGE <span>·</span> 30 MIN</p>
            <h1>A small library<br /><em>of your own.</em></h1>
            <p className="intro-copy">Keep the books you mean to return to. Add a title, find it later, and see a generic React list render every entry with the same type-safe component.</p>
          </div>
          <div className="library-stamp"><span>YOUR</span><strong>{String(books.length).padStart(2, '0')}</strong><span>BOOKS</span></div>
        </section>

        <section className="library-stats" aria-label="Library summary">
          <div><span className="stat-index">01</span><span><small>IN YOUR LIBRARY</small><strong>{books.length} <em>books</em></strong></span></div>
          <div><span className="stat-index stat-warm">02</span><span><small>GENRES COLLECTED</small><strong>{new Set(books.map((book) => book.genre)).size} <em>genres</em></strong></span></div>
          <div><span className="stat-index stat-gold">03</span><span><small>LIST COMPONENT</small><strong><code>List&lt;Book&gt;</code></strong></span></div>
        </section>

        <div className="library-grid">
          <section className="collection-panel" aria-labelledby="collection-heading">
            <div className="collection-heading">
              <div><p className="section-kicker">THE COLLECTION</p><h2 id="collection-heading">Bookshelf <span>{filteredBooks.length}</span></h2></div>
              <label className="book-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book or author" aria-label="Search books and authors" /></label>
            </div>

            <div className="genre-tabs" role="group" aria-label="Filter books by genre">
              {(['All', ...genres] as const).map((item) => (
                <button key={item} className={activeGenre === item ? 'selected' : ''} type="button" aria-pressed={activeGenre === item} onClick={() => setActiveGenre(item)}>{item}</button>
              ))}
            </div>

            <List
              items={filteredBooks}
              keyExtractor={(book) => book.id}
              emptyMessage={books.length ? 'No books match this search.' : 'Your bookshelf is waiting for its first book.'}
              renderItem={(book, index) => (
                <article className="book-row">
                  <div className={`book-cover cover-${index % 5}`} aria-hidden="true"><span>{book.title.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span><i /></div>
                  <div className="book-details"><span className="book-genre">{book.genre}</span><h3>{book.title}</h3><p>{book.author}</p></div>
                  <button className="remove-book" type="button" aria-label={`Remove ${book.title}`} title={`Remove ${book.title}`} onClick={() => removeBook(book.id)}>×</button>
                </article>
              )}
            />
            <div className="collection-footer"><span>Showing {filteredBooks.length} of {books.length} books</span><span>Sorted by recently added</span></div>
          </section>

          <aside className="add-panel">
            <div className="add-panel-heading"><span className="add-mark" aria-hidden="true">+</span><div><p className="section-kicker">MAKE ROOM</p><h2>Add a book</h2></div></div>
            <p className="add-intro">A good book always finds a place.</p>
            <form onSubmit={addBook}>
              <label htmlFor="book-title">Title</label>
              <input id="book-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The book’s title" maxLength={100} />
              <label htmlFor="book-author">Author</label>
              <input id="book-author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Who wrote it?" maxLength={80} />
              <label htmlFor="book-genre">Genre</label>
              <select id="book-genre" value={genre} onChange={(event) => setGenre(event.target.value as Genre)}>
                {genres.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {formError && <p className="add-error" role="alert">{formError}</p>}
              <button className="add-button" type="submit">Add to bookshelf <span aria-hidden="true">↗</span></button>
            </form>
            <div className="generic-note"><span className="generic-note-label">WHY GENERICS?</span><p><code>List&lt;T&gt;</code> knows the item type. This render function gets a fully typed <code>Book</code>, while the list stays reusable for any data.</p></div>
          </aside>
        </div>

        <footer className="library-footer"><span>COMMONPLACE <b>/</b> READING ROOM</span><span>BUILT WITH <code>useState</code> + <code>List&lt;T&gt;</code></span></footer>
      </div>
    </main>
  )
}

export default BookApp
