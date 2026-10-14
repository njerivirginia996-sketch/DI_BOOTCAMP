import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Daymark home">
          <span className="wordmark-mark" aria-hidden="true">D</span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A little progress, every day</span>
      </header>

      <section className="todo-panel" id="top" aria-labelledby="page-title">
        <div className="panel-heading">
          <p className="eyebrow">YOUR DAILY LIST</p>
          <h1 id="page-title">Make room<br />for what matters.</h1>
          <p className="intro">Keep the next small step in sight.</p>
        </div>

        <TodoForm />
        <TodoList />
      </section>

      <footer className="page-footer">
        <span>One thing at a time.</span>
        <span className="footer-spark" aria-hidden="true">✳</span>
      </footer>
    </main>
  )
}

export default App
