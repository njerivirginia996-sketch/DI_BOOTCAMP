import { useState } from 'react'
import { useSelector } from 'react-redux'
import AddTask from './components/AddTask.jsx'
import DatePicker from './components/DatePicker.jsx'
import EditTask from './components/EditTask.jsx'
import TaskList from './components/TaskList.jsx'
import './App.css'

const EMPTY_TASKS = Object.freeze([])

function App() {
  const selectedDay = useSelector((state) => state.selectedDay)
  const tasksByDay = useSelector((state) => state.tasksByDay)
  const tasks = tasksByDay[selectedDay] ?? EMPTY_TASKS
  const [editingTask, setEditingTask] = useState(null)
  const dateLabel = new Date(`${selectedDay}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="planner-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daybook home">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>daybook</span>
        </a>
        <span className="topbar-caption">A clearer day starts here</span>
      </header>

      <section className="planner" id="top" aria-label="Daily planner">
        <aside className="day-rail">
          <p className="eyebrow">YOUR PLANNER</p>
          <h1>Plan the<br />day ahead.</h1>
          <p className="rail-copy">Choose a date to see what is on your list.</p>
          <DatePicker />
          <div className="rail-note">
            <span className="note-stamp" aria-hidden="true">✳</span>
            <p>Small steps add up.<br />Keep your day in view.</p>
          </div>
        </aside>

        <section className="day-content" aria-label="Tasks for selected day">
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
            <TaskList onEdit={(task, day) => setEditingTask({ ...task, day })} />
          </section>

          {editingTask ? (
            <EditTask
              key={`${editingTask.day}-${editingTask.id}`}
              task={editingTask}
              day={editingTask.day}
              onCancel={() => setEditingTask(null)}
              onSaved={() => setEditingTask(null)}
            />
          ) : <AddTask />}
        </section>
      </section>

      <footer className="page-footer">
        <span>Make space for the important things.</span>
        <span>DAYBOOK <span className="footer-dot" aria-hidden="true">/</span> DAILY PLANNER</span>
      </footer>
    </main>
  )
}

export default App