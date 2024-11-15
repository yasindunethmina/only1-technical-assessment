import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            richColors
            closeButton
            duration={5000}
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  'border-2 !bg-primary-dark !golden-linear-text !border-golden-yellow !text-base',
                closeButton:
                  '!border-2 hover:!bg-golden-yellow hover:!text-black !bg-primary-dark !text-golden-yellow !border-golden-yellow',
                loading: '!text-para-gray',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
