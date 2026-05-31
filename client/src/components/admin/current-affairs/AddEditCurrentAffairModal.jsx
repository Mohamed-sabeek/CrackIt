import React, { useState, useEffect } from 'react';
import { X, Calendar, Link2 } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 8 }, (_, i) => currentYear - i + 1);

const EMPTY = {
  month: 'January',
  year: String(currentYear),
  sourceName: '',
  sourceUrl: '',
  isPublished: false
};

const AddEditCurrentAffairModal = ({ isOpen, onClose, onSave, saving, currentAffair }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(
        currentAffair
          ? {
              month: currentAffair.month || 'January',
              year: String(currentAffair.year || currentYear),
              sourceName: currentAffair.sourceName || '',
              sourceUrl: currentAffair.sourceUrl || '',
              isPublished: !!currentAffair.isPublished
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [isOpen, currentAffair]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.month) e.month = 'Month is required';
    if (!form.year || isNaN(Number(form.year))) e.year = 'Year is required';
    if (!form.sourceName.trim()) e.sourceName = 'Source name is required';
    if (!form.sourceUrl.trim()) {
      e.sourceUrl = 'Source URL is required';
    } else if (!/^https?:\/\/.+\..+/i.test(form.sourceUrl.trim())) {
      e.sourceUrl = 'Enter a valid URL starting with http:// or https://';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = e => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            {currentAffair ? 'Edit Resource' : 'Add Current Affairs Resource'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0">
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs font-semibold">

          {/* Month + Year Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-bold">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                name="month"
                value={form.month}
                onChange={onChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.month ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.month && <p className="text-[10px] text-red-500 mt-1">{errors.month}</p>}
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-bold">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                name="year"
                value={form.year}
                onChange={onChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.year ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <p className="text-[10px] text-red-500 mt-1">{errors.year}</p>}
            </div>
          </div>

          {/* Source Name */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-bold">
              Source Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sourceName"
              value={form.sourceName}
              onChange={onChange}
              placeholder="e.g. AffairsCloud Monthly Current Affairs"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.sourceName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
            />
            {errors.sourceName && <p className="text-[10px] text-red-500 mt-1">{errors.sourceName}</p>}
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1.5 font-bold">
              Source URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="sourceUrl"
                value={form.sourceUrl}
                onChange={onChange}
                placeholder="https://affairscloud.com/..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all ${errors.sourceUrl ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
              />
            </div>
            {errors.sourceUrl && <p className="text-[10px] text-red-500 mt-1">{errors.sourceUrl}</p>}
          </div>

          {/* Publish Toggle */}
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={onChange}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-300 font-bold select-none">
              Publish immediately (sends notification to students)
            </span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all cursor-pointer border-0 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer border-0 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCurrentAffairModal;
