import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TestSummaryPage = () => {
  const { id } = useParams(); // attemptId
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary;

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <button onClick={() => navigate('/dashboard/results')} className="text-indigo-600 font-bold">Go to Results</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 text-center"
      >
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center rounded-full mx-auto mb-6">
          <Target size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Test Submitted!</h1>
        <p className="text-slate-500 mb-8">Here is your quick performance summary.</p>

        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800">
          <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
            {summary.score} / {summary.totalMarks}
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Accuracy: {summary.percentage}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.correctAnswers}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Correct</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl flex flex-col items-center">
            <XCircle className="text-red-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.wrongAnswers}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wrong</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/dashboard/results/${id}`)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            View Full Analysis <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => navigate('/dashboard/mocktests')}
            className="w-full py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Mock Tests
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TestSummaryPage;
