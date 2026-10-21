import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Provider } from 'react-redux'
import { addBook as addBookAction, importLibrary, setReadingGoal } from './app/booksSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { store } from './app/store'
import { BookItem, type Book } from './model/Book'
import { BookInput } from './components/BookInput'
import { BookList } from './components/BookList'
import { BookToolbar } from './components/BookToolbar'
import { LibrarySidebar } from './components/LibrarySidebar'
import './library.css'

function LibraryWorkspace() {
  const dispatch = useAppDispatch()
  const booksState = useAppSelector((state) => state.books)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [notice, setNotice] = useState('')
  const importInput = useRef<HTMLInputElement>(null)
  const finishedCount = booksState.items.filter((book) => book.isRead).length
  const inProgressCount = booksState.items.filter((book) => !book.isRead && book.pagesRead > 0).length
  const goalPercent = Math.min(100, Math.round((finishedCount / booksState.readingGoal) * 100))

  useEffect(() => {
    try {
      localStorage.setItem('shelf-library', JSON.stringify({
        items: booksState.items,
        categories: booksState.categories,
        readingGoal: booksState.readingGoal,
      }))
    } catch (error) {
      console.error('Could not save library changes in this browser.', error)
    }
  }, [booksState.items, booksState.categories, booksState.readingGoal])

  function exportLibrary() {
    const library = { version: 1, items: booksState.items, categories: booksState.categories, readingGoal: booksState.readingGoal }
    const file = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'my-reading-library.json'
    link.click()
    URL.revokeObjectURL(url)
    setNotice('Library exported as JSON.')
  }

  async function importLibraryFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (typeof parsed !== 'object' || parsed === null || !('items' in parsed) || !Array.isArray(parsed.items)) {
        throw new Error('The file does not contain a library.')
      }
      const items: Book[] = parsed.items.filter(BookItem.isBook)
      const categories = 'categories' in parsed && Array.isArray(parsed.categories)
        ? parsed.categories.filter((category): category is string => typeof category === 'string')
        : []
      if (items.length === 0 && parsed.items.length > 0) throw new Error('No valid book records were found.')
      const readingGoal = 'readingGoal' in parsed && typeof parsed.readingGoal === 'number' && Number.isFinite(parsed.readingGoal) ? parsed.readingGoal : undefined
      dispatch(importLibrary({ items, categories, readingGoal }))
      setNotice(`${items.length} ${items.length === 1 ? 'book' : 'books'} imported.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not import this file.')
    } finally {
      input.value = ''
    }
  }

  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="#library" aria-label="Open Shelf library">
          <span className="brand-symbol" aria-hidden="true">OS</span>
          <span>OPEN SHELF<small>PERSONAL LIBRARY</small></span>
        </a>
        <div className="header-actions">
          <button className="header-link" onClick={exportLibrary} type="button"><span aria-hidden="true">↓</span> Export</button>
          <button className="header-link import-link" onClick={() => importInput.current?.click()} type="button"><span aria-hidden="true">↑</span> Import</button>
          <input accept="application/json,.json" className="file-input-hidden" onChange={importLibraryFile} ref={importInput} type="file" />
          <button className="button-primary add-top" onClick={() => setIsAddingBook((open) => !open)} type="button"><span aria-hidden="true">+</span> Add a book</button>
        </div>
      </header>

      <div className="main-layout" id="library">
        <LibrarySidebar />
        <main className="library-main">
          <section className="welcome-strip">
            <div className="welcome-copy"><p className="eyebrow">YOUR READING ROOM</p><h1>A shelf of your own.</h1><p>Keep your next great read close.</p></div>
            <img alt="Books stacked on a library shelf" className="welcome-image" src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85" />
            <div className="welcome-image-caption">A PLACE FOR EVERY STORY</div>
          </section>

          <section className="stats-row" aria-label="Reading statistics">
            <div className="stat-item"><span className="stat-label">IN YOUR LIBRARY</span><strong>{booksState.items.length}<small> books</small></strong></div>
            <div className="stat-item"><span className="stat-label">IN PROGRESS</span><strong>{inProgressCount}<small> books</small></strong></div>
            <div className="stat-item"><span className="stat-label">BOOKS FINISHED</span><strong>{finishedCount}<small> / {booksState.readingGoal}</small></strong></div>
            <div className="goal-summary"><div className="goal-summary-top"><span>READING GOAL</span><span>{goalPercent}%</span></div><div className="goal-bar"><span style={{ width: `${goalPercent}%` }} /></div><label>Yearly target <input aria-label="Yearly reading goal" min="1" max="200" onChange={(event) => dispatch(setReadingGoal(Number(event.target.value)))} type="number" value={booksState.readingGoal} /></label></div>
          </section>

          {isAddingBook && <BookInput categories={booksState.categories} onCancel={() => setIsAddingBook(false)} onSubmit={(book) => { dispatch(addBookAction(new BookItem(book).serialize())); setIsAddingBook(false); setNotice('Book added to your library.') }} />}
          {notice && <div className="notice" role="status"><span>{notice}</span><button aria-label="Dismiss notice" onClick={() => setNotice('')} type="button">×</button></div>}

          <div className="library-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Your books</h2></div><span className="collection-total">{String(booksState.items.length).padStart(2, '0')} TITLES</span></div>
          <BookToolbar />
          <BookList />
          <footer className="main-footer"><span>OPEN SHELF <i>·</i> YOUR BOOKS, YOUR PACE</span><span>READ A LITTLE. READ OFTEN.</span></footer>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <Provider store={store}><LibraryWorkspace /></Provider>
}