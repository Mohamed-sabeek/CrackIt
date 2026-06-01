import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Loader, CheckCircle } from 'lucide-react';

const BOARDS = ['Stateboard', 'NCERT'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SUBJECTS = ['History', 'Geography', 'Science', 'Polity', 'Economy', 'Tamil', 'English', 'Maths'];
const MEDIUMS = ['Tamil', 'English'];

const EditBookModal = ({ isOpen, onClose, onSave, saving, book }) => {
  const [formData, setFormData] = useState({
    title: '',
    className: 'Class 6',
    board: 'Stateboard',
    subject: 'History',
    medium: 'English',
    sourceName: 'TN Textbooks',
    resourceUrl: '',
    thumbnail: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        className: book.className || 'Class 6',
        board: book.board || 'Stateboard',
        subject: book.subject || 'History',
        medium: book.medium || 'English',
        sourceName: book.sourceName || 'TN Textbooks',
        resourceUrl: book.resourceUrl || book.driveLink || '',
        thumbnail: book.thumbnail || ''
      });
    }
  }, [book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.resourceUrl) return alert('Please provide an official resource URL.');
    onSave(book._id, formData);
  };

  return (
    <AnimatePresence>
      {isOpen && book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Book</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="editBookForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Book Title</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500" placeholder="e.g., 6th Standard History" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Board</label>
                    <select name="board" value={formData.board} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500">
                      {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class</label>
                    <select name="className" value={formData.className} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500">
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500">
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Medium</label>
                    <select name="medium" value={formData.medium} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500">
                      {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Source Name</label>
                  <input required type="text" name="sourceName" value={formData.sourceName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500" placeholder="e.g., TN Textbooks" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Official Resource URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-slate-400" />
                    </div>
                    <input required type="url" name="resourceUrl" value={formData.resourceUrl} onChange={handleInputChange} className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500" placeholder="https://example.com/textbook.pdf" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Thumbnail URL (Optional)</label>
                  <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500" placeholder="https://..." />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button 
                type="button" 
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="editBookForm"
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle size={18} /> Update Book</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditBookModal;
