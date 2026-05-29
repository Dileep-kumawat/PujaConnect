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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center border border-saffron-200 group-hover:border-saffron-500/60 transition-all duration-300">
          <Flame className="w-6 h-6 text-saffron-600 animate-pulse-slow" />
        </div>
        <div>
          <span className="text-2xl font-bold tracking-wide font-serif text-slate-800 group-hover:text-saffron-600 transition-colors">
            Puja<span className="text-gold-600">Connect</span>
          </span>
          <p className="text-[10px] text-slate-500 tracking-wider -mt-1 uppercase">Sacred Services, Simplified</p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm font-medium transition-colors hover:text-saffron-600 ${location.pathname === '/' ? 'text-saffron-600' : 'text-slate-600'}`}
        >
          Home
        </Link>
        <Link 
          to="/search" 
          className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-saffron-600 ${location.pathname === '/search' ? 'text-saffron-600' : 'text-slate-600'}`}
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200/60 text-xs font-semibold tracking-wide transition-all text-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-600" />
              <span>Dashboard</span>
              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                user.role === 'admin' 
                  ? 'bg-red-50 text-red-600 border border-red-200/60' 
                  : user.role === 'pandit'
                  ? 'bg-saffron-50 text-saffron-600 border border-saffron-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                {user.role}
              </span>
            </Link>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-800">{user.name}</span>
              <span className="text-[10px] text-slate-500">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white font-medium text-sm transition-all gold-glow"
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
