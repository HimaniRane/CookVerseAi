import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut, Save, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserCache } = useAuth();
  const fileInputRef = useRef(null);

  // States
  const [profileStats, setProfileStats] = useState(null);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfileStats(data);
      setName(data.name);
      if (data.profileImage) {
        setImagePreview(data.profileImage.startsWith('http') ? data.profileImage : `http://localhost:8080${data.profileImage}`);
      }
    } catch (err) {
      console.error('Failed to load profile details', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const updated = await userService.updateProfile(formData);
      updateUserCache(updated);
      setSuccess('Profile updated successfully.');
      // Refresh stats
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPwdSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password. Make sure current password is correct.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (fetchLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white flex items-center space-x-2">
          <User className="text-brand-500" size={24} />
          <span>My Profile settings</span>
        </h2>
        <p className="text-gray-400 text-xs">Update your credentials, configure profile designs, and manage passwords.</p>
      </div>

      {/* Profile statistics row */}
      <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-around shadow-sm gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500/20" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-darkbg-800 text-brand-500 dark:text-brand-400 flex items-center justify-center font-bold text-2xl uppercase border-2 border-dashed border-brand-500/20">
                {name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-1.5 bg-brand-500 text-white rounded-lg shadow-md hover:scale-105 transition-all"
              title="Upload Avatar"
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-xs text-gray-400">{profileStats?.email}</p>
            <span className="inline-block mt-1.5 bg-brand-50 dark:bg-darkbg-850 text-brand-600 dark:text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {profileStats?.role}
            </span>
          </div>
        </div>

        <div className="flex space-x-8 text-center border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-darkbg-800 pt-4 sm:pt-0 sm:pl-8">
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">Uploaded</p>
            <p className="text-2xl font-black text-gray-950 dark:text-white">{profileStats?.recipesCount}</p>
            <p className="text-[10px] text-gray-400">Recipes</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">Bookmarked</p>
            <p className="text-2xl font-black text-gray-950 dark:text-white">{profileStats?.favoritesCount}</p>
            <p className="text-[10px] text-gray-400">Favorites</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Update Details form */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-darkbg-800">
            Edit Profile Details
          </h3>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl flex items-start space-x-3 text-emerald-700 dark:text-emerald-400 text-sm">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profileStats?.email || ''}
                className="block w-full px-4 py-2.5 bg-gray-100 dark:bg-darkbg-800 border border-gray-100 dark:border-darkbg-800 rounded-xl text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all hover:scale-[1.01]"
              >
                <Save size={14} />
                <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password form */}
        <div className="bg-white dark:bg-darkbg-900 border border-gray-100 dark:border-darkbg-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-darkbg-800">
            Change Credentials Password
          </h3>

          {pwdError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl flex items-start space-x-3 text-emerald-700 dark:text-emerald-400 text-sm">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{pwdSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="•••••••• (Min. 6 characters)"
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-2.5 bg-gray-50/50 dark:bg-darkbg-850 border border-gray-100 dark:border-darkbg-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={pwdLoading}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 hover:bg-brand-600 transition-all hover:scale-[1.01]"
              >
                <Lock size={14} />
                <span>{pwdLoading ? 'Resetting Password...' : 'Reset Password'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Logout CTA */}
      <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 p-6 rounded-3xl flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-red-950 dark:text-red-400">Logout from CookVerse AI</h4>
          <p className="text-xs text-red-600/70 dark:text-red-500/60 leading-normal">This will clear your local token storage caches.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl text-xs shadow-md shadow-red-600/10 hover:scale-[1.01] transition-all"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
};
export default UserProfilePage;
