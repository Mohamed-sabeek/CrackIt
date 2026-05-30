import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as bookService from '../../services/bookService';

// Components
import BookFilters from '../../components/admin/books/BookFilters';
import BookTable from '../../components/admin/books/BookTable';
import EmptyState from '../../components/admin/books/EmptyState';
import LoadingSkeleton from '../../components/admin/books/LoadingSkeleton';
import AddBookForm from '../../components/admin/books/AddBookForm';
import EditBookModal from '../../components/admin/books/EditBookModal';
import DeleteModal from '../../components/admin/books/DeleteModal';

const AdminStudyLibraryPage = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    board: 'All',
    className: 'All',
    subject: 'All'
  });

  useEffect(() => {
    // Implement debounce for search
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks(filters);
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error('Expected array from backend, got:', data);
        setBooks([]);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (formData) => {
    setSaving(true);
    try {
      await bookService.createBook(formData, token);
      setIsAddOpen(false);
      fetchBooks();
    } catch (err) {
      console.error('Failed to add book', err);
      alert('Failed to save book. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditBook = async (id, formData) => {
    setSaving(true);
    try {
      await bookService.updateBook(id, formData, token);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error('Failed to update book', err);
      alert('Failed to update book. See console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setDeleting(true);
    try {
      await bookService.deleteBook(deletingBook._id, token);
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  // Using backend filtering
  const filteredBooks = books;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Syllabus & Books Management</h2>
          <p className="text-slate-500">Manage Google Drive resources for TNPSC preparation</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          Add New Book
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <BookFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <LoadingSkeleton />
        ) : filteredBooks.length === 0 ? (
          <EmptyState />
        ) : (
          <BookTable 
            books={filteredBooks} 
            onEdit={setEditingBook} 
            onDelete={setDeletingBook} 
          />
        )}
      </div>

      {/* Modals */}
      <AddBookForm 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={handleAddBook} 
        saving={saving} 
      />

      <EditBookModal 
        isOpen={!!editingBook} 
        onClose={() => setEditingBook(null)} 
        onSave={handleEditBook} 
        saving={saving} 
        book={editingBook} 
      />

      <DeleteModal 
        isOpen={!!deletingBook} 
        onClose={() => setDeletingBook(null)} 
        onConfirm={handleDeleteBook} 
        deleting={deleting} 
        bookTitle={deletingBook?.title} 
      />
    </div>
  );
};

export default AdminStudyLibraryPage;
