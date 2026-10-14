import { connect } from 'react-redux'
import { deleteTask, toggleTask } from '../redux/actions.js'

// This component is exported through react-redux connect.
// eslint-disable-next-line react-refresh/only-export-components
function TaskList({ selectedDay, tasks, onEdit, deleteTask, toggleTask }) {
  const dateLabel = new Date(`${selectedDay}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const completedCount = tasks.filter((task) => task.completed).length
  const sortedTasks = [...tasks].sort((left, right) => left.time.localeCompare(right.time))

  return (
    <section className="task-list-section" aria-labelledby="day-heading">
      <div className="day-heading-row">
        <div>
          <p className="eyebrow">YOUR SCHEDULE</p>
          <h2 id="day-heading">{dateLabel}</h2>
        </div>
        <p className="task-summary">
          <strong>{tasks.length}</strong> {tasks.length === 1 ? 'task' : 'tasks'}
          {tasks.length > 0 && <span> · {completedCount} done</span>}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">◷</span>
          <p>Nothing planned yet.</p>
          <span>Add your first task below to shape the day.</span>
        </div>
      ) : (
        <ol className="task-list">
          {sortedTasks.map((task, index) => (
            <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
              <time className="task-time" dateTime={task.time}>{task.time}</time>
              <button
                className="task-toggle"
                type="button"
                onClick={() => toggleTask(selectedDay, task.id)}
                aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                aria-pressed={task.completed}
              >
                {task.completed && <span aria-hidden="true">✓</span>}
              </button>
              <div className="task-copy">
                <span className="task-title">{task.title}</span>
                {task.notes && <span className="task-notes">{task.notes}</span>}
              </div>
              <div className="task-actions">
                <button type="button" onClick={() => onEdit({ ...task, day: selectedDay })} aria-label={`Edit ${task.title}`} title="Edit task">Edit</button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(selectedDay, task.id)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <span className="task-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

const mapStateToProps = (state) => ({
  selectedDay: state.selectedDay,
  tasks: state.tasksByDay[state.selectedDay] ?? [],
})

export default connect(mapStateToProps, { deleteTask, toggleTask })(TaskList)