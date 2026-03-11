import { Outlet } from 'react-router';
import { Component, ReactNode } from 'react';

// Error Boundary to catch React errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('🚨 React Error Boundary caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      // Redirect to auth on error
      window.location.href = '/auth';
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}