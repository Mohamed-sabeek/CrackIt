import React from 'react';
import { Edit2, Trash2, Globe, EyeOff } from 'lucide-react';

const formatDate = d => d
  ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—';

const CurrentAffairsTable = ({ items, onEdit, onDelete, onTogglePublish }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs border-collapse">
      <thead>
        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          <th className="py-3 pr-4 pl-1">Month</th>
          <th className="py-3 px-3">Year</th>
          <th className="py-3 px-3">Source Name</th>
          <th className="py-3 px-3 text-center">Status</th>
          <th className="py-3 px-3 text-center">Created</th>
          <th className="py-3 pl-3 pr-1 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40">
        {items.map(item => (
          <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
            {/* Month */}
            <td className="py-3.5 pr-4 pl-1">
              <span className="font-extrabold text-slate-900 dark:text-white">{item.month}</span>
            </td>

            {/* Year */}
            <td className="py-3.5 px-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">{item.year}</span>
            </td>

            {/* Source Name */}
            <td className="py-3.5 px-3 max-w-[260px]">
              <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{item.sourceName}</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-500 hover:underline truncate block max-w-[220px]"
              >
                {item.sourceUrl}
              </a>
            </td>

            {/* Status */}
            <td className="py-3.5 px-3 text-center">
              {item.isPublished ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                  Draft
                </span>
              )}
            </td>

            {/* Date */}
            <td className="py-3.5 px-3 text-center text-slate-400 font-medium">
              {formatDate(item.createdAt)}
            </td>

            {/* Actions */}
            <td className="py-3.5 pl-3 pr-1">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onTogglePublish(item)}
                  title={item.isPublished ? 'Unpublish' : 'Publish'}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 ${item.isPublished ? 'text-amber-500 hover:bg-amber-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                >
                  {item.isPublished ? <EyeOff size={14} /> : <Globe size={14} />}
                </button>
                <button
                  onClick={() => onEdit(item)}
                  title="Edit"
                  className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer border-0"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CurrentAffairsTable;
