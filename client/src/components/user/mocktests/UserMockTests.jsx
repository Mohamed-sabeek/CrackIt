import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as mockTestService from '../../../services/mockTestService';
import { useAuth } from '../../../hooks/useAuth';
import PageHeader from '../../common/PageHeader';

const UserMockTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, [activeTab]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await mockTestService.getTests({ testType: activeTab }, token);
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      <PageHeader 
        title="Practice Center" 
        description="Enhance your preparation with daily practice, subject-wise tests, and full mock exams." 
      />

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-fit mx-auto shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {['daily', 'subject', 'full'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`snap-center flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all min-h-[44px] min-w-max ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab} Tests
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-10 dark:text-white">Loading tests...</p>
      ) : tests.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tests available</h3>
          <p className="text-slate-500">Check back later for new {activeTab} tests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={test._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <HelpCircle size={24} />
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {test.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{test.title}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{test.description}</p>
              
              <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-indigo-500" />
                  {test.totalQuestions} Qs
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-indigo-500" />
                  {test.duration} mins
                </div>
              </div>

              <button 
                onClick={() => navigate(`/mock-tests/${test._id}`)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors min-h-[44px]"
              >
                <PlayCircle size={18} />
                Start Test
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMockTests;
