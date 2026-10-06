import Users from './components/Users.jsx'
import Customers from './components/customers.js'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="React and Express home"><span className="brand-mark">R</span><span>FIELD NOTES <b>/ REACT</b></span></a>
        <span className="course-label">WEEK 08 <i /> DAY 02</span>
      </header>

      <section className="page-intro">
        <p className="eyebrow"><span /> EXERCISE XP NINJA / FETCH DATA</p>
        <div className="intro-row">
          <h1>Two APIs.<br /><em>One client.</em></h1>
          <p>Express serves the data; class components fetch it and keep the results in state.</p>
        </div>
      </section>

      <div className="data-grid">
        <Users />
        <Customers />
      </div>

      <footer className="footer"><span>REACT + EXPRESS</span><span>FETCH · STATE · JSON</span></footer>
    </main>
  )
}