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
      setFormError('Your name must be between 1 and 100 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('That email address does not look quite right.');
      return;
    }
    if (isSignup && (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password))) {
      setFormError('Choose 10 or more characters with a mix of capital letters, lowercase letters, and a number.');
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
        <div className="eyebrow"><span className="eyebrow-line" /> A home for your imagination</div>
        <h1>Put your ideas<br />on the <em>page.</em></h1>
        <p>Bring a friend, add a few lines, and let the plot surprise you.</p>
        <div className="auth-quote"><span>“</span><p>One sentence can open a whole new world.</p><small>A NOTE FROM VIRGIE · 01</small></div>
      </section>
      <section className="auth-card">
        <div className="auth-card-heading">
          <span className="eyebrow">{isSignup ? 'JOIN THE NOTEBOOK' : 'GOOD TO SEE YOU'}</span>
          <h2>{isSignup ? 'Let’s get you started.' : 'Ready for another page?'}</h2>
          <p>{isSignup ? 'Set up your account and invite others into your stories.' : 'Sign in to return to your writing circle.'}</p>
        </div>
        <form onSubmit={(event) => void submit(event)} className="form-stack">
          {isSignup && (
            <label>Name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we call you?" required maxLength={100} />
            </label>
          )}
          <label>Email address
            <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@domain.com" required />
          </label>
          <label>Password
            <input autoComplete={isSignup ? 'new-password' : 'current-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? 'Create a secure password' : 'Enter your password'} required />
          </label>
          {(formError || error) && <p className="form-error" role="alert">{formError || error}</p>}
          <button className="button button-wide" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Please wait…' : isSignup ? 'Join Virgie' : 'Continue to my shelf'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-switch">
          {isSignup ? 'Already writing with us?' : 'Haven’t joined us yet?'}{' '}
          <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in here' : 'Create an account'}</Link>
        </p>
        {isSignup && <p className="form-hint">A little kindness makes every writing circle better.</p>}
      </section>
    </main>
  );
}
