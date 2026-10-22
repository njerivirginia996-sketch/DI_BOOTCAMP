import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { logout } from '../features/auth/authSlice';
import { clearStories } from '../features/stories/storiesSlice';

interface HeaderProps {
  dark: boolean;
  onToggleTheme: () => void;
}

export function Header({ dark, onToggleTheme }: HeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function signOut() {
    await dispatch(logout());
    dispatch(clearStories());
    navigate('/login', { replace: true });
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">f.</span>
        <span>fable<span className="brand-period">.</span></span>
      </Link>
      <nav aria-label="Main navigation">
        {user && (
          <>
            <NavLink to="/" end>Library</NavLink>
            <NavLink to="/stories/new" className="nav-create">New story <span>+</span></NavLink>
          </>
        )}
      </nav>
      <div className="topbar-actions">
        <button className="icon-button" type="button" onClick={onToggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>
          {dark ? '☼' : '☾'}
        </button>
        {user ? (
          <>
            <div className="user-chip" title={`Account ID: ${user.id}`}><span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span><span>{user.name} <small className="account-id">#{user.id}</small></span></div>
            <Link className="text-button profile-link" to="/profile">Profile</Link>
            <button className="text-button" type="button" onClick={() => void signOut()}>Log out</button>
          </>
        ) : <Link className="button button-small" to="/login">Log in</Link>}
      </div>
    </header>
  );
}
