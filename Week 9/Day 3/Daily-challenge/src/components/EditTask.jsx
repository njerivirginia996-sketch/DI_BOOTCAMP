import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editTask } from '../redux/plannerSlice.js'

function EditTask({ task, day, onCancel, onSaved }) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(task.title)
  const [time, setTime] = useState(task.time)
  const [notes, setNotes] = useState(task.notes ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('A task name is required.')
      return
    }

    dispatch(editTask({ day, id: task.id, updates: { title, time, notes } }))
    onSaved()
  }

  return (
    <section className="task-form-section edit-form-section" aria-labelledby="edit-heading">
      <div className="form-heading-row">
        <div>
          <p className="eyebrow">UPDATE TASK</p>
          <h2 id="edit-heading">Edit task</h2>
        </div>
        <button className="cancel-edit" type="button" onClick={onCancel}>Cancel</button>
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="edit-task-title">Task</label>
        <input
          id="edit-task-title"
          type="text"
          maxLength={100}
          value={title}
          onChange={(event) => { setTitle(event.target.value); setError('') }}
          aria-describedby={error ? 'edit-task-error' : undefined}
        />
        <div className="form-row">
          <div>
            <label className="field-label" htmlFor="edit-task-time">Time</label>
            <input id="edit-task-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="edit-task-notes">Notes <span>(optional)</span></label>
            <input
              id="edit-task-notes"
              type="text"
              maxLength={180}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
        {error && <p className="form-error" id="edit-task-error" role="alert">{error}</p>}
        <button className="save-task" type="submit">Save changes <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  )
}

export default EditTask