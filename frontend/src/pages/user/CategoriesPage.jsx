import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import RecipeCard from '../../components/common/RecipeCard';
import { RecipeCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const CategoriesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat');

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'Breakfast', emoji: '🍳', desc: 'Savor pancake stacks, toasted bagels, omelets, and morning smoothies.', countName: 'Breakfast' },
    { name: 'Lunch', emoji: '🥗', desc: 'Gourmet grain bowls, chopped salads, warm wraps, and midday energy.', countName: 'Lunch' },
    { name: 'Dinner', emoji: '🍝', desc: 'Delicious pasta dishes, roasted protein, hearty side plates, and soups.', countName: 'Dinner' },
    { name: 'Snacks', emoji: '🍿', desc: 'Quick snack foods, popcorn blends, nut mixtures, and bite-sized delights.', countName: 'Snacks' },
    { name: 'Desserts', emoji: '🍰', desc: 'Decadent chocolate brownies, cakes, creamy puddings, and cookies.', countName: 'Desserts' },
    { name: 'Beverages', emoji: '🍹', desc: 'Chilled fruit mocktails, hot coffee brews, green teas, and juices.', countName: 'Beverages' }
  ];

  useEffect(() => {
    if (activeCategory) {
      const fetchCategoryRecipes = async () => {
        setLoading(true);
        try {
          const data = await recipeService.getRecipesByCategory(activeCategory);
          setRecipes(data);
        } catch (err) {
          console.error('Failed to load category recipes', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoryRecipes();
    }
  }, [activeCategory]);

  const handleCategorySelect = (catName) => {
    setSearchParams({ cat: catName });
  };

  const handleBack = () => {
    setSearchParams({});
  };

  if (activeCategory) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 text-gray-500 hover:text-brand-500 rounded-xl shadow-sm hover:scale-105 transition-all"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white">
              {activeCategory} Recipes
            </h2>
            <p className="text-gray-400 text-xs">Explore all cooking guides tagged with {activeCategory.toLowerCase()}.</p>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            title="No Recipes Found"
            message={`We couldn't find any recipes inside "${activeCategory}". Be the first to create one!`}
            actionText={`Add Manual Recipe`}
            onActionClick={() => handleCategorySelect(null)} // Go back or write redirect to manual adder
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white">Recipe Categories</h2>
        <p className="text-gray-400 text-xs">Choose a category to browse specific cooking instructions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => handleCategorySelect(cat.name)}
            className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-8 hover:border-brand-500 hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-gray-50 dark:bg-darkbg-800 text-3xl flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              {cat.emoji}
            </div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white group-hover:text-brand-500 transition-colors mb-2">
              {cat.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;
