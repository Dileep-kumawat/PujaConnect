import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin mx-auto" />
        <span className="text-xs text-slate-400">Verifying session token...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-spiritual-dark flex flex-col justify-between">
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Premium Elegant Footer */}
      <footer className="w-full bg-spiritual-slate py-8 border-t border-slate-200 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <span className="font-serif font-bold text-slate-800 tracking-wide animate-pulse-slow">
              Puja<span className="text-gold-600">Connect</span>
            </span>
            <span className="ml-1">© 2026. Conducting sacred Vedic services with absolute integrity.</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-slate-600">
            <Link to="/" className="hover:text-saffron-600 transition-colors">Home</Link>
            <Link to="/search" className="hover:text-saffron-600 transition-colors">Browse Priests</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-saffron-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// Simple internal Link replacement to avoid React-Router outside Router context error inside footer
const Link = ({ to, children, ...props }) => {
  return (
    <a 
      href={to} 
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }} 
      {...props}
    >
      {children}
    </a>
  );
};

export default App;
