import PostList from './components/PostList.jsx'
import UsersList from './components/UsersList.jsx'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="API Field Notes home"><span className="brand-mark">A</span><span>FIELD NOTES <b>/ API</b></span></a>
        <span className="course-label">WEEK 08 <i /> DAY 02</span>
      </header>

      <section className="page-intro">
        <p className="eyebrow"><span /> MINI-PROJECT / FETCH DATA</p>
        <div className="intro-row">
          <h1>Live data,<br /><em>in its element.</em></h1>
          <p>Posts and people from JSONPlaceholder, fetched on mount and rendered from component state.</p>
        </div>
      </section>

      <div className="data-sections">
        <PostList />
        <UsersList />
      </div>

      <footer className="footer"><span>REACT / CLASS COMPONENTS</span><span>FETCH · STATE · JSX</span></footer>
    </main>
  )
}