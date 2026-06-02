import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Download, Eye, LayoutGrid, List, Library, FileText, Loader, ChevronDown } from 'lucide-react';
import api from '../../../config/api';
import CustomSelect from '../../common/CustomSelect';
import PageHeader from '../../common/PageHeader';

const BOARDS = ['Stateboard', 'NCERT'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['History', 'Geography', 'Science', 'Social Science', 'Polity', 'Economy', 'Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Bio Botany', 'Bio Zoology', 'Accountancy', 'Commerce', 'Computer Applications', 'Computer Science', 'Economics'];
const MEDIUMS = ['Tamil', 'English'];

const UserSyllabus = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('Stateboard');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedMedium, setSelectedMedium] = useState('All Mediums');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBoard = book.board === selectedBoard;
      const matchesClass = selectedClass === 'All' || book.className === selectedClass;
      const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
      const matchesMedium = selectedMedium === 'All Mediums' || (book.medium || 'English') === selectedMedium;

      return matchesSearch && matchesBoard && matchesClass && matchesSubject && matchesMedium;
    });
  }, [books, searchQuery, selectedBoard, selectedClass, selectedSubject, selectedMedium]);

  const handleOpenResource = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      <PageHeader 
        title="Digital Study Library" 
        description="Access TNPSC-relevant textbooks and materials from Classes 6 to 12." 
      />

      {/* Main Controls Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
        
        {/* Board Tabs */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl">
            {BOARDS.map(board => (
              <button
                key={board}
                onClick={() => setSelectedBoard(board)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedBoard === board 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {board}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row w-full lg:w-auto gap-4 items-center justify-between lg:justify-end">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <div className="w-full sm:w-48">
                <CustomSelect 
                  value={selectedClass} 
                  onChange={e => setSelectedClass(e.target.value)} 
                  options={['All', ...CLASSES].map(c => ({ value: c, label: c === 'All' ? 'All Classes' : c }))}
                  placeholder="All Classes"
                />
              </div>

              <div className="w-full sm:w-48">
                <CustomSelect 
                  value={selectedSubject} 
                  onChange={e => setSelectedSubject(e.target.value)} 
                  options={['All', ...SUBJECTS].map(s => ({ value: s, label: s === 'All' ? 'All Subjects' : s }))}
                  placeholder="All Subjects"
                />
              </div>

              <div className="w-full sm:w-48">
                <CustomSelect 
                  value={selectedMedium} 
                  onChange={e => setSelectedMedium(e.target.value)} 
                  options={['All Mediums', ...MEDIUMS].map(m => ({ value: m, label: m }))}
                  placeholder="All Mediums"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
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

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-12 h-12 animate-spin text-indigo-500" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-950 mb-4">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
          <p className="text-slate-500 max-w-md mx-auto">We couldn't find any books matching your current filters. Try adjusting your search or category selection.</p>
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
            {filteredBooks.map(book => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={book._id} 
                className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'flex flex-row items-center p-2.5 sm:p-4 gap-3 sm:gap-5 h-auto sm:h-[110px]' 
                    : 'flex flex-col relative h-full'
                }`}
              >
                {/* Thumbnail */}
                <div className={`${
                  viewMode === 'list' 
                    ? 'w-[64px] h-[86px] sm:w-[72px] sm:h-[96px] rounded-lg sm:rounded-xl flex-shrink-0' 
                    : 'w-full aspect-[4/5] relative'
                } bg-slate-100 dark:bg-slate-950 overflow-hidden`}>
                  <img 
                    src={book.thumbnail || `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(book.subject)}`} 
                    alt={book.title}
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
                    <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${viewMode === 'list' ? 'mb-1 sm:mb-1.5' : 'mb-1.5 sm:mb-2'}`}>
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {book.className}
                      </span>
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[8px] sm:text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {book.subject}
                      </span>
                      <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider ${book.medium === 'Tamil' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {book.medium || 'English'} Med
                      </span>
                      <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider ${book.board === 'NCERT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {book.board}
                      </span>
                    </div>
                    <h4 className={`font-bold text-slate-900 dark:text-white leading-tight truncate ${
                      viewMode === 'list' ? 'text-sm sm:text-base' : 'text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 w-full whitespace-normal'
                    }`}>
                      {book.title}
                    </h4>
                    <p className={`text-[10px] sm:text-xs text-slate-500 truncate flex items-center gap-1 ${viewMode === 'grid' ? 'mb-1' : ''}`}>
                      <Library size={12} className="text-slate-400" />
                      {book.sourceName || 'TN Textbooks'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ${
                    viewMode === 'list' 
                      ? 'w-full sm:w-auto justify-end mt-1 sm:mt-0' 
                      : 'mt-3 sm:mt-4 w-full'
                  }`}>
                    <button 
                      onClick={(e) => handleOpenResource(e, book.resourceUrl)}
                      className={`flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-bold rounded-xl transition-colors w-full ${
                        viewMode === 'list' ? 'px-4 py-2 text-xs flex-1 sm:flex-none' : 'py-2 sm:py-3 px-2 sm:px-4 min-h-[36px] sm:min-h-[44px] text-xs sm:text-sm'
                      }`}
                    >
                      <Eye size={viewMode === 'list' ? 14 : 18} /> <span>Open Resource</span>
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

export default UserSyllabus;
