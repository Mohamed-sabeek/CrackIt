import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Loader2, BellRing, ExternalLink, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import CustomSelect from '../../components/common/CustomSelect';
import PageHeader from '../../components/common/PageHeader';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
import examUpdateService from '../../services/examUpdateService';

const STATUS_COLORS = {
  'Upcoming': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'Applications Open': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  'Hall Ticket Released': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  'Exam Completed': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  'Results Released': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  'Certificate Verification': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  'Recruitment Closed': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
};

const STATUS_OPTIONS = [
  'All',
  'Upcoming',
  'Applications Open',
  'Hall Ticket Released',
  'Exam Completed',
  'Results Released',
  'Certificate Verification',
  'Recruitment Closed'
];

const UserExamUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (status !== 'All') params.status = status;
      if (year) params.year = year;

      const res = await examUpdateService.getExamUpdates(params);
      if (res.success) {
        setUpdates(res.data);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch exam updates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status, year, sort]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader 
        title="Exam Updates" 
        description="Stay informed with the latest TNPSC notifications, exam schedules, hall tickets, and result announcements." 
      />

      {/* Filters Area */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by exam name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-slate-200 transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          {/* Status Filter */}
          <div className="w-full sm:w-44 shrink-0">
            <CustomSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
              placeholder="All Statuses"
            />
          </div>

          {/* Year Filter */}
          <div className="w-full sm:w-32 shrink-0">
            <CustomSelect
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={[{ value: '', label: 'All Years' }, ...yearOptions.map(y => ({ value: y, label: y }))]}
              placeholder="All Years"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-40 shrink-0">
            <CustomSelect
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' }
              ]}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching official updates...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchUpdates}
            className="px-5 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100 dark:border-slate-700">
            <BellRing size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Updates Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {search || status !== 'All' || year 
              ? "We couldn't find any updates matching your filters. Try adjusting them."
              : "There are currently no active exam updates. Please check back later."}
          </p>
          {(search || status !== 'All' || year) && (
            <button
              onClick={() => {
                setSearch('');
                setStatus('All');
                setYear('');
              }}
              className="mt-6 px-5 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {updates.map((update, index) => (
              <motion.div
                key={update._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700"
              >
                {/* Card Header (Status Strip) */}
                <div className={`px-5 py-3 border-b flex justify-between items-center ${STATUS_COLORS[update.status]}`}>
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {update.status === 'Upcoming' && <Clock size={14} />}
                    {update.status === 'Applications Open' && <CheckCircle size={14} />}
                    {update.status === 'Hall Ticket Released' && <ExternalLink size={14} />}
                    {update.status}
                  </span>
                  {update.notificationNumber && (
                    <span className="text-[10px] font-semibold opacity-80 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                      No: {update.notificationNumber}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {update.examName}
                  </h3>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Calendar size={15} className="text-slate-400" />
                        <span>Notification:</span>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatDate(update.notificationDate)}
                      </span>
                    </div>

                    {update.examDate && (
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Calendar size={15} className="text-blue-400" />
                          <span>Exam Date:</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {formatDate(update.examDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-4 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{update.sourceName}</span>
                  </div>
                  
                  <button
                    onClick={() => window.open(update.officialUrl, '_blank')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Official Notification
                    <ExternalLink size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserExamUpdatesPage;
