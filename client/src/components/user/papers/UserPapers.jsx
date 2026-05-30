import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Download, Eye, LayoutGrid, List, Library, FileText, Loader } from 'lucide-react';
import api from '../../../config/api';

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
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-900 text-white p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <FileText size={240} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Previous Year Papers</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
            Master your exams by practicing with authentic previous year question papers.
          </p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
        
        {/* Exam Tabs (Scrollable) */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-6 scrollbar-hide">
          <div className="inline-flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl whitespace-nowrap min-w-max mx-auto">
            {EXAMS.map(exam => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedExam === exam 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {exam}
              </button>
            ))}
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

          <div className="flex w-full xl:w-auto flex-wrap gap-4 items-center justify-between xl:justify-end">
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedStage} 
                onChange={e => setSelectedStage(e.target.value)} 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Stages</option>
                {STAGES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)} 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Types</option>
                {TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)} 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Years</option>
                {YEARS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
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
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
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
                className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col relative'
                }`}
              >
                <div className={`${
                  viewMode === 'list' ? 'w-24 h-32 rounded-xl flex-shrink-0' : 'w-full aspect-[4/5] relative'
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

                <div className={`flex flex-col justify-between flex-grow ${viewMode === 'grid' ? 'p-5' : ''}`}>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {paper.stage}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {paper.year}
                      </span>
                    </div>
                    <h4 className={`font-bold text-slate-900 dark:text-white leading-tight ${viewMode === 'list' ? 'text-xl mb-1' : 'text-lg mb-2'}`}>
                      {paper.title}
                    </h4>
                    {viewMode === 'list' && (
                      <p className="text-sm text-slate-500 mb-4">{paper.paperType}</p>
                    )}
                  </div>

                  <div className={`flex items-center gap-3 mt-4 ${viewMode === 'list' ? 'w-full max-w-sm' : ''}`}>
                    <button 
                      onClick={(e) => handleDownload(e, paper.previewUrl || paper.driveLink)}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-bold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      <Eye size={18} /> <span className="text-sm">Preview</span>
                    </button>
                    <button 
                      onClick={(e) => handleDownload(e, paper.downloadUrl || paper.driveLink)}
                      className="flex items-center justify-center p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      title="Download PDF"
                    >
                      <Download size={18} />
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
