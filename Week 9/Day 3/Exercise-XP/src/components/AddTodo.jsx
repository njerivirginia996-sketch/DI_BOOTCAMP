import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../redux/todoSlice.js'

function createTodoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function AddTodo() {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const cleanText = text.trim()

    if (!cleanText) {
      setError('Enter a task before adding it.')
      return
    }

    dispatch(addTodo({ id: createTodoId(), text: cleanText }))
    setText('')
    setError('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">New task</label>
      <input
        id="new-todo"
        type="text"
        maxLength={120}
        placeholder="What needs doing?"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          setError('')
        }}
        aria-describedby={error ? 'todo-error' : undefined}
      />
      <button type="submit"><span aria-hidden="true">+</span> Add task</button>
      {error && <p className="form-error" id="todo-error" role="alert">{error}</p>}
    </form>
  )
}

export default AddTodo