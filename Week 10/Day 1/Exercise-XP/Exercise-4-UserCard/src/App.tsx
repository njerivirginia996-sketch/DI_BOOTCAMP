import UserCard from './UserCard'
import './App.css'

export default function App() {
  return (
    <main className="exercise-page">
      <header className="exercise-header">
        <p className="exercise-kicker">EXERCISE 4</p>
        <h1>User card</h1>
        <p>Optional props with useful defaults.</p>
      </header>
      <section className="user-card-grid" aria-label="User card examples">
        <UserCard name="Maya Chen" age={28} role="Product designer" />
        <UserCard name="Jordan Lee" role="Software engineer" />
        <UserCard />
      </section>
    </main>
  )
}
