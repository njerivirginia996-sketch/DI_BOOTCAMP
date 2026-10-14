import { useState } from 'react'
import DatePicker from './components/DatePicker.jsx'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import './App.css'

function App() {
  const [editingTask, setEditingTask] = useState(null)

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
          <TaskList onEdit={setEditingTask} />
          <TaskForm
            key={editingTask ? `${editingTask.day}-${editingTask.id}` : 'new-task'}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
            onSaved={() => setEditingTask(null)}
          />
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
