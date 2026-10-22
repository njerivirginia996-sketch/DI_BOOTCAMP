import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateProfile } from '../features/auth/authSlice';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!name.trim() || name.trim().length > 100) {
      setError('Enter a name of up to 100 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setSaving(true);
    const result = await dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) setMessage('Your details have been saved.');
    else setError(result.payload || 'Unable to update your profile.');
  }

  return (
    <main className="page-shell profile-page">
      <Link className="back-link" to="/">← Back to the collection</Link>
      <section className="profile-card">
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR CORNER</div>
        <h1>Make it <em>yours.</em></h1>
        <p className="profile-intro">A familiar name makes a shared story feel a little more like home.</p>
        <div className="profile-identity">
          <span className="avatar profile-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
          <div><strong>{user.name}</strong><small>Account #{user.id}</small></div>
        </div>
        <form className="form-stack" onSubmit={(event) => void submit(event)}>
          <label>Name
            <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
          </label>
          <label>Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {message && <p className="success-message" role="status">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile ↗'}</button>
        </form>
      </section>
    </main>
  );
}
