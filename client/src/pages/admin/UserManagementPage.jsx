import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../config/api';

const UserManagementPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        if (response.data.success && response.data.users) {
          setUsersList(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };
    
    fetchUsers();
  }, [user]);


  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to completely delete the account for ${name}? They will lose all progress and no longer be able to log in.`)) return;
    
    try {
      const res = await api.delete(`/auth/users/${userId}`);
      if (res.status === 200 || res.data.success) {
        setUsersList(usersList.filter(u => u._id !== userId));
      } else {
        alert(res.data.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const filteredUsers = usersList.filter(
    u => (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
         (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registered Candidate Profiles</h3>
          <p className="text-xs text-slate-500 mt-1">Manage, search, and update roles or access privileges of learning candidates.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer border-0">
          <Plus size={14} />
          Register New Candidate
        </button>
      </div>

      {/* Search Input bar */}
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-3 rounded-2xl flex items-center gap-3">
        <Search size={16} className="text-slate-400 pl-1.5" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none w-full"
        />
      </div>

      {/* Candidates List Table */}
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Name</th>
                <th className="pb-3.5">Email</th>
                <th className="pb-3.5">Role</th>
                <th className="pb-3.5">Joined</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900/60">
              {filteredUsers.map((usr, idx) => {
                const isActive = true;
                const joinedDate = new Date(usr.createdAt).toLocaleDateString();
                return (
                  <tr key={usr._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 pl-2 font-bold text-slate-800 dark:text-slate-200">{usr.name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{usr.email}</td>
                    <td className="py-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.role === 'admin' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{joinedDate}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleDeleteUser(usr._id, usr.name)}
                          title="Delete Account"
                          className="p-1.5 rounded bg-red-500/5 border border-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500 italic">No candidates matching search query</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManagementPage;
