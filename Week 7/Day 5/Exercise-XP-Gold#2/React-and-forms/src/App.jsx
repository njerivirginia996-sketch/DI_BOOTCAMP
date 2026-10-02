import BookForm from './Components/BookForm'
import ContactForm from './Components/ContactForm'
import './Exercises.css'

function App() {
  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <p className="eyebrow">WEEK 07 / DAY 05 / GOLD #2</p>
          <h1>React forms</h1>
          <p className="masthead-note">State, events, and submitted data</p>
        </div>
        <span className="masthead-index" aria-hidden="true">XP / 06</span>
      </header>
      <div className="exercise-list">
        <section className="exercise-section" aria-labelledby="book-heading">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <p className="section-kicker">OBJECT STATE</p>
              <h2 id="book-heading">Add a book</h2>
            </div>
          </div>
          <BookForm />
        </section>
        <section className="exercise-section" aria-labelledby="contact-title">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <p className="section-kicker">VALIDATION + RESET</p>
              <h2 id="contact-title">Contact details</h2>
            </div>
          </div>
          <ContactForm />
        </section>
      </div>
      <footer className="page-footer">EXERCISE XP GOLD <span>REACT / 2026</span></footer>
    </main>
  )
}

export default App
