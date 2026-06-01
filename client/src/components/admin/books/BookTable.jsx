import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';

const BookTable = ({ books, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="pb-3 px-4 font-semibold text-slate-500">Book</th>
            <th className="pb-3 px-4 font-semibold text-slate-500">Class & Board</th>
            <th className="pb-3 px-4 font-semibold text-slate-500">Source & Medium</th>
            <th className="pb-3 px-4 font-semibold text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {books.map((book) => (
            <tr key={book._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-4 px-4 flex items-center gap-4">
                <img 
                  src={book.thumbnail || `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(book.subject)}`} 
                  alt={book.title} 
                  className="w-10 h-14 object-cover rounded bg-slate-200" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{book.title}</p>
                  <p className="text-xs text-slate-500">{book.subject}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{book.className}</p>
                <p className="text-xs text-slate-500">{book.board}</p>
              </td>
              <td className="py-4 px-4">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{book.sourceName || 'TN Textbooks'}</p>
                <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  book.medium === 'Tamil' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {book.medium || 'English'}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a 
                    href={book.resourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg" 
                    title="Open Resource"
                  >
                    <Eye size={18} />
                  </a>
                  <button onClick={() => onEdit(book)} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg" title="Edit">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => onDelete(book)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
