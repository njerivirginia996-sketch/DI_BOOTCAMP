import { Component } from 'react'

export default class UserFetchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      email: '',
      status: 'idle',
      response: null,
      error: '',
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ status: 'sending', response: null, error: '' })

    const payload = { user: this.state.user, email: this.state.email }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

      const postedData = await response.json()
      console.log('Fetch POST response:', postedData)
      this.setState({ status: 'success', response: postedData })
    } catch (error) {
      console.error('Fetch POST failed:', error)
      this.setState({ status: 'error', error: error.message || 'Unable to submit the form.' })
    }
  }

  render() {
    const { user, email, status, response, error } = this.state

    return (
      <section className="form-section">
        <div className="form-heading">
          <span className="exercise-number">01</span>
          <div><p className="method-label">FETCH API</p><h2>Create a user</h2></div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="field-group">
            <label htmlFor="fetch-user">User</label>
            <input id="fetch-user" name="user" type="text" placeholder="Your name" value={user} onChange={this.handleChange} required />
          </div>
          <div className="field-group">
            <label htmlFor="fetch-email">Email</label>
            <input id="fetch-email" name="email" type="email" placeholder="you@example.com" value={email} onChange={this.handleChange} required />
          </div>
          <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send user'}<span aria-hidden="true">↗</span></button>
        </form>
        <FormResult status={status} response={response} error={error} />
      </section>
    )
  }
}

function FormResult({ status, response, error }) {
  if (status !== 'success' && status !== 'error') return null

  return (
    <output className={`result ${status}`} aria-live="polite">
      <strong>{status === 'success' ? 'User posted' : 'Submission failed'}</strong>
      <span>{status === 'success' ? JSON.stringify(response) : error}</span>
    </output>
  )
}