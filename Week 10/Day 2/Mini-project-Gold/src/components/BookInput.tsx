import { useState, type FormEvent } from 'react'
import type { NewBook } from '../model/Book'

type BookInputProps = {
  categories: string[]
  onSubmit: (book: NewBook) => void
  onCancel: () => void
}

export function BookInput({ categories, onSubmit, onCancel }: BookInputProps) {
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const totalPages = Number(data.get('totalPages'))
    const pagesRead = Number(data.get('pagesRead') || 0)

    if (!Number.isInteger(totalPages) || totalPages < 1) {
      setError('Enter a page count greater than zero.')
      return
    }
    if (!Number.isInteger(pagesRead) || pagesRead < 0 || pagesRead > totalPages) {
      setError(`Pages read must be between 0 and ${totalPages}.`)
      return
    }

    onSubmit({
      title: String(data.get('title')).trim(),
      author: String(data.get('author')).trim(),
      category: String(data.get('category')),
      description: String(data.get('description')).trim(),
      totalPages,
      pagesRead,
    })
    form.reset()
    setError('')
  }

  return (
    <section className="input-panel" aria-labelledby="addBookTitle">
      <div className="input-panel-heading">
        <div><span className="eyebrow">A NEW ADDITION</span><h2 id="addBookTitle">Add a book</h2></div>
        <button aria-label="Close add book form" className="icon-button close-form" onClick={onCancel} type="button">×</button>
      </div>
      <form className="book-form" onSubmit={handleSubmit}>
        <label>Title<input autoComplete="off" maxLength={100} name="title" placeholder="Book title" required /></label>
        <label>Author<input autoComplete="off" maxLength={80} name="author" placeholder="Author name" required /></label>
        <label>Category<select defaultValue={categories[0] ?? 'Uncategorized'} name="category">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Pages<input min="1" name="totalPages" placeholder="e.g. 320" required type="number" /></label>
        <label className="wide-field">Short note<textarea maxLength={240} name="description" placeholder="What made you pick this one up?" rows={2} /></label>
        <label>Pages read<input defaultValue="0" min="0" name="pagesRead" type="number" /></label>
        <p className="form-error" aria-live="polite">{error}</p>
        <div className="form-actions"><button className="button-primary" type="submit">Add to library <span aria-hidden="true">↗</span></button><button className="button-quiet" onClick={onCancel} type="button">Cancel</button></div>
      </form>
    </section>
  )
}