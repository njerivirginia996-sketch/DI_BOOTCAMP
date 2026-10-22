import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addContributor, addStoryComment, fetchStory, fetchStoryVersions, removeContributor, restoreStoryVersion, saveStory } from '../features/stories/storiesSlice';

export function StoryPage() {
  const { id } = useParams();
  const storyId = id === 'new' ? undefined : Number(id);
  const creating = storyId === undefined;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeStory, comments, versions, status, error } = useAppSelector((state) => state.stories);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [contributorUserId, setContributorUserId] = useState('');
  const [formError, setFormError] = useState('');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [remoteUpdate, setRemoteUpdate] = useState(false);
  const lastSeenUpdate = useRef<string | null>(null);

  useEffect(() => {
    if (!creating && storyId && Number.isSafeInteger(storyId)) {
      lastSeenUpdate.current = null;
      setHasLocalChanges(false);
      setRemoteUpdate(false);
      void dispatch(fetchStory(storyId));
      void dispatch(fetchStoryVersions(storyId));
    }
  }, [creating, dispatch, storyId]);

  useEffect(() => {
    if (activeStory && activeStory.id === storyId) {
      const previousUpdate = lastSeenUpdate.current;
      lastSeenUpdate.current = activeStory.updatedAt;
      if (previousUpdate === null) {
        setTitle(activeStory.title);
        setContent(activeStory.content);
        setHasLocalChanges(false);
        setRemoteUpdate(false);
      } else if (previousUpdate !== activeStory.updatedAt) {
        if (hasLocalChanges) {
          setRemoteUpdate(true);
        } else {
          setTitle(activeStory.title);
          setContent(activeStory.content);
          setHasLocalChanges(false);
          setRemoteUpdate(false);
        }
      }
    }
  }, [activeStory, storyId]);

  useEffect(() => {
    if (creating || !storyId || !Number.isSafeInteger(storyId)) return undefined;
    const interval = window.setInterval(() => {
      void dispatch(fetchStory(storyId));
    }, 10_000);
    return () => window.clearInterval(interval);
  }, [creating, dispatch, storyId]);

  const story = !creating && activeStory?.id === storyId ? activeStory : null;
  const isAuthor = story?.author.id === currentUser?.id;
  const isContributor = story?.contributors.some((person) => person.id === currentUser?.id) || false;
  const canEdit = creating || isAuthor || isContributor;

  async function submitStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    if (!title.trim() || title.trim().length > 180 || content.length > 50_000) {
      setFormError('Add a title (up to 180 characters) and keep the story under 50,000 characters.');
      return;
    }
    const result = await dispatch(saveStory({ id: storyId, title: title.trim(), content }));
    if (saveStory.fulfilled.match(result)) {
      setHasLocalChanges(false);
      setRemoteUpdate(false);
      lastSeenUpdate.current = result.payload.updatedAt;
      void dispatch(fetchStoryVersions(result.payload.id));
      navigate(`/stories/${result.payload.id}`);
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!story || !comment.trim()) return;
    const result = await dispatch(addStoryComment({ storyId: story.id, body: comment.trim() }));
    if (addStoryComment.fulfilled.match(result)) setComment('');
  }

  async function restoreVersion(versionId: number) {
    if (!story || !window.confirm('Restore this version? Your current page will be kept in the history.')) return;
    const result = await dispatch(restoreStoryVersion({ storyId: story.id, versionId }));
    if (restoreStoryVersion.fulfilled.match(result)) {
      setTitle(result.payload.story.title);
      setContent(result.payload.story.content);
      setHasLocalChanges(false);
      setRemoteUpdate(false);
      lastSeenUpdate.current = result.payload.story.updatedAt;
    }
  }

  async function inviteContributor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!story) return;
    const userId = Number(contributorUserId);
    if (!Number.isSafeInteger(userId) || userId < 1) {
      setFormError('Enter a valid account ID.');
      return;
    }
    const result = await dispatch(addContributor({ storyId: story.id, userId }));
    if (addContributor.fulfilled.match(result)) {
      setContributorUserId('');
      await dispatch(fetchStory(story.id));
    }
  }

  if (!creating && status === 'loading' && !story) {
    return <main className="page-shell"><div className="loading-state"><span className="spinner" />Turning to that page…</div></main>;
  }
  if (!creating && !story) {
    return <main className="page-shell"><div className="empty-state"><h2>We couldn’t find that story.</h2><Link className="text-link" to="/">Back to the library →</Link></div></main>;
  }

  return (
    <main className="page-shell story-page">
      <Link className="back-link" to="/">← Back to the collection</Link>
      <div className="story-layout">
        <section className="story-main">
          <div className="eyebrow"><span className="eyebrow-line" /> {creating ? 'A FRESH PAGE' : `STORY · ${String(story!.id).padStart(3, '0')}`}</div>
          {canEdit ? (
            <form className="editor-form" onSubmit={(event) => void submitStory(event)}>
              <input className="story-title-input" aria-label="Story title" placeholder="Give your story a name…" value={title} onChange={(event) => { setTitle(event.target.value); setHasLocalChanges(true); }} maxLength={180} required />
              <textarea className="story-content-input" aria-label="Story content" placeholder="Once upon a time… Start anywhere. Your collaborators can pick up right here." value={content} onChange={(event) => { setContent(event.target.value); setHasLocalChanges(true); }} maxLength={50_000} rows={12} />
              {remoteUpdate && <p className="live-update" role="status">A co-author has saved a newer version. Save your draft carefully to merge changes.</p>}
              {formError && <p className="form-error" role="alert">{formError}</p>}
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="editor-footer"><span>{content.length.toLocaleString()} / 50,000 characters</span><button className="button" disabled={status === 'saving'}>{status === 'saving' ? 'Saving…' : creating ? 'Create story ↗' : 'Save changes ↗'}</button></div>
            </form>
          ) : (
            <>
              <h1 className="reader-title">{story!.title}</h1>
              <div className="reader-meta"><span className="avatar avatar-small">{story!.author.name.slice(0, 1).toUpperCase()}</span> Begun by <strong>{story!.author.name}</strong><span className="meta-dot">·</span> updated {new Date(story!.updatedAt).toLocaleDateString()}</div>
              <article className="story-prose">{story!.content || <span className="muted">The first line is yet to be written.</span>}</article>
            </>
          )}

          {!creating && story && versions.length > 0 && (
            <section className="history-section">
              <div className="section-heading compact-heading"><div><span className="eyebrow">EARLIER DRAFTS</span><h2>Version history <span className="count-pill">{versions.length}</span></h2></div></div>
              <div className="version-list">
                {versions.map((version) => <article className="version-item" key={version.id}>
                  <div className="version-copy"><strong>{version.title}</strong><span>Saved by {version.editor.name} · {new Date(version.createdAt).toLocaleString()}</span><p>{version.content || 'No text in this draft.'}</p></div>
                  {canEdit && <button className="filter-button" type="button" onClick={() => void restoreVersion(version.id)}>Restore</button>}
                </article>)}
              </div>
            </section>
          )}

          {!creating && (
            <section className="comments-section">
              <div className="section-heading compact-heading"><div><span className="eyebrow">MARGIN NOTES</span><h2>Conversation <span className="count-pill">{comments.length}</span></h2></div></div>
              <div className="comment-list">
                {comments.map((entry) => <article className="comment" key={entry.id}><span className="avatar avatar-small">{entry.author.name.slice(0, 1).toUpperCase()}</span><div><div className="comment-meta"><strong>{entry.author.name}</strong><time>{new Date(entry.createdAt).toLocaleDateString()}</time></div><p>{entry.body}</p></div></article>)}
                {comments.length === 0 && <p className="muted">No notes in the margin yet. Leave the first one.</p>}
              </div>
              {canEdit && <form className="comment-form" onSubmit={(event) => void submitComment(event)}>
                <textarea aria-label="Write a comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Leave a kind note…" maxLength={2000} rows={2} />
                <button className="button button-small" disabled={!comment.trim()}>Add note</button>
              </form>}
            </section>
          )}
        </section>

        {!creating && story && (
          <aside className="story-sidebar">
            <section className="sidebar-card">
              <span className="eyebrow">THE WRITING CIRCLE</span>
              <h3>{story.contributors.length + 1} {story.contributors.length === 0 ? 'voice' : 'voices'}</h3>
              <div className="contributor-list">
                <div className="contributor"><span className="avatar">{story.author.name.slice(0, 1).toUpperCase()}</span><div><strong>{story.author.name}</strong><small>Started this story</small></div><span className="author-star">✳</span></div>
                {story.contributors.map((person) => <div className="contributor" key={person.contributorId}><span className="avatar avatar-lilac">{person.name.slice(0, 1).toUpperCase()}</span><div><strong>{person.name}</strong><small>Contributor · #{person.id}</small></div>{isAuthor && <button className="quiet-delete" type="button" onClick={() => void dispatch(removeContributor({ contributorId: person.contributorId, userId: person.id, storyId: story.id }))} aria-label={`Remove ${person.name}`}>×</button>}</div>)}
              </div>
              {isAuthor && <form className="invite-form" onSubmit={(event) => void inviteContributor(event)}><label htmlFor="invite-id">Invite by account ID</label><div><input id="invite-id" inputMode="numeric" placeholder="e.g. 12" value={contributorUserId} onChange={(event) => setContributorUserId(event.target.value)} /><button className="icon-button invite-button" aria-label="Add contributor">+</button></div><small>Ask your co-author for their account ID.</small></form>}
            </section>
            <div className="sidebar-note"><span>✳</span><p>The best stories don't have just one voice.</p></div>
          </aside>
        )}
      </div>
    </main>
  );
}
