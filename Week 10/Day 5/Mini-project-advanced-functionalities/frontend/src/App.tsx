import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './app/Header';
import { ProtectedRoute } from './app/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { restoreSession } from './features/auth/authSlice';
import { clearStories } from './features/stories/storiesSlice';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { StoryPage } from './pages/StoryPage';
import { SharedStoryPage } from './pages/SharedStoryPage';

export default function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const booted = useRef(false);
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('virgie-theme') ?? localStorage.getItem('fable-theme');
    return savedTheme !== 'light';
  });

  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      void dispatch(restoreSession());
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('virgie-theme', dark ? 'dark' : 'light');
    localStorage.removeItem('fable-theme');
  }, [dark]);

  useEffect(() => {
    if (status === 'guest') dispatch(clearStories());
  }, [dispatch, status]);

  return (
    <div className="app-frame">
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} />
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/share/:token" element={<SharedStoryPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/stories/:id" element={<StoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="site-seal" aria-hidden="true">f</div>
    </div>
  );
}
