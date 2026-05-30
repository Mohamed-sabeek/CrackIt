import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const UserSettings = ({ user, activeExam = 'TNPSC Group 4', setActiveExam }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-2xl mx-auto bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-8 rounded-3xl space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Account Settings</h3>
        <p className="text-xs text-slate-500 mt-0.5">Customize your prep, choose exam targets, and toggle features.</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900/60 text-xs">
        {/* Target Exam selector */}
        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-2">TARGET EXAM MODULE</label>
          <select 
            value={activeExam}
            onChange={(e) => setActiveExam && setActiveExam(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="TNPSC Group 4">TNPSC Group 4 (Active)</option>
            <option value="TNPSC Group 2">TNPSC Group 2 (Coming Soon)</option>
            <option value="Banking & SSC">Banking & SSC (Coming Soon)</option>
          </select>
        </div>

        {/* Study targets setting */}
        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-2">DAILY STUDY GOAL LIMIT</label>
          <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-slate-700 dark:text-slate-200 outline-none">
            <option>3 Hours per day (Standard)</option>
            <option>5 Hours per day (Intense)</option>
            <option>1 Hour per day (Casual)</option>
          </select>
        </div>

        {/* Profile data showcase */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900/60">
          <h4 className="font-bold text-slate-650 dark:text-slate-400 mb-3.5">STUDENT PROFILE</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">FULL NAME</span>
              <input 
                type="text" 
                disabled 
                value={user?.name || 'Mohamed Sabeek'}
                className="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">EMAIL ADDRESS</span>
              <input 
                type="text" 
                disabled 
                value={user?.email || 'sabeek@gmail.com'}
                className="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>

        {/* Theme Confirmation notice */}
        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mt-4">
          <h5 className="font-bold text-blue-500 flex items-center gap-1.5 mb-1">
            <CheckCircle2 size={14} />
            <span>Premium dashboard theme system active</span>
          </h5>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            Theme defaults automatically to Dark inside your student portal workspace for focused night sessions, and responds dynamically when you toggle the Sun/Moon switch on the top navigation bar.
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default UserSettings;
