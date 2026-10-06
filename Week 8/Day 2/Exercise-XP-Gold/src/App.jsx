import UserFetchForm from './components/UserFetchForm.jsx'
import PostAxiosForm from './components/PostAxiosForm.jsx'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="React forms home"><span className="brand-mark">R</span><span>FIELD NOTES <b>/ REACT</b></span></a>
        <span className="course-label">WEEK 08 <i /> DAY 02</span>
      </header>

      <section className="page-intro">
        <p className="eyebrow"><span /> EXERCISE XP GOLD / FORM SUBMISSIONS</p>
        <h1>Build a payload.<br /><em>Send it out.</em></h1>
        <p className="intro-side">Two controlled class-component forms. One uses fetch; the other uses Axios.</p>
      </section>

      <div className="forms-grid">
        <UserFetchForm />
        <PostAxiosForm />
      </div>

      <footer className="footer"><span>REACT / CLASS COMPONENTS</span><span>STATE · EVENTS · HTTP</span></footer>
    </main>
  )
}