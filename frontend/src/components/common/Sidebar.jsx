import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Grid, 
  Search, 
  Sparkles, 
  Heart, 
  BookOpen, 
  PlusCircle, 
  User, 
  LogOut,
  Users,
  Settings,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // USER Navigation
  const userNavigation = [
    { name: 'Dashboard', to: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Categories', to: '/user/categories', icon: Grid },
    { name: 'Search Recipes', to: '/user/search', icon: Search },
    { name: 'AI Recipe Generator', to: '/user/ai-generator', icon: Sparkles },
    { name: 'Favorites', to: '/user/favorites', icon: Heart },
    { name: 'My Recipes', to: '/user/my-recipes', icon: BookOpen },
    { name: 'Add Recipe', to: '/user/add-recipe', icon: PlusCircle },
    { name: 'Profile', to: '/user/profile', icon: User },
  ];

  // ADMIN Navigation
  const adminNavigation = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Recipe Management', to: '/admin/recipes', icon: FolderOpen },
    { name: 'AI Recipe Creator', to: '/admin/ai-creator', icon: Sparkles },
    { name: 'Manual Recipe Creator', to: '/admin/manual-creator', icon: PlusCircle },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Profile', to: '/admin/profile', icon: User },
  ];

  const navigation = user.role === 'ADMIN' ? adminNavigation : userNavigation;

  const activeClassName = "flex items-center space-x-3.5 px-4 py-3 bg-brand-500 text-white rounded-2xl shadow-md shadow-brand-500/20 text-sm font-semibold transition-all duration-200";
  const inactiveClassName = "flex items-center space-x-3.5 px-4 py-3 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-brand-50/30 dark:hover:bg-darkbg-850 rounded-2xl text-sm font-medium transition-all duration-200";

  const renderNavLinks = () => (
    <nav className="space-y-1.5 px-4 py-6">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
        
        return (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={onClose}
            className={isActive ? activeClassName : inactiveClassName}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-darkbg-900 border-r border-gray-100 dark:border-darkbg-800 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-5rem)] flex flex-col justify-between select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Navigation Items */}
        <div className="overflow-y-auto flex-grow">
          {renderNavLinks()}
        </div>

        {/* Footer/Logout Action */}
        <div className="p-4 border-t border-gray-50 dark:border-darkbg-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-2xl text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
