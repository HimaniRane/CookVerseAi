import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, RotateCcw, ArrowRight, AlertTriangle } from 'lucide-react';
import { recipeService } from '../../services/recipeService';

export const AdminAiRecipeCreatorPage = () => {
  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Editable fields
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCuisine, setEditCuisine] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editSteps, setEditSteps] = useState('');
  const [editCookingTime, setEditCookingTime] = useState(30);
  const [editDifficulty, setEditDifficulty] = useState('Easy');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!recipeName.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      const data = await recipeService.generateAdminAiRecipe(recipeName.trim());
      setGeneratedRecipe(data);
      
      // Initialize edit fields
      setEditTitle(data.title || recipeName);
      setEditCategory(data.category || 'Lunch');
      setEditCuisine(data.cuisine || 'Global');
      setEditDescription(data.description || '');
      setEditIngredients(data.ingredients || '');
      setEditSteps(data.steps || '');
      setEditCookingTime(data.cookingTime || 30);
      setEditDifficulty(data.difficulty || 'Easy');
    } catch (err) {
      setError('Gemini AI was unable to generate a recipe. Please refine your query name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    setSaveLoading(true);
    setError(null);

    const recipePayload = {
      title: editTitle,
      category: editCategory,
      cuisine: editCuisine,
      description: editDescription,
      ingredients: editIngredients,
      steps: editSteps,
      cookingTime: editCookingTime,
      difficulty: editDifficulty,
      imageUrl: null
    };

    try {
      await recipeService.createRecipeJson(recipePayload);
      navigate('/admin/recipes');
    } catch (err) {
      setError('Failed to save generated recipe. Make sure all fields are filled.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = () => {
    setRecipeName('');
    setGeneratedRecipe(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="text-brand-500 fill-brand-500/20" size={24} />
          <span>Admin AI Recipe Creator</span>
        </h2>
        <p className="text-gray-400 text-xs">Enter a dish title, generate ingredients and steps, and publish into the global catalog.</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 rounded-2xl flex items-start space-x-3 text-amber-700 dark:text-amber-400 text-sm">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input query form */}
      {!generatedRecipe && !loading && (
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 md:p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-1">Recipe Name</label>
              <input
                type="text"
                required
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="e.g. Chocolate Brownie, Paneer Butter Masala, Garlic Salmon"
                className="block w-full px-4 py-3 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-darkbg-900 text-sm transition-all text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!recipeName.trim()}
                className="flex items-center space-x-1.5 px-6 py-3 bg-brand-500 disabled:opacity-55 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-brand-500/10 hover:bg-brand-600 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <Sparkles size={14} fill="currentColor" />
                <span>Generate Recipe</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Oven indicator */}
      {loading && (
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-12 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-brand-50 dark:bg-darkbg-850 text-brand-500 flex items-center justify-center rounded-full mx-auto relative">
            <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="space-y-2 max-w-xs mx-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Formulating Recipe Sheets...</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Gemini AI is parsing ingredients, proportions, steps, cooking times, and categories for "{recipeName}".
            </p>
          </div>
        </div>
      )}

      {/* Generated output editor */}
      {generatedRecipe && !loading && (
        <div className="space-y-6 animate-slide-up">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider pl-1">Generated Output Review</h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center space-x-0.5"
            >
              <RotateCcw size={12} />
              <span>Generate another recipe</span>
            </button>
          </div>

          <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Recipe Name *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Cuisine</label>
                <input
                  type="text"
                  value={editCuisine}
                  onChange={(e) => setEditCuisine(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Cooking Time (Mins)</label>
                <input
                  type="number"
                  value={editCookingTime}
                  onChange={(e) => setEditCookingTime(Number(e.target.value))}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
                />
              </div>

            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Split components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Ingredients (one per line)</label>
                <textarea
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  rows={8}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Preparation steps (one per line)</label>
                <textarea
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  rows={8}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

            </div>

            {/* Save bar */}
            <div className="flex items-center justify-between border-t border-gray-50 dark:border-darkbg-800 pt-6">
              <span className="text-xs text-gray-400 italic">Review details above. Hit save to record into general databases as ADMIN.</span>
              <button
                onClick={handleSaveRecipe}
                disabled={saveLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-semibold text-xs shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all hover:scale-[1.01]"
              >
                <Save size={14} />
                <span>{saveLoading ? 'Saving recipe...' : 'Save to CookVerse'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default AdminAiRecipeCreatorPage;
