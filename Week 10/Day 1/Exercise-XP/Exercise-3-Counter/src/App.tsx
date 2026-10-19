import Counter from './Counter'
import './App.css'

export default function App() {
  return (
    <main className="exercise-page">
      <header className="exercise-header">
        <p className="exercise-kicker">EXERCISE 3</p>
        <h1>Counter</h1>
        <p>Manage a number with typed React state.</p>
      </header>
      <Counter />
    </main>
  )
}
