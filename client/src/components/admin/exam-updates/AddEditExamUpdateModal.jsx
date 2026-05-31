import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Link as LinkIcon, Save, Calendar, CheckSquare, Megaphone } from 'lucide-react';
import examUpdateService from '../../../services/examUpdateService';

const STATUS_OPTIONS = [
  'Upcoming',
  'Applications Open',
  'Hall Ticket Released',
  'Exam Completed',
  'Results Released',
  'Certificate Verification',
  'Recruitment Closed'
];

const AddEditExamUpdateModal = ({ isOpen, onClose, editData }) => {
  const [formData, setFormData] = useState({
    examName: '',
    notificationNumber: '',
    notificationDate: '',
    examDate: '',
    status: 'Upcoming',
    sourceName: '',
    officialUrl: '',
    isPublished: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        examName: editData.examName || '',
        notificationNumber: editData.notificationNumber || '',
        notificationDate: editData.notificationDate ? new Date(editData.notificationDate).toISOString().split('T')[0] : '',
        examDate: editData.examDate ? new Date(editData.examDate).toISOString().split('T')[0] : '',
        status: editData.status || 'Upcoming',
        sourceName: editData.sourceName || '',
        officialUrl: editData.officialUrl || '',
        isPublished: editData.isPublished || false
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.examName.trim()) return setError('Exam Name is required');
    if (!formData.notificationDate) return setError('Notification Date is required');
    if (!formData.sourceName.trim()) return setError('Source Name is required');
    if (!formData.officialUrl.trim()) return setError('Official URL is required');
    
    setLoading(true);
    try {
      if (editData) {
        await examUpdateService.updateExamUpdate(editData._id, formData);
      } else {
        await examUpdateService.createExamUpdate(formData);
      }
      onClose(true); // pass true to indicate a refresh is needed
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.officialUrl || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone size={20} className="text-blue-500" />
            {editData ? 'Edit Exam Update' : 'Create Exam Update'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form id="exam-update-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Exam Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Exam Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  placeholder="e.g. Combined Technical Services Examination"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                  required
                />
              </div>

              {/* Notification Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notification Number
                </label>
                <input
                  type="text"
                  name="notificationNumber"
                  value={formData.notificationNumber}
                  onChange={handleChange}
                  placeholder="e.g. 04/2026"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                  required
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Notification Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> Notification Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="notificationDate"
                  value={formData.notificationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                  required
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-400" /> Exam Date
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                />
              </div>

              {/* Source Name */}
              <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-700 pt-5 mt-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sourceName"
                  value={formData.sourceName}
                  onChange={handleChange}
                  placeholder="e.g. TNPSC Official Website"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                  required
                />
              </div>

              {/* Official URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-slate-400" /> Official URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="officialUrl"
                  value={formData.officialUrl}
                  onChange={handleChange}
                  placeholder="https://tnpsc.gov.in/..."
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5.5 rounded-full transition-colors ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition-transform ${formData.isPublished ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    Publish Immediately
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    If checked, this update will be visible to students and a notification will be sent.
                  </div>
                </div>
              </label>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="exam-update-form"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {editData ? 'Save Changes' : 'Create Update'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddEditExamUpdateModal;
