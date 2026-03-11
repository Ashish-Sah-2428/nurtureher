import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading, accessToken } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Early return if already redirected
    if (hasRedirected.current) {
      return;
    }

    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // Only check if auth is required
    if (!requireAuth) {
      return;
    }

    // Check if user is authenticated
    if (!user || !accessToken) {
      console.log('⚠️ No authentication found, redirecting to /auth');
      hasRedirected.current = true; // Set FIRST to prevent re-entry
      navigate('/auth', { replace: true });
    }
  }, [user, loading, accessToken, requireAuth]); // Removed navigate from deps

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (requireAuth && (!user || !accessToken)) {
    return null;
  }

  return <>{children}</>;
}