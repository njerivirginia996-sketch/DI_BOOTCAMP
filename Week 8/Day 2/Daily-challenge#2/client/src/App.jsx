import AutoCompletedText from './components/AutoCompletedText.jsx'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Country Finder home"><span className="brand-mark">C</span><span>FIELD NOTES <b>/ PLACES</b></span></a>
        <span className="course-label">WEEK 08 <i /> DAY 02</span>
      </header>

      <section className="hero">
        <p className="eyebrow"><span /> DAILY CHALLENGE / REACT EVENTS</p>
        <div className="hero-grid">
          <h1>Find your<br /><em>place on Earth.</em></h1>
          <p>Search the country index, then choose a suggestion to complete the field.</p>
        </div>
      </section>

      <AutoCompletedText />

      <footer className="footer"><span>REACT / CLASS COMPONENT</span><span>CONTROLLED INPUT · KEYBOARD · SELECTION</span></footer>
    </main>
  )
}