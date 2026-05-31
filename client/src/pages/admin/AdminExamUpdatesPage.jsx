import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Loader2, BellRing, FileWarning } from 'lucide-react';
import examUpdateService from '../../services/examUpdateService';
import ExamUpdatesTable from '../../components/admin/exam-updates/ExamUpdatesTable';
import AddEditExamUpdateModal from '../../components/admin/exam-updates/AddEditExamUpdateModal';

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

const AdminExamUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [year, setYear] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 12 };
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
  }, [page, search, status, year]);

  const handleAddNew = () => {
    setEditingUpdate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam update?')) return;
    try {
      await examUpdateService.deleteExamUpdate(id);
      fetchUpdates();
    } catch (err) {
      console.error(err);
      alert('Failed to delete exam update');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await examUpdateService.togglePublish(id);
      fetchUpdates();
    } catch (err) {
      console.error(err);
      alert('Failed to change publish status');
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setEditingUpdate(null);
    if (shouldRefresh) {
      setPage(1); // Reset to first page
      fetchUpdates();
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium text-xs mb-3 border border-blue-100 dark:border-blue-800/30">
            <BellRing size={14} />
            Notifications
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Exam Updates Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
            Publish and manage official notifications, dates, and results.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2 shrink-0 text-sm"
        >
          <Plus size={18} />
          Create Update
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by exam name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-slate-200 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48 shrink-0">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-slate-200 transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="relative w-full sm:w-32 shrink-0">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-slate-200 transition-all cursor-pointer"
          >
            <option value="">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden min-h-[400px] relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm z-10">
            <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading updates...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <FileWarning size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Error Loading Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
            <button 
              onClick={fetchUpdates}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : updates.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
              <BellRing size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Updates Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {search || status !== 'All' || year ? "Try adjusting your filters to find what you're looking for." : "Start by adding the first exam update."}
            </p>
            {!(search || status !== 'All' || year) && (
              <button 
                onClick={handleAddNew}
                className="mt-4 px-5 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                Create First Update
              </button>
            )}
          </div>
        ) : (
          <ExamUpdatesTable 
            updates={updates} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onTogglePublish={handleTogglePublish} 
          />
        )}
      </div>

      {/* Pagination (Only show if multiple pages or not loading) */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddEditExamUpdateModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            editData={editingUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExamUpdatesPage;
