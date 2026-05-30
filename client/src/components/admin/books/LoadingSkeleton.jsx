import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="w-10 h-14 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
