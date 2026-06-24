import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import AiRecipeGeneratorPage from './pages/user/AiRecipeGeneratorPage';
import CategoriesPage from './pages/user/CategoriesPage';
import FavoritesPage from './pages/user/FavoritesPage';
import MyRecipesPage from './pages/user/MyRecipesPage';
import RecipeDetailsPage from './pages/user/RecipeDetailsPage';
import SearchRecipesPage from './pages/user/SearchRecipesPage';
import UserProfilePage from './pages/user/UserProfilePage';
import AddRecipePage from './pages/user/AddRecipePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAiRecipeCreatorPage from './pages/admin/AdminAiRecipeCreatorPage';
import RecipeManagementPage from './pages/admin/RecipeManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Simple guard for admin routes since MainLayout handles basic auth
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/user/dashboard" replace />;
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (Wrapped in MainLayout) */}
        <Route path="/" element={<MainLayout />}>
          {/* User Routes */}
          <Route path="user/dashboard" element={<UserDashboard />} />
          <Route path="user/ai-generator" element={<AiRecipeGeneratorPage />} />
          <Route path="user/categories" element={<CategoriesPage />} />
          <Route path="user/favorites" element={<FavoritesPage />} />
          <Route path="user/my-recipes" element={<MyRecipesPage />} />
          <Route path="user/recipe/:id" element={<RecipeDetailsPage />} />
          <Route path="user/search" element={<SearchRecipesPage />} />
          <Route path="user/profile" element={<UserProfilePage />} />
          <Route path="user/add-recipe" element={<AddRecipePage />} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="admin/ai-creator" element={
            <AdminRoute>
              <AdminAiRecipeCreatorPage />
            </AdminRoute>
          } />
          <Route path="admin/recipes" element={
            <AdminRoute>
              <RecipeManagementPage />
            </AdminRoute>
          } />
          <Route path="admin/users" element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          } />
          <Route path="admin/manual-creator" element={
            <AdminRoute>
              <AddRecipePage />
            </AdminRoute>
          } />
          <Route path="admin/profile" element={
            <AdminRoute>
              <UserProfilePage />
            </AdminRoute>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
