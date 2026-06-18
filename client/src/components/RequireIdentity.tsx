import { Navigate, Outlet } from 'react-router-dom';
import { useActivityProgress } from '../hooks/useActivityProgress';

export function RequireIdentity() {
  const { progress } = useActivityProgress();
  return progress.role ? <Outlet /> : <Navigate to="/identity" replace />;
}
