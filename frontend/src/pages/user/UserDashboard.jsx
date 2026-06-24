import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Sparkles, UtensilsCrossed, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { recipeService } from '../../services/recipeService';
import RecipeCard from '../../components/common/RecipeCard';
import { RecipeCardSkeleton } from '../../components/common/Skeleton';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState(null);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  
  const [statsLoading, setStatsLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);

  const categories = [
    { name: 'Breakfast', emoji: '🍳', color: 'from-amber-400 to-orange-500' },
    { name: 'Lunch', emoji: '🥗', color: 'from-emerald-400 to-teal-500' },
    { name: 'Dinner', emoji: '🍝', color: 'from-blue-400 to-indigo-500' },
    { name: 'Snacks', emoji: '🍿', color: 'from-pink-400 to-rose-500' },
    { name: 'Desserts', emoji: '🍰', color: 'from-purple-400 to-violet-500' },
    { name: 'Beverages', emoji: '🍹', color: 'from-cyan-400 to-blue-500' }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getProfile();
        setProfileStats(data);
      } catch (err) {
        console.error('Failed to load user stats', err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchFeatured = async () => {
      try {
        const data = await recipeService.getAllRecipes();
        // Show up to 3 recipes
        setFeaturedRecipes(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured recipes', err);
      } finally {
        setRecipesLoading(false);
      }
    };

    fetchStats();
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-amber-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md shadow-brand-500/10">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            What are we cooking today? Search through community recipes or input ingredients in the AI Recipe Generator to generate something delicious.
          </p>
          <div className="pt-2">
            <Link
              to="/user/ai-generator"
              className="inline-flex items-center space-x-2 bg-white text-brand-600 font-semibold px-5 py-2.5 rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all text-xs md:text-sm"
            >
              <Sparkles size={14} fill="currentColor" />
              <span>Generate AI Recipe</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm transition-all hover:scale-[1.01]">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">My Uploaded Recipes</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {statsLoading ? '...' : (profileStats?.recipesCount || 0)}
            </p>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-darkbg-850 text-brand-500 rounded-2xl">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex items-center justify-between shadow-sm transition-all hover:scale-[1.01]">
          <div className="space-y-1">
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Favorite Recipes</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {statsLoading ? '...' : (profileStats?.favoritesCount || 0)}
            </p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-darkbg-850 text-red-500 rounded-2xl">
            <Heart size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Categories Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-gray-950 dark:text-white">Browse Categories</h3>
          <Link to="/user/categories" className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center space-x-0.5">
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/user/categories?cat=${cat.name}`}
              className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-5 rounded-2xl text-center hover:border-brand-500 shadow-sm transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-lg bg-gray-50 dark:bg-darkbg-800 group-hover:scale-110 transition-transform">
                {cat.emoji}
              </div>
              <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Recipes Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-gray-950 dark:text-white">Featured Recipes</h3>
          <Link to="/user/search" className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center space-x-0.5">
            <span>Explore Catalog</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recipesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        ) : featuredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                currentUser={user}
                onToggleFavoriteSuccess={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-12 text-center text-gray-400 dark:text-gray-500">
            <UtensilsCrossed size={40} className="mx-auto stroke-[1.2] mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-medium">No recipes registered yet.</p>
            <Link to="/user/add-recipe" className="mt-3 inline-block text-xs font-bold text-brand-500 hover:text-brand-600">
              Create the first recipe
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
export default UserDashboard;
