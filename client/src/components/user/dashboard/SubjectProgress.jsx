import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubjectProgress = ({ subjectsList = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl shadow-xs transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Syllabus Breakdown</h3>
          <p className="text-xs text-slate-500">Mastery level & completion percentages of core TNPSC subjects</p>
        </div>
        <Link 
          to="/dashboard/syllabus"
          className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1"
        >
          Manage Syllabus
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {subjectsList.slice(0, 4).map((sub, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between transition-colors hover:border-slate-300 dark:hover:border-slate-800">
            <div>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{sub.name}</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  sub.mastery === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500' :
                  sub.mastery === 'Strong' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {sub.mastery}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{sub.topicsCompleted}/{sub.topicsTotal} topics mastered</p>
            </div>
            <div className="mt-4.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span>{sub.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${sub.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
