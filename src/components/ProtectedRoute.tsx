import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'staff' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading, profileLoading, isConfigured } = useAuth();
  const location = useLocation();

  // If Firebase isn't configured, allow access in demo mode
  if (!isConfigured) {
    return <>{children}</>;
  }

  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (loading || (requiredRole && user && profileLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
