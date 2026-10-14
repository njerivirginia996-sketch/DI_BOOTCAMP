import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask } from '../redux/plannerSlice.js'

function createTaskId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function AddTask() {
  const selectedDay = useSelector((state) => state.selectedDay)
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) {
      setError('Add a task name before saving.')
      return
    }

    dispatch(addTask({
      day: selectedDay,
      task: {
        id: createTaskId(),
        title: cleanTitle,
        time,
        notes: notes.trim(),
        completed: false,
      },
    }))
    setTitle('')
    setTime('09:00')
    setNotes('')
    setError('')
  }

  return (
    <section className="task-form-section" aria-labelledby="add-heading">
      <div className="form-heading-row">
        <div>
          <p className="eyebrow">MAKE A PLAN</p>
          <h2 id="add-heading">Add to your day</h2>
        </div>
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="new-task-title">Task</label>
        <input
          id="new-task-title"
          type="text"
          maxLength={100}
          placeholder="e.g. Prepare project notes"
          value={title}
          onChange={(event) => { setTitle(event.target.value); setError('') }}
          aria-describedby={error ? 'add-task-error' : undefined}
        />
        <div className="form-row">
          <div>
            <label className="field-label" htmlFor="new-task-time">Time</label>
            <input id="new-task-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="new-task-notes">Notes <span>(optional)</span></label>
            <input
              id="new-task-notes"
              type="text"
              maxLength={180}
              placeholder="Add a detail"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
        {error && <p className="form-error" id="add-task-error" role="alert">{error}</p>}
        <button className="save-task" type="submit">Add task <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  )
}

export default AddTask