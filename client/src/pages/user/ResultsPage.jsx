import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as mockTestService from '../../services/mockTestService';

const ResultsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const data = await mockTestService.getMyAttempts(token);
      setAttempts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-900 text-white p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Target size={240} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your Results</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
            Review your past mock test performances and identify areas for improvement.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <p className="text-center py-10 dark:text-white">Loading your results...</p>
      ) : attempts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tests taken yet</h3>
          <p className="text-slate-500">Take a mock test to see your results here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attempts.map(attempt => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={attempt._id}
              onClick={() => navigate(`/dashboard/results/${attempt._id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 line-clamp-2">{attempt.test?.title || 'Unknown Test'}</h3>
              
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Score</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{attempt.score} <span className="text-sm font-medium text-slate-400">/ {attempt.totalMarks}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className={`text-xl font-black ${attempt.percentage >= 80 ? 'text-green-500' : attempt.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                    {attempt.percentage}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
