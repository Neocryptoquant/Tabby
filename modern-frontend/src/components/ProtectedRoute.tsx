import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  tournamentId?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, tournamentId }) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If tournamentId is required and user doesn't have access, redirect to public view
  if (tournamentId && !user.tournaments?.includes(tournamentId)) {
    return <Navigate to={`/tournament/${tournamentId}`} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
