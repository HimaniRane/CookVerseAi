import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Filter, Utensils } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import RecipeCard from '../../components/common/RecipeCard';
import { RecipeCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const SearchRecipesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input states
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [ingredient, setIngredient] = useState(searchParams.get('ingredient') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const fetchFilteredRecipes = async () => {
    setLoading(true);
    try {
      const filters = { title, ingredient, category, difficulty };
      const data = await recipeService.getAllRecipes(filters);
      setRecipes(data);
    } catch (err) {
      console.error('Failed to search recipes', err);
    } finally {
      setLoading(false);
    }
  };

  // Run search on page load or filter changes
  useEffect(() => {
    fetchFilteredRecipes();
  }, [category, difficulty]); // Autofetch when selects change

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Update search params in URL
    const params = {};
    if (title) params.title = title;
    if (ingredient) params.ingredient = ingredient;
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    setSearchParams(params);

    fetchFilteredRecipes();
  };

  const handleReset = () => {
    setTitle('');
    setIngredient('');
    setCategory('');
    setDifficulty('');
    setSearchParams({});
    setLoading(true);
    recipeService.getAllRecipes().then(data => {
      setRecipes(data);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white">Discover Recipes</h2>
        <p className="text-gray-400 text-xs">Search our catalog using titles, ingredients, and categories filters.</p>
      </div>

      {/* Filter Card Form */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Recipe Name</label>
              <div className="relative rounded-xl">
                <input
                  type="text"
                  placeholder="e.g. Pancake, Salmon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Ingredient Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Ingredient</label>
              <input
                type="text"
                placeholder="e.g. Cheese, Tomato"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
              >
                <option value="">All Difficulties</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-darkbg-800 dark:hover:bg-darkbg-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all duration-200"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 transition-all duration-200 hover:scale-[1.01]"
            >
              <Search size={13} />
              <span>Apply Filters</span>
            </button>
          </div>

        </form>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUser={user}
              onToggleFavoriteSuccess={() => {}}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Match Found"
          message="We couldn't find any recipes matching your current filter keywords. Try broadening your terms or clear the filter attributes."
          actionText="Clear Filters"
          onActionClick={handleReset}
        />
      )}

    </div>
  );
};
export default SearchRecipesPage;
