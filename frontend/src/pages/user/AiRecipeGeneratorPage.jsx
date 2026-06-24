import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, X, ArrowRight, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { recipeService } from '../../services/recipeService';

export const AiRecipeGeneratorPage = () => {
  const navigate = useNavigate();
  
  // Mode Selection: 'ingredients' or 'name'
  const [genMode, setGenMode] = useState('ingredients');
  
  // Ingredients Mode States
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  
  // Dish Name Mode States
  const [dishName, setDishName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // For editing AI response before saving
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCuisine, setEditCuisine] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editSteps, setEditSteps] = useState('');
  const [editCookingTime, setEditCookingTime] = useState(30);
  const [editDifficulty, setEditDifficulty] = useState('Easy');

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const cleanInput = ingredientInput.trim().replace(/,$/, '');
    if (cleanInput && !ingredients.includes(cleanInput)) {
      setIngredients([...ingredients, cleanInput]);
      setIngredientInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddIngredient(e);
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerate = async () => {
    if (genMode === 'ingredients' && ingredients.length === 0) return;
    if (genMode === 'name' && !dishName.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      let data;
      if (genMode === 'ingredients') {
        const ingredientsString = ingredients.join(', ');
        data = await recipeService.generateAiRecipe(ingredientsString, null);
      } else {
        data = await recipeService.generateAiRecipe(null, dishName.trim());
      }
      setGeneratedRecipe(data);
      
      // Initialize edit fields
      setEditTitle(data.title);
      setEditCategory(data.category || 'Lunch');
      setEditCuisine(data.cuisine || 'Global');
      setEditDescription(data.description || '');
      setEditIngredients(data.ingredients || '');
      setEditSteps(data.steps || '');
      setEditCookingTime(data.cookingTime || 30);
      setEditDifficulty(data.difficulty || 'Easy');
    } catch (err) {
      setError('Gemini AI was unable to structure your recipe. Please refine your inputs and try again.');
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
      imageUrl: null // Generated recipes default to default image URL
    };

    try {
      const saved = await recipeService.createRecipeJson(recipePayload);
      navigate(`/user/recipe/${saved.id}`);
    } catch (err) {
      setError('Failed to save the generated recipe. Check if all required fields are filled.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = () => {
    setIngredients([]);
    setDishName('');
    setGeneratedRecipe(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="text-brand-500 fill-brand-500/20" size={24} />
          <span>AI Recipe Generator</span>
        </h2>
        <p className="text-gray-400 text-xs">Enter your available ingredients or directly type a dish name, and watch Google Gemini AI construct custom meals.</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 rounded-2xl flex items-start space-x-3 text-amber-700 dark:text-amber-400 text-sm">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode Selector Tabs */}
      {!generatedRecipe && !loading && (
        <div className="flex border-b border-gray-100 dark:border-darkbg-800">
          <button
            onClick={() => { setGenMode('ingredients'); handleReset(); }}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${
              genMode === 'ingredients'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Generate by Ingredients
          </button>
          <button
            onClick={() => { setGenMode('name'); handleReset(); }}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${
              genMode === 'name'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Generate by Recipe Name
          </button>
        </div>
      )}

      {/* Inputs panel */}
      {!generatedRecipe && !loading && (
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          
          {genMode === 'ingredients' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">What ingredients do you have?</h3>
                <p className="text-xs text-gray-400">Add food items individually by pressing Enter or typing a comma.</p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="flex rounded-2xl border border-gray-100 dark:border-darkbg-800 bg-gray-50/50 dark:bg-darkbg-850 p-1.5 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. paneer, onion, tomato"
                    className="flex-grow bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-all duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 min-h-12 border border-dashed border-gray-100 dark:border-darkbg-800 rounded-2xl p-4 bg-white/50 dark:bg-darkbg-900/50">
                  {ingredients.length > 0 ? (
                    ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded-full border border-brand-100 dark:border-brand-950/20"
                      >
                        <span>{ing}</span>
                        <button onClick={() => handleRemoveIngredient(i)} className="hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 self-center mx-auto italic">Add ingredients to get started...</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  {ingredients.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 dark:bg-darkbg-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-all"
                    >
                      <RotateCcw size={12} />
                      <span>Clear All</span>
                    </button>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={ingredients.length === 0}
                    className="flex items-center space-x-1.5 px-6 py-3 bg-brand-500 disabled:opacity-55 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-brand-500/10 hover:bg-brand-600 hover:scale-[1.01] active:scale-95 transition-all"
                  >
                    <Sparkles size={14} fill="currentColor" />
                    <span>Generate Recipe</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">What dish do you want to cook?</h3>
                <p className="text-xs text-gray-400">Enter a direct recipe name to let Google Gemini AI build the recipe automatically.</p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Recipe / Dish Name</label>
                  <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g. Chocolate Lava Mug Cake, Garlic Butter Salmon"
                    className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white transition-all"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  {dishName.trim() && (
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 dark:bg-darkbg-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-all"
                    >
                      <RotateCcw size={12} />
                      <span>Clear Name</span>
                    </button>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={!dishName.trim()}
                    className="flex items-center space-x-1.5 px-6 py-3 bg-brand-500 disabled:opacity-55 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-brand-500/10 hover:bg-brand-600 hover:scale-[1.01] active:scale-95 transition-all"
                  >
                    <Sparkles size={14} fill="currentColor" />
                    <span>Generate Recipe</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Screen */}
      {loading && (
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-12 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-brand-50 dark:bg-darkbg-850 text-brand-500 flex items-center justify-center rounded-full mx-auto relative">
            <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="space-y-2 max-w-xs mx-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preheating the AI Oven...</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Google Gemini is parsing your inputs to construct steps, proportions, and categories. This takes about 5 seconds.
            </p>
          </div>
        </div>
      )}

      {/* Generated output */}
      {generatedRecipe && !loading && (
        <div className="space-y-6 animate-slide-up">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-display flex items-center space-x-1.5">
              <span>Chef's Choice Recipe</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center space-x-0.5"
            >
              <RotateCcw size={12} />
              <span>Restart Generator</span>
            </button>
          </div>

          <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Title / Meta inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Recipe Name</label>
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

            {/* Ingredients & Steps split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ingredients area */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Ingredients (one per line)</label>
                <textarea
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  rows={8}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

              {/* Steps area */}
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
              <span className="text-xs text-gray-400 italic">Review details above. Hit save to record into My Recipes.</span>
              <button
                onClick={handleSaveRecipe}
                disabled={saveLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-brand-500 text-white rounded-2xl font-semibold text-xs shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all hover:scale-[1.01]"
              >
                <Save size={14} />
                <span>{saveLoading ? 'Saving recipe...' : 'Save to My Recipes'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default AiRecipeGeneratorPage;
