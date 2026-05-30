import React from 'react';
import { Calendar } from 'lucide-react';

const ActivityTimeline = ({ user }) => {
  const activities = user?.activityTimeline || [];

  return (
    <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl shadow-xs transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activities</h3>
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
          <Calendar size={12} />
          <span>Timeline Log</span>
        </span>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2 text-center">No recent activities logged yet.</p>
        ) : (
          activities.map((act, idx) => (
            <div key={act.id || idx} className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-350">{act.text}</p>
                <span className="text-[9px] text-slate-500 mt-0.5 block">{act.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
