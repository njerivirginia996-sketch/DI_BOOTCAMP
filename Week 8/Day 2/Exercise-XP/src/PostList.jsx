import posts from './data/posts.json'

export default function PostList() {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.id}>
          <span className="post-number">{String(post.id).padStart(2, '0')}</span>
          <div>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
          <time>{post.date}</time>
        </article>
      ))}
    </div>
  )
}