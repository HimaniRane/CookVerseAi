import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, Image as ImageIcon, ArrowLeft, AlertTriangle } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';

export const AddRecipePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const fileInputRef = useRef(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState(30);
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Preview State
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Load details if editing
  useEffect(() => {
    if (editId) {
      const fetchEditRecipe = async () => {
        setFetchLoading(true);
        setError(null);
        try {
          const data = await recipeService.getRecipeById(editId);
          // Check security: user can only edit their own recipes (Admin can edit all)
          if (user.role !== 'ADMIN' && data.createdById !== user.id) {
            setError('You do not have authorization to edit this recipe.');
            return;
          }
          setTitle(data.title);
          setCategory(data.category);
          setCuisine(data.cuisine);
          setDescription(data.description);
          setCookingTime(data.cookingTime);
          setDifficulty(data.difficulty);
          setIngredients(data.ingredients);
          setSteps(data.steps);
          if (data.imageUrl) {
            setExistingImageUrl(data.imageUrl);
            setImagePreview(data.imageUrl.startsWith('http') ? data.imageUrl : `http://localhost:8080${data.imageUrl}`);
          }
        } catch (err) {
          setError('Failed to retrieve edit recipe details.');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchEditRecipe();
    }
  }, [editId, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!title || !cuisine || !description || !ingredients || !steps || !cookingTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if (cookingTime <= 0) {
      setError('Cooking time must be a positive number.');
      return;
    }

    setLoading(true);

    // Build form data
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('category', category);
    formData.append('cuisine', cuisine.trim());
    formData.append('description', description.trim());
    formData.append('cookingTime', cookingTime);
    formData.append('difficulty', difficulty);
    formData.append('ingredients', ingredients.trim());
    formData.append('steps', steps.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editId) {
        await recipeService.updateRecipe(editId, formData);
      } else {
        await recipeService.createRecipe(formData);
      }
      navigate(user.role === 'ADMIN' ? '/admin/recipes' : '/user/my-recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit recipe. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 text-gray-500 hover:text-brand-500 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white">
            {editId ? 'Edit Recipe' : 'Add New Recipe'}
          </h2>
          <p className="text-gray-400 text-xs">Assemble your cooking steps and details into your public cookbook.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column inputs */}
        <div className="lg:col-span-8 bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Recipe Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grandma's Chocolate chip Cookies"
              className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Cuisine */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Cuisine *</label>
              <input
                type="text"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Italian, French, Fusion"
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Cooking Time (Mins) *</label>
              <input
                type="number"
                required
                min={1}
                value={cookingTime}
                onChange={(e) => setCookingTime(Number(e.target.value))}
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Short Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief, appetizing summary about this cooking creation..."
              className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Ingredients list */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Ingredients (One per line) *</label>
            <textarea
              required
              rows={6}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g.&#13;2 cups flour&#13;1 tsp baking soda&#13;1 cup melted chocolate"
              className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono text-gray-900 dark:text-white"
            />
          </div>

          {/* Steps list */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Preparation steps (One per line) *</label>
            <textarea
              required
              rows={8}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g.&#13;Preheat oven to 350 degrees F.&#13;In a large bowl, whisk butter and brown sugar.&#13;Bake for 12 minutes until cookies are set."
              className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono text-gray-900 dark:text-white"
            />
          </div>

        </div>

        {/* Right column sidebar (Image / Difficulty / Save) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Image Upload Box */}
          <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-1">Recipe Image</h4>
            
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-darkbg-800 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white text-xs font-semibold rounded-full hover:scale-105 transition-all text-gray-700 shadow-sm"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-darkbg-800 rounded-2xl p-8 text-center text-gray-400 hover:border-brand-500 hover:bg-brand-50/10 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]"
              >
                <ImageIcon size={32} className="stroke-[1.2] mb-3 text-gray-300 dark:text-gray-700" />
                <span className="text-xs font-semibold">Drag & Drop Image</span>
                <span className="text-[10px] text-gray-400 mt-1">Or click to select files</span>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Difficulty Box */}
          <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pl-1">Cooking Difficulty</h4>
            <div className="flex gap-2">
              {difficulties.map(diff => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-3 text-xs font-bold rounded-2xl border text-center transition-all ${
                    difficulty === diff
                      ? 'bg-brand-500 text-white border-transparent shadow-md shadow-brand-500/10 hover:bg-brand-600 scale-[1.01]'
                      : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-500 hover:text-gray-700 dark:bg-darkbg-900 dark:border-darkbg-800 dark:text-gray-400 dark:hover:bg-darkbg-850'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-500/10 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-55"
            >
              <Save size={16} />
              <span>{loading ? 'Submitting Recipe...' : (editId ? 'Update Recipe' : 'Publish Recipe')}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-4 text-sm font-semibold text-center border border-gray-200 hover:bg-gray-50 dark:border-darkbg-800 dark:hover:bg-darkbg-850 text-gray-500 dark:text-gray-400 rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};
export default AddRecipePage;
