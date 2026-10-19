import Greeting from './Greeting'
import './App.css'

function App() {
  return (
    <main className="greeting-page">
      <Greeting name="Alex" messageCount={3} />
    </main>
  )
}

export default App
