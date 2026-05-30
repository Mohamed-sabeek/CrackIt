import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, deleting, bookTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Book</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{bookTitle}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={onClose}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : <><Trash2 size={18} /> Delete</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
