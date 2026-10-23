import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { storySocketUrl } from '../api/client';
import { addContributor, addStoryComment, createStoryShare, deleteStoryComment, editStoryComment, fetchStory, fetchStoryComments, fetchStoryVersions, optimisticallyToggleReaction, removeContributor, replaceComments, restoreStoryVersion, saveStory, setCommentReaction, setCommentsEnabled, updateDraftStory } from '../features/stories/storiesSlice';
import type { Story } from '@story-app/types';

export function StoryPage() {
  const { id } = useParams();
  const storyId = id === 'new' ? undefined : Number(id);
  const creating = storyId === undefined;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeStory, comments, versions, status, error } = useAppSelector((state) => state.stories);
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [contributorUserId, setContributorUserId] = useState('');
  const [formError, setFormError] = useState('');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [remoteUpdate, setRemoteUpdate] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [interactionError, setInteractionError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [socketStatus, setSocketStatus] = useState('Connecting live updates…');
  const [remoteCursor, setRemoteCursor] = useState<{ name: string; position: number } | null>(null);
  const lastSeenUpdate = useRef<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!creating && storyId && Number.isSafeInteger(storyId)) {
      lastSeenUpdate.current = null;
      setHasLocalChanges(false);
      setRemoteUpdate(false);
      void dispatch(fetchStory(storyId));
      void dispatch(fetchStoryComments(storyId));
    }
  }, [creating, dispatch, storyId]);

  useEffect(() => {
    if (storyId && activeStory?.id === storyId && activeStory.author.id === currentUser?.id) {
      void dispatch(fetchStoryVersions(storyId));
    }
  }, [activeStory?.id, activeStory?.author.id, currentUser?.id, dispatch, storyId]);

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

  useEffect(() => {
    if (!storyId || !accessToken) return undefined;
    const socket = new WebSocket(storySocketUrl(storyId, accessToken));
    socketRef.current = socket;
    socket.onopen = () => setSocketStatus('Live collaboration connected');
    socket.onerror = () => setSocketStatus('Live collaboration is unavailable');
    socket.onclose = () => setSocketStatus('Live collaboration disconnected');
    socket.onmessage = (event) => {
      let message: { type: string; story?: Story; userId?: number; name?: string; position?: number };
      try {
        message = JSON.parse(String(event.data)) as typeof message;
      } catch (error) {
        console.error('Unable to read collaboration update:', error);
        return;
      }
      if (message.type === 'story:update' && message.story?.id === storyId) {
        dispatch(updateDraftStory(message.story));
      } else if (
        message.type === 'cursor'
        && message.userId !== currentUser?.id
        && typeof message.name === 'string'
        && typeof message.position === 'number'
      ) {
        setRemoteCursor({ name: message.name, position: message.position });
      }
    };
    return () => {
      socketRef.current = null;
      socket.close();
    };
  }, [accessToken, currentUser?.id, dispatch, storyId]);

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
    if (!story || !story.commentsEnabled || !comment.trim()) return;
    const result = await dispatch(addStoryComment({ storyId: story.id, body: comment.trim() }));
    if (addStoryComment.fulfilled.match(result)) {
      setComment('');
      setInteractionError('');
    } else setInteractionError(result.payload || 'Unable to add comment.');
  }

  async function saveComment(commentId: number) {
    const result = await dispatch(editStoryComment({ commentId, body: editingCommentText.trim() }));
    if (editStoryComment.fulfilled.match(result)) {
      setEditingCommentId(null);
      setInteractionError('');
    } else setInteractionError(result.payload || 'Unable to update comment.');
  }

  async function removeComment(commentId: number) {
    const result = await dispatch(deleteStoryComment(commentId));
    if (deleteStoryComment.rejected.match(result)) setInteractionError(result.payload || 'Unable to delete comment.');
    else setInteractionError('');
  }

  async function toggleReaction(commentId: number, reaction: string, active: boolean) {
    const previous = comments.map((entry) => ({ ...entry, reactions: entry.reactions.map((item) => ({ ...item })) }));
    dispatch(optimisticallyToggleReaction({ commentId, reaction }));
    const result = await dispatch(setCommentReaction({ commentId, reaction, active: !active }));
    if (setCommentReaction.rejected.match(result)) {
      dispatch(replaceComments(previous));
      setInteractionError(result.payload || 'Unable to update reaction.');
    }
  }

  async function toggleComments() {
    if (!story) return;
    const result = await dispatch(setCommentsEnabled({ storyId: story.id, enabled: !story.commentsEnabled }));
    if (setCommentsEnabled.rejected.match(result)) setInteractionError(result.payload || 'Unable to update comment settings.');
    else setInteractionError('');
  }

  async function shareStory() {
    if (!story) return;
    const result = await dispatch(createStoryShare(story.id));
    if (createStoryShare.fulfilled.match(result)) {
      setShareLink(result.payload);
      try {
        await navigator.clipboard.writeText(result.payload);
        setInteractionError('The reading link is ready to paste.');
      } catch {
        setInteractionError('Your link is ready. Copy it from the box below.');
      }
    } else setInteractionError(result.payload || 'We could not make a link for this story.');
  }

  async function restoreVersion(versionId: number) {
    if (!story || !window.confirm('Bring this earlier draft back? The version you have now will stay in the archive.')) return;
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
      setFormError('Enter an account number made of digits.');
      return;
    }
    const result = await dispatch(addContributor({ storyId: story.id, userId }));
    if (addContributor.fulfilled.match(result)) {
      setContributorUserId('');
      await dispatch(fetchStory(story.id));
    }
  }

  if (!creating && status === 'loading' && !story) {
    return <main className="page-shell"><div className="loading-state"><span className="spinner" />Finding your story…</div></main>;
  }
  if (!creating && !story) {
    return <main className="page-shell"><div className="empty-state"><h2>This page seems to have wandered off.</h2><Link className="text-link" to="/">Return to your shelf →</Link></div></main>;
  }

  return (
    <main className="page-shell story-page">
      <Link className="back-link" to="/">← Back to your shelf</Link>
      <div className="story-layout">
        <section className="story-main">
          <div className="eyebrow"><span className="eyebrow-line" /> {creating ? 'START SOMETHING NEW' : `NOTEBOOK ENTRY · ${String(story!.id).padStart(3, '0')}`}</div>
          {canEdit ? (
            <form className="editor-form" onSubmit={(event) => void submitStory(event)}>
              <input className="story-title-input" aria-label="Story heading" placeholder="What shall we call this tale?" value={title} onChange={(event) => { setTitle(event.target.value); setHasLocalChanges(true); }} maxLength={180} required />
              <textarea className="story-content-input" aria-label="Story text" placeholder="Set the scene, write a line, or leave a twist for the next person." value={content} onChange={(event) => { setContent(event.target.value); setHasLocalChanges(true); }} onSelect={(event) => { const socket = socketRef.current; if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'cursor', position: event.currentTarget.selectionStart })); }} maxLength={50_000} rows={12} />
              {remoteUpdate && <p className="live-update" role="status">Someone in your circle has posted a newer draft. Your unsaved writing is still here.</p>}
              {formError && <p className="form-error" role="alert">{formError}</p>}
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="editor-footer"><span>{content.length.toLocaleString()} / 50,000 characters</span><button className="button" disabled={status === 'saving'}>{status === 'saving' ? 'Keeping your draft…' : creating ? 'Publish the first page ↗' : 'Save this draft ↗'}</button></div>
            </form>
          ) : (
            <>
              <h1 className="reader-title">{story!.title}</h1>
              <div className="reader-meta"><span className="avatar avatar-small">{story!.author.name.slice(0, 1).toUpperCase()}</span> First written by <strong>{story!.author.name}</strong><span className="meta-dot">·</span> last touched {new Date(story!.updatedAt).toLocaleDateString()}</div>
              <article className="story-prose">{story!.content || <span className="muted">A quiet page, ready for its first sentence.</span>}</article>
            </>
          )}

          {!creating && story && isAuthor && versions.length > 0 && (
            <section className="history-section">
              <div className="section-heading compact-heading"><div><span className="eyebrow">HOW IT GREW</span><h2>Past drafts <span className="count-pill">{versions.length}</span></h2></div></div>
              <div className="version-list">
                {versions.map((version) => <article className="version-item" key={version.id}>
                  <div className="version-copy"><strong>{version.title}</strong><span>Edited by {version.editor.name} · {new Date(version.createdAt).toLocaleString()}</span><p>{version.content || 'This draft had no story text.'}</p></div>
                  {isAuthor && <button className="filter-button" type="button" onClick={() => void restoreVersion(version.id)}>Bring back</button>}
                </article>)}
              </div>
            </section>
          )}

          {!creating && (
            <section className="comments-section">
              <div className="section-heading compact-heading"><div><span className="eyebrow">MESSAGES FROM THE CIRCLE</span><h2>Reader notes <span className="count-pill">{comments.length}</span></h2></div>{isAuthor && <button className="filter-button" type="button" onClick={() => void toggleComments()}>{story!.commentsEnabled ? 'Close the discussion' : 'Open the discussion'}</button>}</div>
              <p className="live-update" role="status">{socketStatus}{remoteCursor ? ` · ${remoteCursor.name} is editing near character ${remoteCursor.position}.` : ''}</p>
              {interactionError && <p className="form-error" role="alert">{interactionError}</p>}
              <div className="comment-list">
                {comments.map((entry) => <article className="comment" key={entry.id}><span className="avatar avatar-small">{entry.author.name.slice(0, 1).toUpperCase()}</span><div><div className="comment-meta"><strong>{entry.author.name}</strong><time>{new Date(entry.createdAt).toLocaleDateString()}</time></div>{editingCommentId === entry.id ? <><textarea value={editingCommentText} onChange={(event) => setEditingCommentText(event.target.value)} maxLength={2000} /><button className="filter-button" type="button" onClick={() => void saveComment(entry.id)}>Save</button><button className="filter-button" type="button" onClick={() => setEditingCommentId(null)}>Cancel</button></> : <p>{entry.body}</p>}<div className="comment-actions">{(['like', 'love', 'laugh', 'celebrate'] as const).map((reaction) => { const item = entry.reactions.find((value) => value.reaction === reaction); const labels = { like: '👍', love: '❤️', laugh: '😂', celebrate: '🎉' }; return <button className={`filter-button${item?.reacted ? ' is-active' : ''}`} key={reaction} type="button" disabled={!story!.commentsEnabled} onClick={() => void toggleReaction(entry.id, reaction, item?.reacted ?? false)} aria-pressed={item?.reacted ?? false}>{labels[reaction]} {item?.count ?? ''}</button>; })}{(entry.author.id === currentUser?.id || isAuthor) && <>{entry.author.id === currentUser?.id && <button className="filter-button" type="button" disabled={!story!.commentsEnabled} onClick={() => { setEditingCommentId(entry.id); setEditingCommentText(entry.body); }}>Edit</button>}<button className="filter-button" type="button" onClick={() => void removeComment(entry.id)}>Delete</button></>}</div></div></article>)}
                {comments.length === 0 && <p className="muted">Nothing has been left here yet. Start the conversation.</p>}
              </div>
              {canEdit && story!.commentsEnabled && <form className="comment-form" onSubmit={(event) => void submitComment(event)}>
                <textarea aria-label="Write a reader note" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share a thought with the writers…" maxLength={2000} rows={2} />
                <button className="button button-small" disabled={!comment.trim()}>Post your thought</button>
              </form>}
              {!story!.commentsEnabled && <p className="muted">The writer has paused new notes for this tale.</p>}
            </section>
          )}
        </section>

        {!creating && story && (
          <aside className="story-sidebar">
            <section className="sidebar-card">
              <span className="eyebrow">PEOPLE BEHIND THE PAGE</span>
              <h3>{story.contributors.length + 1} {story.contributors.length === 0 ? 'writer' : 'writers'}</h3>
              <div className="contributor-list">
                <div className="contributor"><span className="avatar">{story.author.name.slice(0, 1).toUpperCase()}</span><div><strong>{story.author.name}</strong><small>Opened this tale</small></div><span className="author-star">✳</span></div>
                {story.contributors.map((person) => <div className="contributor" key={person.contributorId}><span className="avatar avatar-lilac">{person.name.slice(0, 1).toUpperCase()}</span><div><strong>{person.name}</strong><small>Writer · account #{person.id}</small></div>{isAuthor && <button className="quiet-delete" type="button" onClick={() => void dispatch(removeContributor({ contributorId: person.contributorId, userId: person.id, storyId: story.id }))} aria-label={`Remove ${person.name}`}>×</button>}</div>)}
              </div>
              {isAuthor && <form className="invite-form" onSubmit={(event) => void inviteContributor(event)}><label htmlFor="invite-id">Bring in another writer</label><div><input id="invite-id" inputMode="numeric" placeholder="Their account number" value={contributorUserId} onChange={(event) => setContributorUserId(event.target.value)} /><button className="icon-button invite-button" aria-label="Invite writer">+</button></div><small>Get their account number to add them here.</small></form>}
            </section>
            <section className="sidebar-card">
              <span className="eyebrow">PASS THIS TALE ALONG</span>
              <button className="button button-small" type="button" onClick={() => void shareStory()}>Make a reading link</button>
              {shareLink && <><input aria-label="Share link" readOnly value={shareLink} /><a className="filter-button" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(story.title)}`} target="_blank" rel="noreferrer">Share on X</a><a className="filter-button" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">Facebook</a></>}
            </section>
            <div className="sidebar-note"><span>✳</span><p>A new voice can take a story somewhere unexpected.</p></div>
          </aside>
        )}
      </div>
    </main>
  );
}
