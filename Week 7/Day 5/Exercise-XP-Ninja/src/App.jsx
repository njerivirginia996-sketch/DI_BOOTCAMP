import Clock from './Components/Clock'
import Form from './Components/Form'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <header className="masthead">
        <div>
          <p className="eyebrow">WEEK 07 / DAY 05 / NINJA</p>
          <h1>React in real time</h1>
          <p className="masthead-note">Lifecycle, state, and form validation</p>
        </div>
        <span className="masthead-mark" aria-hidden="true">XP / 07</span>
      </header>

      <div className="exercise-grid">
        <section className="exercise clock-exercise" aria-labelledby="clock-title">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <p className="section-kicker">LIFECYCLE</p>
              <h2 id="clock-title">Local time</h2>
            </div>
          </div>
          <Clock />
        </section>

        <section className="exercise form-exercise" aria-labelledby="form-title">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <p className="section-kicker">CONTROLLED INPUTS</p>
              <h2 id="form-title">Contact details</h2>
            </div>
          </div>
          <Form />
        </section>
      </div>

      <footer className="page-footer">EXERCISE XP NINJA <span>REACT / 2026</span></footer>
    </main>
  )
}

export default App
