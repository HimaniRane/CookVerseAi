import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Update cached details in localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.name = response.data.name;
      user.profileImage = response.data.profileImage;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/api/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Admin Operations
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  }
};
