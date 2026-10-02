import Forms from './Components/Forms'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <p className="eyebrow">WEEK 07 / DAY 05 / GOLD</p>
          <h1>React forms</h1>
          <p className="masthead-note">Controlled inputs and component state</p>
        </div>
        <span className="masthead-index" aria-hidden="true">XP / 05</span>
      </header>
      <Forms />
      <footer className="page-footer">EXERCISE XP GOLD <span>REACT / 2026</span></footer>
    </main>
  )
}

export default App
