import { useDataFetching } from './hooks/useDataFetching'
import './exercise.css'

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function ExerciseApp() {
  const { data, error, loading, updatedAt, refetch, invalidateCache } = useDataFetching<User[]>(USERS_URL, { maxAge: 5 * 60 * 1000 })

  return (
    <main className="cache-app">
      <header className="cache-topbar"><a className="cache-brand" href="#home"><span className="cache-brand-mark">D</span> FIELDNOTES <small>DATA STUDIO</small></a><span className="cache-top-context"><i /> API EXPLORER</span></header>
      <div className="cache-content" id="home">
        <section className="cache-intro">
          <p className="cache-kicker">ADVANCED TYPESCRIPT <span>03 / 03</span></p>
          <h1>Fetch once.<br /><em>Use it well.</em></h1>
          <p>A reusable data hook that tracks loading and errors, caches responses, and gives you control when data needs a refresh.</p>
        </section>
        <section className="feed-panel" aria-labelledby="feed-title">
          <div className="feed-heading"><div><span className="feed-index">EXERCISE 03 / DATA LAYER</span><h2 id="feed-title">Community directory</h2><p>JSONPlaceholder <span>/</span> users</p></div><span className="cache-token">useDataFetching&lt;User[]&gt;</span></div>
          <div className="feed-controls">
            <div className="connection-state" aria-live="polite"><span className={`connection-dot${error ? ' failed' : loading ? ' loading' : ''}`} /><span>{loading ? 'Request in progress' : error ? 'Connection error' : 'Live response'}</span>{updatedAt && !loading && !error && <small>refreshed {new Date(updatedAt).toLocaleTimeString()}</small>}</div>
            <div className="feed-buttons">
              <button type="button" onClick={() => void refetch()} disabled={loading}><span aria-hidden="true">↻</span> Refresh</button>
              <button type="button" onClick={() => void invalidateCache()} disabled={loading}><span aria-hidden="true">⌫</span> Clear cache</button>
            </div>
          </div>
          {loading && <div className="feed-loading" role="status"><span className="feed-spinner" /> Fetching users from JSONPlaceholder…</div>}
          {error && <div className="feed-error" role="alert"><span>{error}</span><button type="button" onClick={() => void refetch()}>Retry request</button></div>}
          {!loading && !error && data && (
            <ul className="user-list">
              {data.map((user, index) => (
                <li className="user-row" key={user.id}>
                  <span className={`user-number number-${index % 4}`}>{String(user.id).padStart(2, '0')}</span>
                  <span className="user-identity"><strong>{user.name}</strong><small>@{user.username} <span>·</span> {user.company.name}</small></span>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                  <span className="user-site">{user.website}</span>
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && !data && <p className="feed-empty">No user data available.</p>}
          <div className="feed-footnote"><span>MAX AGE <strong>05:00</strong></span><span>CACHE KEY <code>request URL</code></span><span>STORAGE <strong>in memory</strong></span></div>
        </section>
        <section className="cache-explainer"><div className="cache-explainer-mark">{ }</div><p><strong>Cache behavior</strong><span>Repeat mounts reuse a fresh response. <b>Refresh</b> bypasses the cache; <b>Clear cache</b> removes the entry before requesting again.</span></p><span className="cache-time">30 MIN</span></section>
        <footer className="cache-footer"><span>FIELDNOTES / DATA STUDIO</span><span>ADVANCED TYPESCRIPT <b>·</b> USING TYPESCRIPT WITH REACT</span></footer>
      </div>
    </main>
  )
}

export default ExerciseApp
