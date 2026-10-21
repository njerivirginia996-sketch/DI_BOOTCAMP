import { useState, type FormEvent } from 'react'
import { useBookLibrary } from '../hooks/useBookLibrary'

export function LibrarySidebar() {
  const { books, categories, categoryFilter, readingGoal, setCategory, createCategory, deleteCategory } = useBookLibrary()
  const [categoryDraft, setCategoryDraft] = useState('')
  const [categoryError, setCategoryError] = useState('')

  function handleAddCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = categoryDraft.trim()
    if (!trimmed) return
    if (categories.some((category) => category.toLocaleLowerCase() === trimmed.toLocaleLowerCase())) {
      setCategoryError('That category already exists.')
      return
    }
    createCategory(trimmed)
    setCategoryDraft('')
    setCategoryError('')
  }

  return (
    <aside className="sidebar" aria-label="Library navigation">
      <div className="sidebar-group">
        <span className="sidebar-heading">YOUR SHELVES</span>
        <button className={`side-link${categoryFilter === 'all' ? ' selected' : ''}`} onClick={() => setCategory('all')} type="button"><span className="side-icon">▦</span> All books <span className="side-count">{books.length}</span></button>
      </div>
      <div className="sidebar-group category-group">
        <div className="sidebar-heading-row"><span className="sidebar-heading">CATEGORIES</span><span className="sidebar-heading">{categories.length}</span></div>
        {categories.map((category) => <div className={`category-row${categoryFilter === category ? ' selected' : ''}`} key={category}><button className="category-link" onClick={() => setCategory(category)} type="button"><span className="category-dot" />{category}<span className="side-count">{books.filter((book) => book.category === category).length}</span></button>{!['Fiction', 'Nonfiction', 'Memoir', 'History', 'Science', 'Uncategorized'].includes(category) && <button aria-label={`Delete ${category} category`} className="category-remove" onClick={() => deleteCategory(category)} title={`Delete ${category}`} type="button">×</button>}</div>)}
        <form className="category-form" onSubmit={handleAddCategory}><input aria-label="New category" maxLength={28} onChange={(event) => setCategoryDraft(event.target.value)} placeholder="New category" value={categoryDraft} /><button aria-label="Add category" title="Add category" type="submit">+</button></form>
        {categoryError && <p className="category-error" role="alert">{categoryError}</p>}
      </div>
      <div className="goal-panel"><div className="goal-heading"><span className="sidebar-heading">YEARLY GOAL</span><span aria-hidden="true">✳</span></div><strong>{books.filter((book) => book.isRead).length}<small> / {readingGoal} BOOKS</small></strong><p>Keep turning pages, one book at a time.</p><div className="goal-track"><span style={{ width: `${Math.min(100, (books.filter((book) => book.isRead).length / readingGoal) * 100)}%` }} /></div></div>
      <div className="sidebar-note"><span className="note-rule" />A LITTLE SPACE FOR BIG STORIES.</div>
    </aside>
  )
}