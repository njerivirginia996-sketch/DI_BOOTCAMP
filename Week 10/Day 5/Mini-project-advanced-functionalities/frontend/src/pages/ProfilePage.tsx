import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateAvatar, updateProfile } from '../features/auth/authSlice';
import { fetchStories } from '../features/stories/storiesSlice';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const stories = useAppSelector((state) => state.stories.items);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);

  useEffect(() => {
    void dispatch(fetchStories(true));
  }, [dispatch]);

  if (!user) return null;
  const createdStories = stories.filter((story) => story.author.id === user.id);
  const contributedStories = stories.filter((story) => story.author.id !== user.id && story.contributors.some((person) => person.id === user.id));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!name.trim() || name.trim().length > 100) {
      setError('Add a name that is no longer than 100 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please check the email address and try again.');
      return;
    }
    setSaving(true);
    const result = await dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) setMessage('Your account details are up to date.');
    else setError(result.payload || 'Your account details could not be saved.');
  }

  async function uploadAvatar(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setMessage('');
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 400 * 1024) {
      setError('Pick a PNG, JPEG, or WebP file that is under 400 KB.');
      return;
    }
    setAvatarSaving(true);
    try {
      const avatarUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('We could not open that image file.'));
        reader.onload = () => typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error('We could not open that image file.'));
        reader.readAsDataURL(file);
      });
      const result = await dispatch(updateAvatar(avatarUrl));
      if (updateAvatar.fulfilled.match(result)) setMessage('Your new picture is in place.');
      else setError(result.payload || 'Your picture could not be changed.');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'We could not open that image file.');
    } finally {
      setAvatarSaving(false);
    }
  }

  return (
    <main className="page-shell profile-page">
      <Link className="back-link" to="/">← Return to your shelf</Link>
      <section className="profile-card">
        <div className="eyebrow"><span className="eyebrow-line" /> ACCOUNT SETTINGS</div>
        <h1>Your own <em>space.</em></h1>
        <p className="profile-intro">Choose how other writers see you around the notebook.</p>
        <div className="profile-identity">
          {user.avatarUrl
            ? <img className="avatar profile-avatar" src={user.avatarUrl} alt={`${user.name}'s avatar`} />
            : <span className="avatar profile-avatar">{user.name.slice(0, 1).toUpperCase()}</span>}
          <div><strong>{user.name}</strong><small>Account #{user.id}</small></div>
        </div>
        <form className="form-stack" onSubmit={(event) => void submit(event)}>
          <label>Portrait
            <input type="file" accept="image/png,image/jpeg,image/webp" onInput={(event) => void uploadAvatar(event)} disabled={avatarSaving} />
            <small>{avatarSaving ? 'Adding your picture…' : 'PNG, JPEG, or WebP · 400 KB maximum.'}</small>
          </label>
          <label>Name
            <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
          </label>
          <label>Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {message && <p className="success-message" role="status">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={saving}>{saving ? 'Updating…' : 'Save account details ↗'}</button>
        </form>
        <section className="profile-stories">
          <h2>Started by you <span className="count-pill">{createdStories.length}</span></h2>
          {createdStories.map((story) => <p key={story.id}><Link to={`/stories/${story.id}`}>{story.title}</Link></p>)}
          <h2>Written with others <span className="count-pill">{contributedStories.length}</span></h2>
          {contributedStories.map((story) => <p key={story.id}><Link to={`/stories/${story.id}`}>{story.title}</Link></p>)}
        </section>
      </section>
    </main>
  );
}
