import React from 'react';
import { Search } from 'lucide-react';

const EXAMS = ['All', 'TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 2A', 'TNPSC Group 4', 'VAO', 'TNUSRB', 'SSC', 'Railway', 'Banking', 'UPSC'];
const STAGES = ['All', 'Prelims', 'Mains', 'Interview'];
const TYPES = ['All', 'General Studies', 'GS Paper 1', 'GS Paper 2', 'GS Paper 3', 'GS Paper 4', 'Tamil', 'English', 'Aptitude', 'Optional'];
const currentYear = new Date().getFullYear();
const YEARS = ['All', ...Array.from({length: 20}, (_, i) => currentYear - i)];

const PaperFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          placeholder="Search papers by title..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <select 
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          value={filters.exam}
          onChange={(e) => setFilters({ ...filters, exam: e.target.value })}
        >
          {EXAMS.map(exam => <option key={exam} value={exam}>{exam === 'All' ? 'All Exams' : exam}</option>)}
        </select>
        
        <select 
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
        >
          {STAGES.map(stage => <option key={stage} value={stage}>{stage === 'All' ? 'All Stages' : stage}</option>)}
        </select>

        <select 
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          value={filters.paperType}
          onChange={(e) => setFilters({ ...filters, paperType: e.target.value })}
        >
          {TYPES.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
        </select>

        <select 
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          {YEARS.map(year => <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>)}
        </select>
      </div>
    </div>
  );
};

export default PaperFilters;
