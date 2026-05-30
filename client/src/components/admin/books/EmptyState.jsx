import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <BookOpen className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No books found</h3>
      <p className="text-slate-500">There are no books matching your current filters.</p>
    </div>
  );
};

export default EmptyState;
