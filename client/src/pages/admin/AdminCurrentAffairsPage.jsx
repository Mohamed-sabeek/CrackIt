import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Newspaper, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as svc from '../../services/currentAffairService';
import CurrentAffairsTable from '../../components/admin/current-affairs/CurrentAffairsTable';
import AddEditCurrentAffairModal from '../../components/admin/current-affairs/AddEditCurrentAffairModal';
import DeleteModal from '../../components/admin/books/DeleteModal';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = ['All', ...Array.from({ length: 8 }, (_, i) => String(currentYear - i + 1))];
const LIMIT = 12;

const AdminCurrentAffairsPage = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

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

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await svc.createCurrentAffair(data, token);
      setIsAddOpen(false);
      fetchItems(1);
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (data) => {
    if (!editingItem) return;
    setSaving(true);
    try {
      await svc.updateCurrentAffair(editingItem._id, data, token);
      setEditingItem(null);
      fetchItems(page);
    } catch (err) {
      console.error(err);
      alert('Failed to update. Please try again.');
    } finally { setSaving(false); }
  };

  const handleTogglePublish = async (item) => {
    try {
      await svc.togglePublishCurrentAffair(item._id, token);
      fetchItems(page);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await svc.deleteCurrentAffair(deletingItem._id, token);
      setDeletingItem(null);
      fetchItems(page);
    } catch (err) { console.error(err); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper size={22} className="text-indigo-500" />
            Current Affairs Resources
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage monthly current affairs resource links for students
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer border-0"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Filters + Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        {/* Filter Row */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by source name..."
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>

          <select
            value={filters.year}
            onChange={e => setFilters(p => ({ ...p, year: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all min-w-[120px]"
          >
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>

          <select
            value={filters.sort}
            onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button
            onClick={() => fetchItems(page)}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 hover:border-blue-400/50 bg-slate-50 dark:bg-slate-950/40 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Record count */}
        <p className="text-[10px] text-slate-400 font-semibold mb-4">
          {loading ? 'Loading...' : `${totalRecords} resource${totalRecords !== 1 ? 's' : ''}`}
        </p>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Loading resources...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <Newspaper size={30} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400">No resources found</h4>
            <p className="text-xs text-slate-400 mt-1">
              {filters.search || filters.year !== 'All'
                ? 'Try adjusting your filters.'
                : 'Click "Add Resource" to create the first entry.'}
            </p>
          </div>
        ) : (
          <CurrentAffairsTable
            items={items}
            onEdit={setEditingItem}
            onDelete={setDeletingItem}
            onTogglePublish={handleTogglePublish}
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => fetchItems(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = i + Math.max(1, page - 2);
                if (pg > totalPages) return null;
                return (
                  <button
                    key={pg}
                    onClick={() => fetchItems(pg)}
                    className={`w-8 h-7 rounded-lg border transition-colors cursor-pointer ${pg === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => fetchItems(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditCurrentAffairModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleCreate} saving={saving} currentAffair={null} />
      <AddEditCurrentAffairModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} onSave={handleUpdate} saving={saving} currentAffair={editingItem} />
      <DeleteModal isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} deleting={deleting} bookTitle={deletingItem?.sourceName} />
    </div>
  );
};

export default AdminCurrentAffairsPage;
