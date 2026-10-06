import { Component } from 'react'
import axios from 'axios'

export default class PostAxiosForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      title: '',
      body: '',
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

    const { userId, title, body } = this.state

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        userId: Number(userId),
        title,
        body,
      })

      console.log('Axios POST response:', response.data)
      this.setState({ status: 'success', response: response.data })
    } catch (error) {
      console.error('Axios POST failed:', error)
      this.setState({ status: 'error', error: error.message || 'Unable to submit the form.' })
    }
  }

  render() {
    const { userId, title, body, status, response, error } = this.state

    return (
      <section className="form-section axios-section">
        <div className="form-heading">
          <span className="exercise-number">02</span>
          <div><p className="method-label">AXIOS</p><h2>Create a post</h2></div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="field-group">
            <label htmlFor="post-user-id">User ID</label>
            <input id="post-user-id" name="userId" type="number" placeholder="1" value={userId} onChange={this.handleChange} min="1" required />
          </div>
          <div className="field-group">
            <label htmlFor="post-title">Title</label>
            <input id="post-title" name="title" type="text" placeholder="Post title" value={title} onChange={this.handleChange} required />
          </div>
          <div className="field-group">
            <label htmlFor="post-body">Body</label>
            <textarea id="post-body" name="body" placeholder="Write the post content…" value={body} onChange={this.handleChange} rows="4" required />
          </div>
          <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send post'}<span aria-hidden="true">↗</span></button>
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
      <strong>{status === 'success' ? 'Post created' : 'Submission failed'}</strong>
      <span>{status === 'success' ? JSON.stringify(response) : error}</span>
    </output>
  )
}