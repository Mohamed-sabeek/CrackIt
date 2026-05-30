import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Database, LayoutList } from 'lucide-react';
import QuestionBankTab from '../../components/admin/mocktests/QuestionBankTab';
import TestsTab from '../../components/admin/mocktests/TestsTab';

const MockTestsManagementPage = () => {
  const [activeTab, setActiveTab] = useState('tests');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-indigo-500" /> Mock Tests & Practice
          </h3>
          <p className="text-sm text-slate-500 mt-1">Manage question banks and build interactive mock tests.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'tests' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <LayoutList size={16} />
            Tests
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'questions' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Database size={16} />
            Question Bank
          </button>
        </div>
      </div>

      {activeTab === 'tests' ? <TestsTab /> : <QuestionBankTab />}
      
    </motion.div>
  );
};

export default MockTestsManagementPage;
