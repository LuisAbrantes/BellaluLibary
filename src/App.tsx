import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import FamilyMembersPage from './pages/FamilyMembersPage'
import LoginPage from './pages/LoginPage'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-pink-400 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/minha-conta" replace />;
  }

  return <>{children}</>;
}

// Account Page Component (handles both login and account views)
function AccountPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // TODO: Implement the actual account page for logged-in users
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="text-pink-400 text-xl">Página Minha Conta (em construção)</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/familia"
          element={
            <ProtectedRoute>
              <Layout>
                <FamilyMembersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Account Route (login for unauthenticated, account for authenticated) */}
        <Route path="/minha-conta" element={<AccountPage />} />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
