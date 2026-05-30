import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';

const ExamManagementPage = () => {
  const [examsList, setExamsList] = useState([]);

  const handleToggleExam = (index) => {
    const listCopy = [...examsList];
    listCopy[index].status = listCopy[index].status === 'Active' ? 'Coming Soon' : 'Active';
    setExamsList(listCopy);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Exam Syllabus Modules</h3>
          <p className="text-xs text-slate-500 mt-1">Configure active exam courses, activate toggles, and prepare roadmaps.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer border-0">
          <Plus size={14} />
          Create New Course
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {examsList.map((exm, idx) => {
          const isActive = exm.status === 'Active';
          return (
            <div key={idx} className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl flex justify-between items-center hover:border-indigo-500/20 transition-all">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{exm.name} Course Model</h4>
                <p className="text-xs text-slate-500 mt-1">Category: {exm.category} • {exm.users} enrolled</p>
              </div>
              <button
                onClick={() => handleToggleExam(idx)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 text-slate-500 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ExamManagementPage;
