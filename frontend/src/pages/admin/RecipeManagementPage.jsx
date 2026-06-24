import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit, Trash2, RotateCcw, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { recipeService } from '../../services/recipeService';

export const RecipeManagementPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all to slice client-side (or pass criteria)
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Failed to retrieve system recipes list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (recipeId, recipeTitle) => {
    if (window.confirm(`Are you sure you want to permanently delete "${recipeTitle}"?`)) {
      try {
        await recipeService.deleteRecipe(recipeId);
        setRecipes(recipes.filter(r => r.id !== recipeId));
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDifficultyFilter('');
    setCurrentPage(1);
  };

  // Filter recipes client-side for immediate responsive searches
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? recipe.category === categoryFilter : true;
    const matchesDifficulty = difficultyFilter ? recipe.difficulty === difficultyFilter : true;
    return matchesTitle && matchesCategory && matchesDifficulty;
  });

  // Pagination bounds
  const totalItems = filteredRecipes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white">Recipe Management</h2>
        <p className="text-gray-400 text-xs">Moderate, view, and remove any recipe submitted by community users.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-grow max-w-3xl">
          {/* Keyword Search */}
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="block w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="block w-full px-4 py-2 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Difficulty Selector */}
          <select
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentPage(1); }}
            className="block w-full px-4 py-2 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-gray-900 dark:text-white"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 dark:border-darkbg-800 text-gray-500 hover:text-brand-500 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-all w-full md:w-auto justify-center"
        >
          <RotateCcw size={12} />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
        
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs text-gray-400">Loading recipe sheets...</span>
          </div>
        ) : paginatedRecipes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-darkbg-850 text-gray-400 dark:text-gray-500 font-bold uppercase border-b border-gray-100 dark:border-darkbg-800 text-[10px] tracking-wider">
                  <th className="px-6 py-4">Recipe Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Created By</th>
                  <th className="px-6 py-4">Author Role</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-darkbg-800 text-gray-700 dark:text-gray-300">
                {paginatedRecipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-brand-50/10 dark:hover:bg-darkbg-850/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white truncate max-w-[180px]">
                      {recipe.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-50 dark:bg-darkbg-800 text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full font-semibold">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 italic truncate max-w-[120px]">
                      {recipe.createdByName || 'User'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        recipe.createdByRole === 'ADMIN'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}>
                        {recipe.createdByRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/user/recipe/${recipe.id}`}
                          className="p-1.5 hover:bg-brand-50 hover:text-brand-500 rounded-lg text-gray-400 dark:hover:bg-darkbg-800 dark:hover:text-brand-400 transition-all"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/manual-creator?edit=${recipe.id}`}
                          className="p-1.5 hover:bg-amber-50 hover:text-amber-600 rounded-lg text-gray-400 dark:hover:bg-darkbg-800 dark:hover:text-amber-400 transition-all"
                          title="Edit Recipe"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe.id, recipe.title)}
                          className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-400 dark:hover:bg-darkbg-800 dark:hover:text-red-400 transition-all"
                          title="Delete Recipe"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <span className="text-sm">No recipes found in the logs.</span>
          </div>
        )}

        {/* Pagination Toolbar */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-darkbg-850 border-t border-gray-100 dark:border-darkbg-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold select-none">
            <span>
              Showing {startIndex + 1} to {endIndex} of {totalItems} Recipes
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 bg-white dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-800 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-7 h-7 rounded-lg border text-center transition-all ${
                    currentPage === idx + 1
                      ? 'bg-brand-500 text-white border-transparent'
                      : 'bg-white dark:bg-darkbg-900 border-gray-200 dark:border-darkbg-800 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white dark:bg-darkbg-900 border border-gray-200 dark:border-darkbg-800 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export default RecipeManagementPage;
