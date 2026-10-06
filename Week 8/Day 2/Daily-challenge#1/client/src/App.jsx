import { Component } from 'react'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      greeting: '',
      value: '',
      responseMessage: '',
      isLoading: true,
      isSubmitting: false,
      errorMsg: '',
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/hello')
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const greeting = await response.text()
      this.setState({ greeting, isLoading: false })
    } catch (error) {
      this.setState({ errorMsg: error.message || 'Unable to reach the Express server.', isLoading: false })
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value, responseMessage: '', errorMsg: '' })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ isSubmitting: true, errorMsg: '', responseMessage: '' })

    try {
      const response = await fetch('/api/world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: this.state.value }),
      })
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const result = await response.json()
      this.setState({ responseMessage: result.message, isSubmitting: false })
    } catch (error) {
      this.setState({ errorMsg: error.message || 'Unable to send your message.', isSubmitting: false })
    }
  }

  render() {
    const { greeting, value, responseMessage, isLoading, isSubmitting, errorMsg } = this.state

    return (
      <main className="page-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Express Echo home"><span className="brand-mark">E</span><span>FIELD NOTES <b>/ EXPRESS</b></span></a>
          <span className="course-label">WEEK 08 <i /> DAY 02</span>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow"><span /> DAILY CHALLENGE / REQUEST + RESPONSE</p>
          <div className="hero-grid">
            <div>
              <p className="server-status"><span className={isLoading || errorMsg ? 'status-dot pending' : 'status-dot'} /> EXPRESS SERVER / {isLoading ? 'CONNECTING' : errorMsg ? 'UNAVAILABLE' : 'ONLINE'}</p>
              <h1 id="page-title">{isLoading ? 'Connecting…' : greeting || 'Server unavailable'}</h1>
            </div>
            <p className="hero-note">One message from the server. One message back from you.</p>
          </div>
        </section>

        <section className="message-section" aria-labelledby="message-title">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div><p className="section-kicker">POST /API/WORLD</p><h2 id="message-title">Send a message</h2></div>
          </div>

          <form onSubmit={this.handleSubmit}>
            <label htmlFor="message-input">Your message</label>
            <div className="form-row">
              <input
                id="message-input"
                type="text"
                value={value}
                onChange={this.handleChange}
                placeholder="Type something to send…"
                autoComplete="off"
                required
              />
              <button type="submit" disabled={isSubmitting || !value.trim()}>
                {isSubmitting ? 'Sending…' : 'Send to server'}<span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>

          {responseMessage && <output className="server-response" aria-live="polite"><span className="response-mark">↳</span>{responseMessage}</output>}
          {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}
        </section>

        <footer className="footer"><span>REACT CLIENT / EXPRESS SERVER</span><span>GET · POST · JSON</span></footer>
      </main>
    )
  }
}