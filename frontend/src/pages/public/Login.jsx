import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if session expired warning passed in URL
  useEffect(() => {
    if (searchParams.get('expired')) {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Populate email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg-950 flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Left Pane: Branding Info */}
      <div className="md:w-1/2 bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex flex-col justify-start items-center p-12 md:p-20 pt-8 md:pt-12 relative overflow-hidden shadow-2xl">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative flex flex-col items-center text-center space-y-8 max-w-lg">
          <Link to="/" className="flex flex-col items-center space-y-4 group">
            <img src={logoImg} alt="CookVerse AI Logo" className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
            <span className="font-extrabold font-display text-3xl tracking-tight text-white">
              CookVerse <span className="text-black/30 dark:text-white/40">AI</span>
            </span>
          </Link>
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black font-display leading-[1.25]">
              Welcome Back to the Kitchen
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
              Sign in to access your personalized cookbooks, meal plans, and customized AI recipe generation.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 bg-white dark:bg-darkbg-900 transition-colors duration-200">
        <div className="mx-auto w-full max-w-md space-y-8 animate-slide-up">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
              Welcome back
            </h2>
            <p className="mt-2.5 text-sm text-gray-500 dark:text-gray-400">
              Or{' '}
              <Link to="/register" className="font-bold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400">
                create a free cookbook account
              </Link>
            </p>
          </div>

          <div className="py-2">
            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Email Address
                </label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Password
                  </label>
                  <Link
                    to="#"
                    onClick={() => alert('Demo Feature: Use email admin@cookverse.com and password admin123, or user@cookverse.com and password user123.')}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4.5 w-4.5 text-brand-500 focus:ring-brand-500 border-gray-200 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-500/10 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-55"
                >
                  <span>{loading ? 'Verifying...' : 'Sign In'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
