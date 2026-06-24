import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Star, Edit, Trash2, Heart } from 'lucide-react';
import { recipeService } from '../../services/recipeService';

export const RecipeCard = ({ recipe, currentUser, onToggleFavoriteSuccess, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const isAuthor = currentUser && recipe.createdById === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'ADMIN';
  const canEditOrDelete = isAuthor || isAdmin;

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-950/20';
      case 'medium': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-950/20';
      case 'hard': return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-100 dark:border-red-950/20';
      default: return 'bg-gray-50 text-gray-700 dark:bg-darkbg-800 dark:text-gray-400 border-gray-100 dark:border-darkbg-800';
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setFavoriteLoading(true);
    try {
      const result = await recipeService.toggleFavorite(recipe.id);
      setIsFavorite(result);
      if (onToggleFavoriteSuccess) {
        onToggleFavoriteSuccess(recipe.id, result);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      try {
        await recipeService.deleteRecipe(recipe.id);
        if (onDeleteSuccess) {
          onDeleteSuccess(recipe.id);
        }
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  const recipeImageUrl = recipe.imageUrl
    ? (recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:8080${recipe.imageUrl}`)
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'; // high-quality cooking mockup

  return (
    <div className="group bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in relative hover:scale-[1.01]">
      
      {/* Recipe Image & Overlay */}
      <div className="h-48 overflow-hidden relative bg-gray-100 dark:bg-darkbg-850">
        <img
          src={recipeImageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category tag */}
        <span className="absolute top-4 left-4 bg-white/95 dark:bg-darkbg-900/95 backdrop-blur shadow-sm text-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full">
          {recipe.category}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            isFavorite
              ? 'bg-red-50 text-red-500'
              : 'bg-white/90 dark:bg-darkbg-900/90 text-gray-400 hover:text-red-500 dark:text-gray-400'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={favoriteLoading ? 'animate-ping' : ''} />
        </button>

        {/* Admin/Owner Actions Overlay */}
        {canEditOrDelete && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Link
              to={isAdmin ? `/admin/manual-creator?edit=${recipe.id}` : `/user/add-recipe?edit=${recipe.id}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/90 dark:bg-darkbg-900/90 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-gray-600 dark:text-gray-300 rounded-full transition-all shadow-sm"
              title="Edit Recipe"
            >
              <Edit size={14} />
            </Link>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white/90 dark:bg-darkbg-900/90 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 text-gray-600 dark:text-gray-300 rounded-full transition-all shadow-sm"
              title="Delete Recipe"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-brand-500 transition-colors">
          <Link to={`/user/recipe/${recipe.id}`}>{recipe.title}</Link>
        </h4>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {recipe.description}
        </p>

        {/* Stats and Creator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-darkbg-800 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Cooking Time */}
            <span className="flex items-center space-x-1.5 font-medium text-gray-600 dark:text-gray-300">
              <Clock size={14} className="text-brand-500" />
              <span>{recipe.cookingTime} mins</span>
            </span>

            {/* Difficulty */}
            <span className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold tracking-wide uppercase ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Author Badge */}
          <span className="italic truncate max-w-[100px]">
            by {recipe.createdByRole === 'ADMIN' ? 'Chef Admin' : (recipe.createdByName || 'User')}
          </span>
        </div>
      </div>
    </div>
  );
};
export default RecipeCard;
