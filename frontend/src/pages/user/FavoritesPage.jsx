import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import RecipeCard from '../../components/common/RecipeCard';
import { RecipeCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const FavoritesPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getFavoriteRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggleSuccess = (recipeId, nextFavoriteStatus) => {
    // Since this is the favorites page, if we toggle off favorite, we should remove it from the list immediately!
    if (!nextFavoriteStatus) {
      setRecipes(recipes.filter(r => r.id !== recipeId));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <Heart className="text-red-500 fill-red-500/20" size={24} />
          <span>My Favorite Recipes</span>
        </h2>
        <p className="text-gray-400 text-xs">A curated collection of your bookmarked cooking recipes.</p>
      </div>

      {/* Grid */}
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
              onToggleFavoriteSuccess={handleFavoriteToggleSuccess}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Favorites Bookmarked"
          message="Explore the recipe catalog and click the heart icon on any recipe to save it in this collection."
          actionText="Search Recipes"
          onActionClick={() => window.location.href = '/user/search'}
        />
      )}

    </div>
  );
};
export default FavoritesPage;
