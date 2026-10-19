import UserList from './UserList'
import './App.css'

export default function App() {
  return (
    <main className="exercise-page">
      <header className="exercise-header">
        <p className="exercise-kicker">EXERCISE 5</p>
        <h1>User directory</h1>
        <p>Fetch and display typed user data.</p>
      </header>
      <UserList />
    </main>
  )
}
