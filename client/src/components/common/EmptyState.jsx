import React from 'react';
import { HelpCircle } from 'lucide-react';

const EmptyState = ({ title = 'No results found', description = 'Try adjusting your search filters or browse other categories.' }) => {
  return (
    <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-8 rounded-3xl text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 mx-auto">
        <HelpCircle size={20} />
      </div>
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
