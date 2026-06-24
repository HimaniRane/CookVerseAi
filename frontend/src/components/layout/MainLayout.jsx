import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';

export const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkbg-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-darkbg-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Content Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar Drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
