import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, ShieldCheck, Calendar, Lock, AlertTriangle, 
  CheckCircle2, AlertCircle, Award, HelpCircle, Bot, Activity, LogOut, Loader2, Eye, EyeOff
} from 'lucide-react';
import api from '../../../config/api';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Profile data & loading states
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Edit Profile mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alerts
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load profile and stats dynamically on mount
  const fetchProfileData = async () => {
    try {
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setProfile(res.data.user);
        setStats(res.data.stats);
        setEditName(res.data.user.name);
        setEditPhone(res.data.user.phone || '');
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
      setProfileError('Could not load profile statistics. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Save changes to profile info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!editName.trim()) {
      setProfileError('Name is required.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', {
        name: editName,
        phone: editPhone
      });
      if (res.data.success) {
        setProfile(res.data.user);
        setProfileSuccess('Profile details updated successfully.');
        setIsEditing(false);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change security password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      if (res.data.success) {
        setPasswordSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Please check your credentials.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Helper: Get user's initials for placeholder avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading profile data...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12 text-sm text-slate-700 dark:text-slate-350"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile & Account Management</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your student profile, credentials, and track your prep statistics.</p>
      </div>

      {/* SECTION 1: PROFILE INFORMATION */}
      <section className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900/60 pb-3">
          <User className="text-blue-500" size={18} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Information</h3>
        </div>

        {profileSuccess && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Initials Avatar Bubble */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/15 flex-shrink-0">
              {getInitials(profile?.name)}
            </div>

            <div className="w-full grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={isEditing ? editName : profile?.name}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 outline-none transition-all duration-200 ${
                    isEditing 
                      ? 'bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500' 
                      : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    disabled 
                    value={profile?.email}
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-400 cursor-not-allowed outline-none"
                  />
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number (Optional)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={isEditing ? editPhone : profile?.phone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className={`w-full border rounded-xl py-3 pl-11 pr-4 outline-none transition-all duration-200 ${
                      isEditing 
                        ? 'bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-blue-500' 
                        : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-900/60">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(profile?.name || '');
                    setEditPhone(profile?.phone || '');
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 size={12} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </section>

      {/* SECTION 3: ACCOUNT SECURITY */}
      <section className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900/60 pb-3">
          <Lock className="text-blue-500" size={18} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
        </div>

        {passwordSuccess && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-4 pr-10 outline-none focus:border-blue-500 transition-all duration-200"
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-4 pr-10 outline-none focus:border-blue-500 transition-all duration-200"
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-4 pr-10 outline-none focus:border-blue-500 transition-all duration-200"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {updatingPassword ? <Loader2 size={12} className="animate-spin" /> : null}
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 4: DANGER ZONE */}
      <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-red-500/10 pb-3 text-red-500">
          <AlertTriangle size={18} />
          <h3 className="text-base font-bold">Danger Zone</h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Be careful. These operations are destructive or log you out of your current secure learning session.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-750 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>

          <button
            disabled
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-900 text-slate-400 dark:text-slate-600 font-bold text-xs rounded-xl cursor-not-allowed border border-slate-300 dark:border-slate-800"
          >
            Delete Account (Coming Soon)
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default UserSettings;
