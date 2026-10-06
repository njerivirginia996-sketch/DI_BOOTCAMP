import { Component } from 'react'

export default class Users extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [], loading: true, error: '' }
  }

  async componentDidMount() {
    try {
      const response = await fetch('/users')
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const users = await response.json()
      this.setState({ users, loading: false })
    } catch (error) {
      this.setState({ error: error.message || 'Unable to load users.', loading: false })
    }
  }

  render() {
    const { users, loading, error } = this.state

    return (
      <section className="data-panel" aria-labelledby="users-title">
        <div className="panel-heading">
          <span className="panel-index">01</span>
          <div><p className="endpoint-label">GET /users</p><h2 id="users-title">Users</h2></div>
        </div>
        <ul className="record-list">
          {loading && <li className="panel-message">Loading users…</li>}
          {error && <li className="panel-message error-message" role="alert">{error}</li>}
          {users.map((user) => (
            <li className="record" key={user.id}>
              <span className="record-id">{String(user.id).padStart(2, '0')}</span>
              <span className="record-name">{user.username}</span>
              <span className="record-arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
      </section>
    )
  }
}