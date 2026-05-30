import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle, BookOpen, HelpCircle, Shield, Plus, Edit, Trash2, 
  TrendingUp, BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../config/api';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  
  const [activeUsersList, setActiveUsersList] = useState([]);
  const [examsList, setExamsList] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/auth/users');
        if (response.data.success && response.data.users) {
          setActiveUsersList(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchDashboardData();
  }, [user]);


  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to completely delete the account for ${name}?`)) return;
    
    try {
      const res = await api.delete(`/auth/users/${userId}`);
      if (res.status === 200 || res.data.success) {
        setActiveUsersList(activeUsersList.filter(u => u._id !== userId));
      } else {
        alert(res.data.message || 'Error deleting user');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleToggleExam = (index) => {
    const listCopy = [...examsList];
    listCopy[index].status = listCopy[index].status === 'Active' ? 'Coming Soon' : 'Active';
    setExamsList(listCopy);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl relative overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">Systems Operations</span>
          <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Admin Console Active</h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Welcome back, {user?.name || 'Administrator'}. Monitor active user stats, configure coming-soon exams toggles, and view platform metrics instantly.
          </p>
        </div>
      </motion.div>

      {/* Core Analytics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Enrolled Users', value: activeUsersList.length.toString(), icon: Users, change: 'Total Accounts', changeColor: 'text-slate-500' },
          { label: 'Active Learners', value: activeUsersList.filter(u => u.role === 'user').length.toString(), icon: CheckCircle, change: 'Student Accounts', changeColor: 'text-slate-500' },
          { label: 'Exams Configured', value: '-', icon: BookOpen, change: 'Syncing...', changeColor: 'text-slate-500' },
          { label: 'Mock Test bank', value: '-', icon: HelpCircle, change: 'Syncing...', changeColor: 'text-slate-500' }
        ].map((widget, idx) => {
          const Icon = widget.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-5 rounded-2xl flex items-center justify-between shadow-xs transition-colors duration-300">
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{widget.label}</span>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{widget.value}</h4>
                <span className={`text-[10px] font-bold block mt-1 ${widget.changeColor}`}>{widget.change}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Users Table) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Users Data Table */}
          <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-xs transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Candidates</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time candidate registrations from MERN database</p>
              </div>
              <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer border-0">
                <Plus size={14} />
                Add Candidate
              </button>
            </div>

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
                  {activeUsersList.map((usr, idx) => {
                    const isActive = true; // since it's an active registered user
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
                              className="p-1.5 rounded bg-red-500/5 border border-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Manage Exams + Analytics card) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-xs text-center flex flex-col items-center justify-center min-h-[400px]">
             <BarChart3 size={40} className="text-slate-300 dark:text-slate-700 mb-4" />
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Analytics Engine</h3>
             <p className="text-xs text-slate-400 dark:text-slate-500">Live analytics module is currently compiling historical data.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
