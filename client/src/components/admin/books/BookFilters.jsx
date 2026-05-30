import React from 'react';
import { Search } from 'lucide-react';

const BOARDS = ['Stateboard', 'NCERT'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['History', 'Geography', 'Science', 'Polity', 'Economy', 'Tamil', 'English', 'Maths'];

const BookFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
          placeholder="Search books..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <select 
          value={filters.board} 
          onChange={e => setFilters(prev => ({ ...prev, board: e.target.value }))} 
          className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
        >
          <option value="All">All Boards</option>
          {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select 
          value={filters.className} 
          onChange={e => setFilters(prev => ({ ...prev, className: e.target.value }))} 
          className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
        >
          <option value="All">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          value={filters.subject} 
          onChange={e => setFilters(prev => ({ ...prev, subject: e.target.value }))} 
          className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500"
        >
          <option value="All">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
};

export default BookFilters;
