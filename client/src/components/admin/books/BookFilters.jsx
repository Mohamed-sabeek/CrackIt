import React from 'react';
import { Search } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';

const BOARDS = ['Stateboard', 'NCERT'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['History', 'Geography', 'Science', 'Social Science', 'Polity', 'Economy', 'Tamil', 'English', 'Maths'];

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
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div className="w-full sm:w-36">
          <CustomSelect 
            value={filters.board} 
            onChange={e => setFilters(prev => ({ ...prev, board: e.target.value }))} 
            options={['All', ...BOARDS].map(b => ({ value: b, label: b === 'All' ? 'All Boards' : b }))}
            placeholder="All Boards"
          />
        </div>
        <div className="w-full sm:w-36">
          <CustomSelect 
            value={filters.className} 
            onChange={e => setFilters(prev => ({ ...prev, className: e.target.value }))} 
            options={['All', ...CLASSES].map(c => ({ value: c, label: c === 'All' ? 'All Classes' : c }))}
            placeholder="All Classes"
          />
        </div>
        <div className="w-full sm:w-36">
          <CustomSelect 
            value={filters.subject} 
            onChange={e => setFilters(prev => ({ ...prev, subject: e.target.value }))} 
            options={['All', ...SUBJECTS].map(s => ({ value: s, label: s === 'All' ? 'All Subjects' : s }))}
            placeholder="All Subjects"
          />
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
