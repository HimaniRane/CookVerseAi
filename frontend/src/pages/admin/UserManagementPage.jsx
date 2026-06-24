import React, { useState, useEffect } from 'react';
import { Users, Trash2, Search, Shield, User } from 'lucide-react';
import api from '../../services/api';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their recipes will be lost.')) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="text-brand-500" size={24} />
            <span>User Management</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">View and manage all registered accounts on CookVerse AI.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{users.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-full flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admins</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {users.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-darkbg-850 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-darkbg-850 border-b border-gray-100 dark:border-darkbg-800">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-gray-400">User</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-gray-400">Email</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-gray-400">Role</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-gray-400">Joined</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-darkbg-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-xs">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-xs">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-darkbg-850/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30' 
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
