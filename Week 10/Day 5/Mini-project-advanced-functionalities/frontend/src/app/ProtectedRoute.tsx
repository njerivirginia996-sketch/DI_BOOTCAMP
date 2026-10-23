import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';

export function ProtectedRoute() {
  const { status, user } = useAppSelector((state) => state.auth);
  if (status === 'idle' || status === 'loading') {
    return <main className="page-shell"><div className="loading-state"><span className="spinner" />Getting your notebook ready…</div></main>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
