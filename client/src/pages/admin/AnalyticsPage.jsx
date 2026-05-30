import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Platform System Metrics</h3>
        <p className="text-xs text-slate-500 mt-1">Review registrations growth charts and test submissions logs.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-8 rounded-3xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-950 flex items-center justify-center text-indigo-500 mx-auto">
          <TrendingUp size={20} />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Central Operations Statistics Overview</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Platform-wide traffic log monitors are currently synchronizing with the database...
        </p>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
