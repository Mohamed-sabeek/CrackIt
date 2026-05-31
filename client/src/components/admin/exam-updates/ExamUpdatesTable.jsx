import React from 'react';
import { Pencil, Trash2, Calendar, Link as LinkIcon, AlertCircle } from 'lucide-react';


const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
const STATUS_COLORS = {
  'Upcoming': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'Applications Open': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Hall Ticket Released': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'Exam Completed': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'Results Released': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  'Certificate Verification': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Recruitment Closed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
};

const ExamUpdatesTable = ({ updates, onEdit, onDelete, onTogglePublish }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Details</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dates</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Published</th>
            <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {updates.map((update) => (
            <tr key={update._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
              
              {/* Exam Details */}
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {update.examName}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {update.notificationNumber && (
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        No: {update.notificationNumber}
                      </span>
                    )}
                    <a 
                      href={update.officialUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:text-blue-500 flex items-center gap-1 transition-colors"
                    >
                      <LinkIcon size={12} /> {update.sourceName}
                    </a>
                  </div>
                </div>
              </td>

              {/* Dates */}
              <td className="p-4">
                <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-slate-400" />
                    <span className="w-12 text-slate-400">Notif:</span>
                    <span className="font-medium">{formatDate(update.notificationDate)}</span>
                  </div>
                  {update.examDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-400" />
                      <span className="w-12 text-slate-400">Exam:</span>
                      <span className="font-medium">{formatDate(update.examDate)}</span>
                    </div>
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[update.status] || 'bg-slate-100 text-slate-700'}`}>
                  {update.status}
                </span>
              </td>

              {/* Published Toggle */}
              <td className="p-4 text-center">
                <button
                  onClick={() => onTogglePublish(update._id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    update.isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-label="Toggle publish status"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      update.isPublished ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </td>

              {/* Actions */}
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(update)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Update"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(update._id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Update"
                  >
                    <Trash2 size={16} />
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

export default ExamUpdatesTable;
