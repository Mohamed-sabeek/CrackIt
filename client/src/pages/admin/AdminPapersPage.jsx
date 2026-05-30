import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as paperService from '../../services/paperService';

import PaperFilters from '../../components/admin/papers/PaperFilters';
import PaperTable from '../../components/admin/papers/PaperTable';
import EmptyState from '../../components/admin/books/EmptyState';
import LoadingSkeleton from '../../components/admin/books/LoadingSkeleton';
import AddPaperForm from '../../components/admin/papers/AddPaperForm';
import EditPaperModal from '../../components/admin/papers/EditPaperModal';
import DeleteModal from '../../components/admin/books/DeleteModal'; // reuse delete modal from books

const AdminPapersPage = () => {
  const { token } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [deletingPaper, setDeletingPaper] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    exam: 'All',
    stage: 'All',
    paperType: 'All',
    year: 'All'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPapers();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const data = await paperService.getPapers(filters);
      if (Array.isArray(data)) {
        setPapers(data);
      } else {
        setPapers([]);
      }
    } catch (err) {
      console.error('Failed to fetch papers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaper = async (formData) => {
    setSaving(true);
    try {
      await paperService.createPaper(formData, token);
      setIsAddOpen(false);
      fetchPapers();
    } catch (err) {
      console.error('Failed to add paper', err);
      alert('Failed to save paper.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPaper = async (id, formData) => {
    setSaving(true);
    try {
      await paperService.updatePaper(id, formData, token);
      setEditingPaper(null);
      fetchPapers();
    } catch (err) {
      console.error('Failed to update paper', err);
      alert('Failed to update paper.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaper = async () => {
    if (!deletingPaper) return;
    setDeleting(true);
    try {
      await paperService.deletePaper(deletingPaper._id, token);
      setDeletingPaper(null);
      fetchPapers();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Previous Year Papers</h2>
          <p className="text-slate-500">Manage PYQs for all competitive exams</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          Add New Paper
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <PaperFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <LoadingSkeleton />
        ) : papers.length === 0 ? (
          <EmptyState />
        ) : (
          <PaperTable 
            papers={papers} 
            onEdit={setEditingPaper} 
            onDelete={setDeletingPaper} 
          />
        )}
      </div>

      <AddPaperForm 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={handleAddPaper} 
        saving={saving} 
      />

      <EditPaperModal 
        isOpen={!!editingPaper} 
        onClose={() => setEditingPaper(null)} 
        onSave={handleEditPaper} 
        saving={saving} 
        paper={editingPaper} 
      />

      <DeleteModal 
        isOpen={!!deletingPaper} 
        onClose={() => setDeletingPaper(null)} 
        onConfirm={handleDeletePaper} 
        deleting={deleting} 
        bookTitle={deletingPaper?.title} 
      />
    </div>
  );
};

export default AdminPapersPage;
