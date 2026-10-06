import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import ErrorBoundary from './ErrorBoundary.jsx'
import Example1 from './Example1.jsx'
import Example2 from './Example2.jsx'
import Example3 from './Example3.jsx'
import PostList from './PostList.jsx'

function HomeScreen() {
  return (
    <main className="home-screen">
      <section className="page-intro">
        <p className="eyebrow"><span /> EXERCISE XP / DATA RENDERING</p>
        <h1>Small data.<br /><em>Clear patterns.</em></h1>
        <p className="intro-copy">React components reading JSON, mapping nested arrays, and giving every item a stable key.</p>
      </section>

      <section className="lab-section" aria-labelledby="posts-title">
        <div className="section-heading"><span className="section-index">01</span><h2 id="posts-title">Posts from JSON</h2><span className="section-caption">src / data / posts.json</span></div>
        <PostList />
      </section>

      <section className="lab-section" aria-labelledby="profile-data-title">
        <div className="section-heading"><span className="section-index">02</span><h2 id="profile-data-title">Nested profile data</h2><span className="section-caption">array mapping · nested objects</span></div>
        <div className="profile-data-grid">
          <Example1 />
          <Example2 />
          <Example3 />
        </div>
      </section>

      <PostJsonPanel />
    </main>
  )
}

function ProfileScreen() {
  return (
    <main className="simple-screen">
      <p className="eyebrow"><span /> REACT ROUTER / PROFILE</p>
      <h1>ProfileScreen</h1>
      <p>This route is rendered inside its own error boundary.</p>
    </main>
  )
}

function ShopScreen() {
  throw new Error('ShopScreen demo error')
}

function PostJsonPanel() {
  const [endpoint, setEndpoint] = useState('')
  const [status, setStatus] = useState('idle')
  const [responseText, setResponseText] = useState('')

  async function sendPost(event) {
    event.preventDefault()
    setStatus('sending')
    setResponseText('')

    const payload = {
      key1: 'myusername',
      email: 'mymail@gmail.com',
      name: 'Isaac',
      lastname: 'Doe',
      age: 27,
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const text = await response.text()
      const result = text || `HTTP ${response.status} ${response.statusText}`
      console.log('Webhook response:', response.status, result)
      if (!response.ok) throw new Error(result)
      setResponseText(result)
      setStatus('success')
    } catch (error) {
      console.error('Webhook POST failed:', error)
      setResponseText(error instanceof Error ? error.message : 'Request failed')
      setStatus('error')
    }
  }

  return (
    <section className="lab-section post-panel" aria-labelledby="post-json-title">
      <div className="section-heading"><span className="section-index">03</span><h2 id="post-json-title">Send JSON</h2><span className="section-caption">POST / application-json</span></div>
      <form className="webhook-form" onSubmit={sendPost}>
        <label htmlFor="webhook-url">Webhook endpoint</label>
        <div className="webhook-controls">
          <input
            id="webhook-url"
            type="url"
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value)}
            placeholder="https://webhook.site/your-unique-url"
            required
          />
          <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send payload'} <span aria-hidden="true">↗</span></button>
        </div>
        <p className="form-hint">Enable CORS for your unique URL on webhook.site.</p>
      </form>
      {status !== 'idle' && status !== 'sending' && (
        <output className={`request-result ${status}`} aria-live="polite">
          <strong>{status === 'success' ? 'Response received' : 'Request failed'}</strong>
          <span>{responseText}</span>
        </output>
      )}
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="React Lab home"><span className="brand-symbol">R</span><span>FIELD NOTES <b>/ REACT</b></span></a>
          <span className="course-label">WEEK 08 <i /> DAY 02</span>
        </header>

        <nav className="navbar navbar-expand nav-strip" aria-label="Main navigation">
          <span className="nav-label">ROUTES</span>
          <div className="navbar-nav">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" end>Home</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">Profile</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/shop">Shop</NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ErrorBoundary><HomeScreen /></ErrorBoundary>} />
          <Route path="/profile" element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>} />
          <Route path="/shop" element={<ErrorBoundary><ShopScreen /></ErrorBoundary>} />
          <Route path="*" element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>} />
        </Routes>

        <footer className="footer"><span>REACT / WEEK 08</span><span>ROUTING · JSON · ERROR BOUNDARIES</span></footer>
      </div>
    </BrowserRouter>
  )
}