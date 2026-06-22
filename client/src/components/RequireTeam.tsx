import { Navigate, Outlet } from 'react-router-dom';
import { useActivityProgress } from '../hooks/useActivityProgress';

export function RequireTeam() {
  const { progress } = useActivityProgress();
  return progress.role === 'member' || (progress.teamGroup && progress.teamName)
    ? <Outlet />
    : <Navigate to="/instructions" replace />;
}
