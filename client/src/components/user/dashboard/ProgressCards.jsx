import React from 'react';
import { Trophy, Clock, Award, BookOpenCheck } from 'lucide-react';

const ProgressCards = ({ user }) => {
  const subjects = user?.subjectsList || [];
  let totalTopics = 0;
  let completedTopics = 0;
  
  subjects.forEach(sub => {
    // Fallback to list lengths if topicsTotal is missing or mismatch
    const subTotal = sub.topicsTotal || (sub.completedList.length + sub.pendingList.length);
    totalTopics += subTotal;
    completedTopics += sub.completedList.length;
  });
  
  const syllabusMasteredPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const metrics = [
    { 
      label: 'Active Course', 
      value: user?.activeCourse || 'TNPSC Group 4', 
      desc: 'General Studies focus', 
      icon: Trophy, 
      progress: 'Level 4 Prep' 
    },
    { 
      label: 'Study Hours (Week)', 
      value: `${user?.studyHours || 0} Hrs`, 
      desc: 'Daily target: 3 hrs', 
      icon: Clock, 
      progress: user?.studyHours >= 21 ? 'Target Met!' : 'Keep learning!' 
    },
    { 
      label: 'Mock Tests Solved', 
      value: `${user?.mockTestsSolved || 0} Sets`, 
      desc: `Latest score: ${user?.latestMockScore || 0}%`, 
      icon: Award, 
      progress: 'Auto-graded results' 
    },
    { 
      label: 'Syllabus Mastered', 
      value: `${syllabusMasteredPercent}%`, 
      desc: `${completedTopics} of ${totalTopics} topics logged`, 
      icon: BookOpenCheck, 
      progress: `${completedTopics} topics completed` 
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:border-blue-500/20 transition-all duration-300">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-tight uppercase block">{metric.label}</span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">{metric.value}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{metric.desc}</p>
              <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-semibold mt-2 inline-block">{metric.progress}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressCards;
