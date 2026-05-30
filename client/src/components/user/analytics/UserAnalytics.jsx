import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const UserAnalytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border-4 border-indigo-100 dark:border-slate-800">
        <Trophy size={40} className="text-indigo-400 dark:text-slate-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Module</h2>
      <p className="text-slate-500 max-w-md mx-auto">This module is currently under development. Soon you will be able to track your real-time syllabus mastery, state rankings, and study hour distribution here!</p>
    </motion.div>
  );
};

export default UserAnalytics;
