import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, ExternalLink, ChevronLeft, ChevronRight, Loader2, Calendar } from 'lucide-react';
import * as svc from '../../services/currentAffairService';
import CustomSelect from '../../components/common/CustomSelect';
import PageHeader from '../../components/common/PageHeader';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = ['All', ...Array.from({ length: 8 }, (_, i) => String(currentYear - i + 1))];
const LIMIT = 12;

const UserCurrentAffairsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', year: 'All', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchItems = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await svc.getCurrentAffairs(filters, p, LIMIT);
      if (res.success) {
        setItems(res.data);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
        setTotalRecords(res.totalRecords);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(() => fetchItems(1), 350);
    return () => clearTimeout(t);
  }, [fetchItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 max-w-6xl mx-auto pb-12"
    >
      <PageHeader 
        title={
          <span className="flex items-center gap-2.5">
            Current Affairs Resources
            <Newspaper size={26} className="text-slate-400 dark:text-slate-500" />
          </span>
        }
        description="Access monthly current affairs resources for TNPSC preparation. Click 'Open Resource' to visit the source website." 
      />

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by source name..."
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all min-h-[44px]"
            />
          </div>

          {/* Year */}
          <div className="w-full sm:w-auto">
            <CustomSelect
              value={filters.year}
              onChange={e => setFilters(p => ({ ...p, year: e.target.value }))}
              options={YEAR_OPTIONS.map(y => ({ value: y, label: y === 'All' ? 'All Years' : y }))}
              placeholder="All Years"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-auto">
            <CustomSelect
              value={filters.sort}
              onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' }
              ]}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs font-semibold text-slate-400 px-1">
          {totalRecords} resource{totalRecords !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading resources...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Newspaper size={28} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-2">No Resources Found</h3>
          <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
            {filters.search || filters.year !== 'All'
              ? 'Try changing your filters to see more results.'
              : 'No current affairs resources have been published yet. Check back soon!'}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.045 }}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xs hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-200 group"
            >
              {/* Month + Year */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {item.month} {item.year}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* Source Name */}
              <div className="flex-grow">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Source</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                  {item.sourceName}
                </p>
              </div>

              {/* Open Resource Button */}
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-colors shadow-sm shadow-blue-500/20 group-hover:shadow-blue-500/30 min-h-[44px]"
              >
                <ExternalLink size={13} />
                Open Resource
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => fetchItems(page - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pg = i + Math.max(1, page - 2);
            if (pg > totalPages) return null;
            return (
              <button
                key={pg}
                onClick={() => fetchItems(pg)}
                className={`w-8 h-8 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${pg === page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {pg}
              </button>
            );
          })}

          <button
            disabled={page >= totalPages}
            onClick={() => fetchItems(page + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default UserCurrentAffairsPage;
