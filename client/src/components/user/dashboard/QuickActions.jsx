import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = ({ user }) => {
  const subjects = user?.subjectsList || [];
  
  let resumeSubjectName = "No Active Subject";
  let resumeTopicName = "Syllabus Completed! 🎉";
  let resumeTopicDesc = "Excellent job! You have revised all topics in your tracker.";

  const nextSubject = subjects.find(sub => sub.pendingList && sub.pendingList.length > 0);
  if (nextSubject) {
    resumeSubjectName = nextSubject.name;
    resumeTopicName = nextSubject.pendingList[0];
    resumeTopicDesc = `Part of your targeted syllabus prep module.`;
  }

  return (
    <div className="bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 border border-blue-500/10 dark:border-blue-500/20 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
          <Play size={20} className="fill-blue-500" />
        </div>
        <div>
          <span className="text-[9px] bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold uppercase px-2 py-0.5 rounded">RESUME STUDY WORKFLOW</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {nextSubject ? `${resumeSubjectName} → ${resumeTopicName}` : resumeTopicName}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{resumeTopicDesc}</p>
        </div>
      </div>
      <Link 
        to="/dashboard/syllabus"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/15"
      >
        Resume Learning
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default QuickActions;
