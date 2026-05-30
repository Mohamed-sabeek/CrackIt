import React from 'react';
import { Download, Eye } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
      <div className="w-full aspect-[4/5] relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
        <img 
          src={book.thumbnail || `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(book.subject)}`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col justify-between flex-grow p-5">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {book.className}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {book.board}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">
            {book.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => onEdit(book)}
            className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(book)}
            className="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
