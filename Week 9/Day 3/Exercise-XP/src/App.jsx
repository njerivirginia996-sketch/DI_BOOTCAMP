import { useSelector } from 'react-redux'
import AddTodo from './components/AddTodo.jsx'
import TodoList from './components/TodoList.jsx'
import './App.css'

function App() {
  const todos = useSelector((state) => state.todos)
  const remaining = todos.filter((todo) => !todo.completed).length
  const completed = todos.length - remaining

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Daymark home">
          <span className="wordmark-mark" aria-hidden="true">D</span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A little progress, every day</span>
      </header>

      <section className="todo-board" id="top" aria-labelledby="page-title">
        <div className="board-heading">
          <div>
            <p className="eyebrow">YOUR TASKS</p>
            <h1 id="page-title">Keep it moving.</h1>
          </div>
          <div className="task-count" aria-live="polite">
            <strong>{remaining}</strong>
            <span>{remaining === 1 ? 'task left' : 'tasks left'}</span>
          </div>
        </div>

        <AddTodo />
        <div className="list-heading">
          <h2>All tasks</h2>
          <span>{completed} completed</span>
        </div>
        <TodoList />
      </section>

      <footer className="page-footer">
        <span>One thing at a time.</span>
        <span>DAYMARK <span className="footer-slash" aria-hidden="true">/</span> TODO LIST</span>
      </footer>
    </main>
  )
}

export default App