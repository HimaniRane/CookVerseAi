import api from './api';

export const recipeService = {
  getAllRecipes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.ingredient) params.append('ingredient', filters.ingredient);
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await api.get(`/api/recipes?${params.toString()}`);
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await api.get(`/api/recipes/${id}`);
    return response.data;
  },

  getRecipesByCategory: async (category) => {
    const response = await api.get(`/api/recipes/category/${category}`);
    return response.data;
  },

  getMyRecipes: async () => {
    const response = await api.get('/api/recipes/my-recipes');
    return response.data;
  },

  getFavoriteRecipes: async () => {
    const response = await api.get('/api/recipes/favorites');
    return response.data;
  },

  createRecipe: async (formData) => {
    const response = await api.post('/api/recipes/manual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createRecipeJson: async (recipeDto) => {
    const response = await api.post('/api/recipes', recipeDto);
    return response.data;
  },

  updateRecipe: async (id, formData) => {
    const response = await api.put(`/api/recipes/${id}/manual`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateRecipeJson: async (id, recipeDto) => {
    const response = await api.put(`/api/recipes/${id}`, recipeDto);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/api/recipes/${id}`);
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await api.post(`/api/recipes/${id}/favorite`);
    return response.data; // Returns boolean (isFavorite status after toggle)
  },

  // AI Recipes
  generateAiRecipe: async (ingredients, title) => {
    const response = await api.post('/api/ai/generate', { ingredients, title });
    return response.data;
  },

  generateAdminAiRecipe: async (title) => {
    const response = await api.post('/api/ai/admin-create', { title });
    return response.data;
  },

  translateRecipe: async (recipeData, targetLanguage) => {
    const response = await api.post('/api/ai/translate', {
      title: recipeData.title,
      cuisine: recipeData.cuisine,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      targetLanguage
    });
    return response.data;
  }
};
