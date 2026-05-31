import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Download, Eye, LayoutGrid, List, FileText, Loader, ChevronDown } from 'lucide-react';
import api from '../../../config/api';
import CustomSelect from '../../common/CustomSelect';
import PageHeader from '../../common/PageHeader';

const EXAMS = ['TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 2A', 'TNPSC Group 4', 'VAO', 'TNUSRB', 'SSC', 'Railway', 'Banking', 'UPSC'];
const STAGES = ['Prelims', 'Mains', 'Interview'];
const TYPES = ['General Studies', 'GS Paper 1', 'GS Paper 2', 'GS Paper 3', 'GS Paper 4', 'Tamil', 'English', 'Aptitude', 'Optional'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({length: 20}, (_, i) => currentYear - i);

const UserPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('TNPSC Group 1');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get('/papers');
        if (Array.isArray(res.data)) {
          setPapers(res.data);
        } else {
          setPapers([]);
        }
      } catch (err) {
        console.error('Failed to fetch papers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            paper.exam.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExam = paper.exam === selectedExam;
      const matchesStage = selectedStage === 'All' || paper.stage === selectedStage;
      const matchesType = selectedType === 'All' || paper.paperType === selectedType;
      const matchesYear = selectedYear === 'All' || paper.year.toString() === selectedYear.toString();

      return matchesSearch && matchesExam && matchesStage && matchesType && matchesYear;
    });
  }, [papers, searchQuery, selectedExam, selectedStage, selectedType, selectedYear]);

  const handleDownload = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      <PageHeader 
        title="Previous Year Papers" 
        description="Master your exams by practicing with authentic previous year question papers." 
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
        
        {/* Exam Tabs Selector Container */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          {/* Desktop Version: wrap in rows, flex container */}
          <div className="hidden md:flex flex-wrap gap-2.5 justify-center w-full">
            {EXAMS.map(exam => {
              const isActive = selectedExam === exam;
              return (
                <button
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10' 
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                  }`}
                >
                  {exam}
                </button>
              );
            })}
          </div>

          {/* Mobile Version: Horizontal scroll without scrollbar */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-1 scrollbar-none select-none snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-2 min-w-max px-1">
              {EXAMS.map(exam => {
                const isActive = selectedExam === exam;
                return (
                  <button
                    key={exam}
                    onClick={() => setSelectedExam(exam)}
                    className={`snap-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 min-h-[44px] ${
                      isActive 
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-900'
                    }`}
                  >
                    {exam}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          
          <div className="relative w-full xl:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col xl:flex-row w-full xl:w-auto gap-4 items-center justify-between xl:justify-end">
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <div className="w-full sm:w-36">
                <CustomSelect 
                  value={selectedStage} 
                  onChange={e => setSelectedStage(e.target.value)} 
                  options={['All', ...STAGES].map(c => ({ value: c, label: c === 'All' ? 'All Stages' : c }))}
                  placeholder="All Stages"
                />
              </div>

              <div className="w-full sm:w-36">
                <CustomSelect 
                  value={selectedType} 
                  onChange={e => setSelectedType(e.target.value)} 
                  options={['All', ...TYPES].map(s => ({ value: s, label: s === 'All' ? 'All Types' : s }))}
                  placeholder="All Types"
                />
              </div>

              <div className="w-full sm:w-32">
                <CustomSelect 
                  value={selectedYear} 
                  onChange={e => setSelectedYear(e.target.value)} 
                  options={['All', ...YEARS].map(s => ({ value: s, label: s === 'All' ? 'All Years' : s }))}
                  placeholder="All Years"
                />
              </div>
            </div>

            <div className="flex items-center justify-center w-full sm:w-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-12 h-12 animate-spin text-indigo-500" />
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-950 mb-4">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No papers found</h3>
          <p className="text-slate-500 max-w-md mx-auto">We couldn't find any papers matching your current filters. Try adjusting your search or category selection.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
              : "flex flex-col gap-3"
          }
        >
          <AnimatePresence>
            {filteredPapers.map(paper => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={paper._id} 
                className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'flex flex-row items-center p-2.5 sm:p-4 gap-3 sm:gap-5 h-auto sm:h-[110px]' 
                    : 'flex flex-col relative h-full'
                }`}
              >
                <div className={`${
                  viewMode === 'list' 
                    ? 'w-[64px] h-[86px] sm:w-[72px] sm:h-[96px] rounded-lg sm:rounded-xl flex-shrink-0' 
                    : 'w-full aspect-[4/5] relative'
                } bg-slate-100 dark:bg-slate-950 overflow-hidden`}>
                  <img 
                    src={paper.thumbnail || `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(paper.exam)}`} 
                    alt={paper.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                <div className={`flex flex-grow ${
                  viewMode === 'list' 
                    ? 'flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 min-w-0' 
                    : 'flex-col justify-between p-3 sm:p-5'
                }`}>
                  <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                    <div className={`flex gap-1.5 sm:gap-2 ${viewMode === 'list' ? 'mb-1 sm:mb-1.5' : 'mb-1.5 sm:mb-2'}`}>
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {paper.stage}
                      </span>
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[8px] sm:text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {paper.year}
                      </span>
                    </div>
                    <h4 className={`font-bold text-slate-900 dark:text-white leading-tight truncate ${
                      viewMode === 'list' ? 'text-sm sm:text-base' : 'text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 w-full whitespace-normal'
                    }`}>
                      {paper.title}
                    </h4>
                    {viewMode === 'list' && (
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate">{paper.paperType}</p>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ${
                    viewMode === 'list' 
                      ? 'w-full sm:w-auto justify-end mt-1 sm:mt-0' 
                      : 'mt-3 sm:mt-4'
                  }`}>
                    <button 
                      onClick={(e) => handleDownload(e, paper.previewUrl || paper.driveLink)}
                      className={`flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-bold rounded-xl transition-colors ${
                        viewMode === 'list' ? 'px-4 py-2 text-xs flex-1 sm:flex-none' : 'flex-1 py-2 sm:py-3 px-2 sm:px-4 min-h-[36px] sm:min-h-[44px] text-xs sm:text-sm'
                      }`}
                    >
                      <Eye size={viewMode === 'list' ? 14 : 18} /> <span>Preview</span>
                    </button>
                    <button 
                      onClick={(e) => handleDownload(e, paper.downloadUrl || paper.driveLink)}
                      className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors ${
                        viewMode === 'list' ? 'p-2' : 'p-2 sm:p-3 min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px]'
                      }`}
                      title="Download PDF"
                    >
                      <Download size={viewMode === 'list' ? 14 : 18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};

export default UserPapers;
