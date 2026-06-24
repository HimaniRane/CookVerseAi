import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Heart, Edit, Trash2, ArrowLeft, UtensilsCrossed, Calendar } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import { RecipeDetailsSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

export const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Translation States
  const [selectedLang, setSelectedLang] = useState('');
  const [translatedRecipe, setTranslatedRecipe] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const isAuthor = user && recipe && recipe.createdById === user.id;
  const isAdmin = user && user.role === 'ADMIN';
  const canEditOrDelete = isAuthor || isAdmin;

  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError(null);
    setSelectedLang('');
    setTranslatedRecipe(null);
    setTranslationError(null);
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
      setIsFavorite(data.isFavorite);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve recipe details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      const res = await recipeService.toggleFavorite(recipe.id);
      setIsFavorite(res);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${recipe.title}"?`)) {
      try {
        await recipeService.deleteRecipe(recipe.id);
        navigate(user.role === 'ADMIN' ? '/admin/recipes' : '/user/my-recipes');
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  const handleLanguageChange = async (lang) => {
    setSelectedLang(lang);
    setTranslationError(null);
    if (!lang) {
      setTranslatedRecipe(null);
      return;
    }

    setTranslating(true);
    try {
      const data = await recipeService.translateRecipe(recipe, lang);
      setTranslatedRecipe(data);
    } catch (err) {
      setTranslationError('Failed to translate recipe. Please try again.');
      setSelectedLang('');
    } finally {
      setTranslating(false);
    }
  };

  if (loading) return <RecipeDetailsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchRecipeDetails} />;
  if (!recipe) return <ErrorState title="Recipe Not Found" message="The recipe you requested could not be located in our system." />;

  const currentRecipe = translatedRecipe || recipe;

  const ingredientsList = currentRecipe.ingredients
    ? currentRecipe.ingredients.split('\n').filter(line => line.trim().length > 0)
    : [];
  
  const stepsList = currentRecipe.steps
    ? currentRecipe.steps.split('\n').filter(line => line.trim().length > 0)
    : [];

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-950/20';
      case 'medium': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-950/20';
      case 'hard': return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-100 dark:border-red-950/20';
      default: return 'bg-gray-50 text-gray-700 dark:bg-darkbg-800 dark:text-gray-400 border-gray-100 dark:border-darkbg-800';
    }
  };

  const recipeImageUrl = recipe.imageUrl
    ? (recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:8080${recipe.imageUrl}`)
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* Translating Indicator */}
          {translating && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-50 dark:bg-darkbg-850 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-semibold animate-pulse-subtle">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping" />
              <span>Translating...</span>
            </div>
          )}

          {/* Translation Dropdown */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={translating}
              className="px-3.5 py-2.5 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="">Original Language</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Arabic">العربية (Arabic)</option>
              <option value="Chinese">中文 (Chinese)</option>
              <option value="Italian">Italiano (Italian)</option>
            </select>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              isFavorite
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-950/30'
                : 'bg-white dark:bg-darkbg-900 border-gray-100 dark:border-darkbg-800 text-gray-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>

          {/* Edit / Delete actions */}
          {canEditOrDelete && (
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-darkbg-800 pl-3">
              <Link
                to={isAdmin ? `/admin/manual-creator?edit=${recipe.id}` : `/user/add-recipe?edit=${recipe.id}`}
                className="flex items-center space-x-1.5 px-3 py-2.5 bg-gray-100 dark:bg-darkbg-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-gray-600 dark:text-gray-300 rounded-xl text-xs transition-all font-semibold"
              >
                <Edit size={14} />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-950/10 dark:hover:bg-red-500 text-red-600 dark:text-red-400 rounded-xl text-xs transition-all font-semibold"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Translation Error Alert */}
      {translationError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm animate-fade-in">
          <span>{translationError}</span>
        </div>
      )}

      {/* Hero card & image */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-64 md:h-96 relative bg-gray-100 dark:bg-darkbg-850">
          <img
            src={recipeImageUrl}
            alt={currentRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          {/* Tags on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="bg-brand-500 px-3 py-1 rounded-full">{recipe.category}</span>
              <span className="bg-white/25 backdrop-blur px-3 py-1 rounded-full">{currentRecipe.cuisine}</span>
              <span className={`px-3 py-1 border rounded-full ${getDifficultyColor(recipe.difficulty)} border-none text-white bg-black/40`}>
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">{currentRecipe.title}</h1>
            <div className="flex items-center space-x-6 text-xs text-white/80 pt-1">
              <span className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{recipe.cookingTime} Minutes cooking time</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Created {new Date(recipe.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 md:p-8 border-t border-gray-50 dark:border-darkbg-800">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            {currentRecipe.description}
          </p>
        </div>
      </div>

      {/* Preparation ingredients & steps columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Ingredients Column */}
        <div className="md:col-span-1 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 shadow-sm h-fit space-y-4">
          <h3 className="text-base font-bold text-gray-950 dark:text-white pb-3 border-b border-gray-50 dark:border-darkbg-800">
            Ingredients
          </h3>
          <ul className="space-y-3">
            {ingredientsList.map((item, i) => (
              <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-350 leading-relaxed pl-1.5 border-l-2 border-brand-500/60">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps Column */}
        <div className="md:col-span-2 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-950 dark:text-white pb-3 border-b border-gray-50 dark:border-darkbg-800">
            Cooking Instructions
          </h3>
          <div className="space-y-6">
            {stepsList.map((step, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-darkbg-800 text-brand-600 dark:text-brand-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {step.replace(/^\d+\.\s*/, '')} {/* Strip leading numbers if parsed twice */}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default RecipeDetailsPage;
