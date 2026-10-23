import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSharedStory } from '../features/stories/storiesSlice';

export function SharedStoryPage() {
  const { token = '' } = useParams();
  const dispatch = useAppDispatch();
  const shared = useAppSelector((state) => state.stories.sharedStory);
  const error = useAppSelector((state) => state.stories.error);

  useEffect(() => {
    void dispatch(fetchSharedStory(token));
  }, [dispatch, token]);

  if (!shared) {
    return <main className="page-shell"><div className="empty-state"><h1>{error || 'Fetching the shared tale…'}</h1><Link className="text-link" to="/">Explore Virgie →</Link></div></main>;
  }
  return (
    <main className="page-shell story-page">
      <Link className="back-link" to="/">← Explore Virgie</Link>
      <article className="story-main">
        <div className="eyebrow"><span className="eyebrow-line" /> PASSED ALONG TO YOU</div>
        <h1 className="reader-title">{shared.title}</h1>
        <p className="reader-meta">A tale begun by <strong>{shared.author.name}</strong> · refreshed {new Date(shared.updatedAt).toLocaleDateString()}</p>
        <article className="story-prose">{shared.content || <span className="muted">This page is waiting for its opening words.</span>}</article>
      </article>
    </main>
  );
}
