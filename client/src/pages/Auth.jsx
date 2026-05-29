import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, User, Mail, Lock, Phone, UserCheck, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // 'customer' or 'pandit'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && (!name || !phone))) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await register(name, email, password, role, phone);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Connection failure. Check backend service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-6 overflow-hidden">
      {/* Background Spiritual Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-saffron-600/10 blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-burgundy-900/15 blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Main Glass Card */}
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col p-8 auth-card-transition">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-saffron-600/10 flex items-center justify-center border border-saffron-500/30 mb-3">
            <Flame className="w-7 h-7 text-saffron-500 animate-pulse-slow" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            {isLogin ? 'Welcome Back' : 'Join PujaConnect'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {isLogin 
              ? 'Sign in to schedule your ceremonies and manage rituals' 
              : 'Connect with verified priests for home or temple devotions'}
          </p>
        </div>

        {/* Tab Selector (Login / Register) */}
        <div className="grid grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              isLogin 
                ? 'bg-saffron-600 text-white shadow-md gold-glow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              !isLogin 
                ? 'bg-saffron-600 text-white shadow-md gold-glow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Register Mode Inputs */}
          {!isLogin && (
            <>
              {/* Role selector */}
              <div className="space-y-1.5 mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">I want to register as a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                      role === 'customer'
                        ? 'border-gold-500/50 bg-gold-500/10 text-gold-400'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('pandit')}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                      role === 'pandit'
                        ? 'border-saffron-500/50 bg-saffron-500/10 text-saffron-400'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pandit
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm transition-all gold-glow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Footer text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-saffron-400 hover:text-saffron-300 font-bold underline focus:outline-none bg-transparent border-none cursor-pointer"
            >
              {isLogin ? 'Sign up here' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
