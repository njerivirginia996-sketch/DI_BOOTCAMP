import { Component } from 'react'

export default class PostList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      errorMsg: '',
      isLoading: true,
    }
    this.abortController = null
  }

  componentDidMount() {
    this.abortController = new AbortController()
    fetch('https://jsonplaceholder.typicode.com/posts', { signal: this.abortController.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((posts) => this.setState({ posts, isLoading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') this.setState({ errorMsg: error.message, isLoading: false })
      })
  }

  componentWillUnmount() {
    this.abortController?.abort()
  }

  render() {
    const { posts, errorMsg, isLoading } = this.state

    return (
      <section className="list-section posts-section" aria-labelledby="posts-title">
        <div className="section-heading">
          <span className="section-index">01</span>
          <div><p className="endpoint-label">GET /posts</p><h2 id="posts-title">Posts</h2></div>
          <span className="item-count">{isLoading ? 'LOADING' : `${posts.length} RECORDS`}</span>
        </div>
        {isLoading && <p className="state-message">Loading posts…</p>}
        {errorMsg && <p className="state-message error-message" role="alert">{errorMsg}</p>}
        {posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <article className="post-item" key={post.id}>
                <span className="record-number">{String(post.id).padStart(2, '0')}</span>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }
}