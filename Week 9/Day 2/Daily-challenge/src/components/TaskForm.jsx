import { useState } from 'react'
import { connect } from 'react-redux'
import { addTask, editTask } from '../redux/actions.js'

// This component is exported through react-redux connect.
// eslint-disable-next-line react-refresh/only-export-components
function TaskForm({ selectedDay, editingTask, onCancelEdit, onSaved, addTask, editTask }) {
  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [time, setTime] = useState(editingTask?.time ?? '09:00')
  const [notes, setNotes] = useState(editingTask?.notes ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()

    if (!cleanTitle) {
      setError('Add a task name before saving.')
      return
    }

    const details = { title: cleanTitle, time, notes: notes.trim() }
    if (editingTask) {
      editTask(editingTask.day, editingTask.id, details)
      onSaved()
    } else {
      addTask(selectedDay, {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        ...details,
        completed: false,
      })
      setTitle('')
      setNotes('')
    }

    setError('')
  }

  function cancelEdit() {
    setTitle('')
    setTime('09:00')
    setNotes('')
    setError('')
    onCancelEdit()
  }

  return (
    <section className="task-form-section" aria-labelledby="form-heading">
      <div className="form-heading-row">
        <div>
          <p className="eyebrow">{editingTask ? 'UPDATE TASK' : 'MAKE A PLAN'}</p>
          <h2 id="form-heading">{editingTask ? 'Edit task' : 'Add to your day'}</h2>
        </div>
        {editingTask && <button className="cancel-edit" type="button" onClick={cancelEdit}>Cancel</button>}
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="task-title">Task</label>
        <input
          id="task-title"
          type="text"
          maxLength={100}
          placeholder="e.g. Prepare project notes"
          value={title}
          onChange={(event) => { setTitle(event.target.value); setError('') }}
          required
        />

        <div className="form-row">
          <div className="time-field">
            <label className="field-label" htmlFor="task-time">Time</label>
            <input id="task-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
          </div>
          <div className="notes-field">
            <label className="field-label" htmlFor="task-notes">Notes <span>(optional)</span></label>
            <input
              id="task-notes"
              type="text"
              maxLength={180}
              placeholder="Add a detail"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="save-task" type="submit">{editingTask ? 'Save changes' : 'Add task'} <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  )
}

const mapStateToProps = (state) => ({ selectedDay: state.selectedDay })

export default connect(mapStateToProps, { addTask, editTask })(TaskForm)