import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, signup } from '../features/auth/authSlice';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === 'signup';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (isSignup && (!name.trim() || name.trim().length > 100)) {
      setFormError('Enter a name of up to 100 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (isSignup && (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password))) {
      setFormError('Use at least 10 characters with an uppercase letter, a lowercase letter, and a number.');
      return;
    }

    const action = isSignup
      ? await dispatch(signup({ name: name.trim(), email: email.trim(), password }))
      : await dispatch(login({ email: email.trim(), password }));
    if (signup.fulfilled.match(action) || login.fulfilled.match(action)) {
      navigate('/', { replace: true });
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <div className="eyebrow"><span className="eyebrow-line" /> A little room for big ideas</div>
        <h1>Every great story<br />starts <em>somewhere.</em></h1>
        <p>Find your people. Pass the pen. See where the story takes you.</p>
        <div className="auth-quote"><span>“</span><p>Stories are the things we make together.</p><small>THE FABLE NOTEBOOK · NO. 01</small></div>
      </section>
      <section className="auth-card">
        <div className="auth-card-heading">
          <span className="eyebrow">{isSignup ? 'YOUR NEXT CHAPTER' : 'WELCOME BACK'}</span>
          <h2>{isSignup ? 'Make yourself at home.' : 'Pick up where you left off.'}</h2>
          <p>{isSignup ? 'Create a free account and start writing together.' : 'Your stories are right where you left them.'}</p>
        </div>
        <form onSubmit={(event) => void submit(event)} className="form-stack">
          {isSignup && (
            <label>Name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Moss Anderson" required maxLength={100} />
            </label>
          )}
          <label>Email address
            <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <label>Password
            <input autoComplete={isSignup ? 'new-password' : 'current-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? 'At least 10 characters' : 'Your password'} required />
          </label>
          {(formError || error) && <p className="form-error" role="alert">{formError || error}</p>}
          <button className="button button-wide" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'One moment…' : isSignup ? 'Create your account' : 'Enter your library'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-switch">
          {isSignup ? 'Already have a place here?' : 'New to Fable?'}{' '}
          <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Make an account'}</Link>
        </p>
        {isSignup && <p className="form-hint">By joining, you agree to be kind to your co-authors.</p>}
      </section>
    </main>
  );
}
