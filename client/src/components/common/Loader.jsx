import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading workspace...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-xs text-slate-400 font-semibold mt-2.5">{message}</span>
    </div>
  );
};

export default Loader;
