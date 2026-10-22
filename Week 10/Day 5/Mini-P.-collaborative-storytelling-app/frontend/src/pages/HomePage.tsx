import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchStories, removeStory } from '../features/stories/storiesSlice';

export function HomePage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.stories);
  const user = useAppSelector((state) => state.auth.user);
  const [mineOnly, setMineOnly] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    void dispatch(fetchStories(mineOnly));
  }, [dispatch, mineOnly]);

  const visibleStories = useMemo(() => items.filter((story) => (
    `${story.title} ${story.content} ${story.author.name}`.toLowerCase().includes(search.toLowerCase())
  )), [items, search]);

  async function deleteStory(id: number) {
    if (window.confirm('Delete this story and its comments? This cannot be undone.')) {
      await dispatch(removeStory(id));
    }
  }

  return (
    <main className="page-shell">
      <section className="home-hero">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> THE SHARED NOTEBOOK</div>
          <h1>Stories are better<br />when <em>shared.</em></h1>
          <p>A living library of little beginnings and unexpected endings.</p>
        </div>
        <Link className="button hero-button" to="/stories/new"><span className="plus-mark">＋</span> Start a story</Link>
        <div className="hero-scribble" aria-hidden="true">✳</div>
      </section>

      <section className="library-section">
        <div className="section-heading">
          <div><span className="eyebrow">THE COLLECTION</span><h2>Open pages <span className="count-pill">{visibleStories.length}</span></h2></div>
          <div className="collection-controls">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search stories" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a story…" /></label>
            <button className={`filter-button ${mineOnly ? 'is-active' : ''}`} type="button" onClick={() => setMineOnly((value) => !value)}>
              <span aria-hidden="true">▤</span> {mineOnly ? 'My stories' : 'All stories'}
            </button>
          </div>
        </div>

        {error && <p className="inline-error" role="alert">{error}</p>}
        {status === 'loading' ? <div className="loading-state"><span className="spinner" />Gathering the stories…</div> : null}
        {status !== 'loading' && visibleStories.length === 0 && (
          <div className="empty-state"><span className="empty-icon">✳</span><h3>{search ? 'No pages found.' : 'The first page is yours.'}</h3><p>{search ? 'Try another title or author.' : 'Start a story and invite someone to add the next line.'}</p>{!search && <Link className="text-link" to="/stories/new">Write the opening →</Link>}</div>
        )}

        <div className="story-grid">
          {visibleStories.map((story, index) => {
            const isAuthor = story.author.id === user?.id;
            return (
              <article className={`story-card card-tone-${index % 4}`} key={story.id}>
                <div className="story-card-top"><span className="story-kicker">{isAuthor ? 'YOUR STORY' : 'IN THE CIRCLE'}</span><span className="story-date">{new Date(story.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>
                <Link className="story-card-link" to={`/stories/${story.id}`}>
                  <h3>{story.title}</h3>
                  <p>{story.content || 'A blank page, waiting for its first line…'}</p>
                </Link>
                <div className="story-card-bottom">
                  <div className="story-author"><span className="avatar avatar-small">{story.author.name.slice(0, 1).toUpperCase()}</span><span>by <strong>{isAuthor ? 'you' : story.author.name}</strong></span></div>
                  <span className="collab-count" title={`${story.contributors.length} contributors`}>◌ {story.contributors.length}</span>
                  {isAuthor && <button className="quiet-delete" type="button" onClick={() => void deleteStory(story.id)} aria-label={`Delete ${story.title}`}>×</button>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <footer className="site-footer"><span>FABLE · A SHARED NOTEBOOK FOR IMAGINATION</span><span>Made to be passed around <span className="footer-star">✳</span></span></footer>
    </main>
  );
}
