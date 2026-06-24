import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Sun, Moon, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userImageUrl = user?.profileImage 
    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:8080${user.profileImage}`)
    : null;

  return (
    <nav className="h-20 border-b border-gray-100 dark:border-darkbg-800 bg-white/85 dark:bg-darkbg-900/85 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-200">
      
      {/* Brand & Hamburger */}
      <div className="flex items-center space-x-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard') : '/'} className="flex items-center space-x-2.5">
          <img src={logoImg} alt="CookVerse AI Logo" className="w-16 h-16 object-contain" />
          <span className="font-extrabold font-display text-3xl tracking-tight text-gray-900 dark:text-white">
            CookVerse <span className="text-brand-500">AI</span>
          </span>
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-darkbg-800 rounded-xl transition-all duration-200"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none p-1.5 hover:bg-gray-50 dark:hover:bg-darkbg-800 rounded-xl transition-all"
            >
              {userImageUrl ? (
                <img src={userImageUrl} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-500 dark:text-brand-400 flex items-center justify-center font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-2xl shadow-xl z-50 py-1.5 animate-slide-up origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-darkbg-800">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Logged in as</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{user.email}</p>
                    <span className="inline-block mt-1 bg-brand-50 dark:bg-darkbg-850 text-brand-600 dark:text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to={user.role === 'ADMIN' ? '/admin/profile' : '/user/profile'}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-brand-500 hover:bg-brand-50/50 dark:text-gray-300 dark:hover:text-brand-400 dark:hover:bg-darkbg-850 transition-colors"
                  >
                    <UserIcon size={14} />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors border-t border-gray-50 dark:border-darkbg-800"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
