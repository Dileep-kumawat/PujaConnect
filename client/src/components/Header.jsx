import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, User, LogOut, LayoutDashboard, Search as SearchIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-spiritual-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full bg-saffron-600/10 flex items-center justify-center border border-saffron-500/30 group-hover:border-saffron-500/60 transition-all duration-300">
          <Flame className="w-6 h-6 text-saffron-500 animate-pulse-slow" />
        </div>
        <div>
          <span className="text-2xl font-bold tracking-wide font-serif text-white group-hover:text-saffron-500 transition-colors">
            Puja<span className="text-gold-500">Connect</span>
          </span>
          <p className="text-[10px] text-slate-400 tracking-wider -mt-1 uppercase">Sacred Services, Simplified</p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm font-medium transition-colors hover:text-saffron-500 ${location.pathname === '/' ? 'text-saffron-500' : 'text-slate-300'}`}
        >
          Home
        </Link>
        <Link 
          to="/search" 
          className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-saffron-500 ${location.pathname === '/search' ? 'text-saffron-500' : 'text-slate-300'}`}
        >
          <SearchIcon className="w-4 h-4" />
          Find Pandits
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold tracking-wide transition-all text-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-500" />
              <span>Dashboard</span>
              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                user.role === 'admin' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : user.role === 'pandit'
                  ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
                  : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
              }`}>
                {user.role}
              </span>
            </Link>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200">{user.name}</span>
              <span className="text-[10px] text-slate-400">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg bg-saffron-600/90 hover:bg-saffron-600 text-white font-medium text-sm transition-all gold-glow"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
