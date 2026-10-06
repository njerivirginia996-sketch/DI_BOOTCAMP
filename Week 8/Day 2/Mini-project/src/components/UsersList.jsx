import { Component } from 'react'

export default class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoaded: false,
      errorMsg: '',
    }
    this.abortController = null
  }

  componentDidMount() {
    this.abortController = new AbortController()
    fetch('https://jsonplaceholder.typicode.com/users', { signal: this.abortController.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((users) => this.setState({ users, isLoaded: true }))
      .catch((error) => {
        if (error.name !== 'AbortError') this.setState({ errorMsg: error.message, isLoaded: true })
      })
  }

  componentWillUnmount() {
    this.abortController?.abort()
  }

  render() {
    const { users, isLoaded, errorMsg } = this.state

    if (!isLoaded) {
      return (
        <section className="list-section users-section" aria-labelledby="users-title">
          <div className="section-heading">
            <span className="section-index">02</span>
            <div><p className="endpoint-label">GET /users</p><h2 id="users-title">People</h2></div>
          </div>
          <p className="state-message">Loading…</p>
        </section>
      )
    }

    return (
      <section className="list-section users-section" aria-labelledby="users-title">
        <div className="section-heading">
          <span className="section-index">02</span>
          <div><p className="endpoint-label">GET /users</p><h2 id="users-title">People</h2></div>
          <span className="item-count">{errorMsg ? 'UNAVAILABLE' : `${users.length} RECORDS`}</span>
        </div>
        {errorMsg && <p className="state-message error-message" role="alert">{errorMsg}</p>}
        {!errorMsg && (
          <ul className="users-grid">
            {users.map((user) => (
              <li className="user-item" key={user.id}>
                <span className="user-initial" aria-hidden="true">{user.name.charAt(0)}</span>
                <span className="user-details"><strong>{user.name}</strong><a href={`mailto:${user.email}`}>{user.email}</a></span>
                <span className="record-number">{String(user.id).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}