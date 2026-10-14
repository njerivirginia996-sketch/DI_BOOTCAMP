import { useDispatch, useSelector } from 'react-redux'
import { toggleTask } from '../redux/plannerSlice.js'
import DeleteTask from './DeleteTask.jsx'

const EMPTY_TASKS = Object.freeze([])

function TaskList({ onEdit }) {
  const selectedDay = useSelector((state) => state.selectedDay)
  const tasksByDay = useSelector((state) => state.tasksByDay)
  const tasks = tasksByDay[selectedDay] ?? EMPTY_TASKS
  const dispatch = useDispatch()
  const sortedTasks = [...tasks].sort((left, right) => left.time.localeCompare(right.time))

  if (sortedTasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">◷</span>
        <p>Nothing planned yet.</p>
        <span>Add your first task below to shape the day.</span>
      </div>
    )
  }

  return (
    <ol className="task-list" aria-label="Tasks for selected day">
      {sortedTasks.map((task, index) => (
        <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
          <time className="task-time" dateTime={task.time}>{task.time}</time>
          <button
            className="task-toggle"
            type="button"
            onClick={() => dispatch(toggleTask({ day: selectedDay, id: task.id }))}
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
            <button className="edit-button" type="button" onClick={() => onEdit(task, selectedDay)} aria-label={`Edit ${task.title}`}>Edit</button>
            <DeleteTask day={selectedDay} task={task} />
          </div>
          <span className="task-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </li>
      ))}
    </ol>
  )
}

export default TaskList