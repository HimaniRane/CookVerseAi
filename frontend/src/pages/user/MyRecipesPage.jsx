import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import RecipeCard from '../../components/common/RecipeCard';
import { RecipeCardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const MyRecipesPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getMyRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to load my recipes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleDeleteSuccess = (deletedRecipeId) => {
    setRecipes(recipes.filter(r => r.id !== deletedRecipeId));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <BookOpen className="text-brand-500" size={24} />
          <span>My Uploaded Recipes</span>
        </h2>
        <p className="text-gray-400 text-xs">Manage, edit, and moderate cooking instructions submitted by your account.</p>
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
              onToggleFavoriteSuccess={() => {}}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your Cookbook is Empty"
          message="Create and upload your favorite recipes manually or generate one with our AI tool."
          actionText="Create Manual Recipe"
          onActionClick={() => window.location.href = '/user/add-recipe'}
        />
      )}

    </div>
  );
};
export default MyRecipesPage;
