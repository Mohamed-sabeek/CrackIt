import React, { useState, useEffect } from 'react';
import { X, Save, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as mockTestService from '../../../services/mockTestService';

const CATEGORIES = ['Group 1', 'Group 2', 'Group 4', 'VAO'];
const SUBJECTS = ['History', 'Geography', 'Science', 'Social Science', 'Polity', 'Economy', 'Tamil', 'English', 'Maths', 'Physics', 'Chemistry', 'Bio Botany', 'Bio Zoology', 'Accountancy', 'Commerce', 'Computer Applications', 'Computer Science', 'Economics'];

const CreateTestModal = ({ isOpen, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: 'daily',
    category: 'Group 4',
    subject: 'History',
    duration: 30,
    totalQuestions: 20,
    totalMarks: 20,
    passingMarks: 10,
    questions: []
  });
  
  const [loadingQs, setLoadingQs] = useState(false);
  const [availableQsCount, setAvailableQsCount] = useState(0);

  useEffect(() => {
    if (isOpen) checkAvailableQuestions();
  }, [isOpen, formData.testType, formData.category, formData.subject]);

  const checkAvailableQuestions = async () => {
    setLoadingQs(true);
    try {
      const qs = await mockTestService.getQuestions({ 
        category: formData.category, 
        subject: formData.testType === 'subject' ? formData.subject : 'All'
      }, token);
      
      setAvailableQsCount(qs.length);
      
      // Auto assign random questions
      const shuffled = qs.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, formData.totalQuestions).map(q => q._id);
      setFormData(prev => ({ ...prev, questions: selected }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQs(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.questions.length < formData.totalQuestions) {
      if (!window.confirm(`You requested ${formData.totalQuestions} questions, but only ${formData.questions.length} are available. Continue anyway?`)) {
        return;
      }
    }
    // Adjust total questions to actual found
    const finalData = {
      ...formData,
      totalQuestions: formData.questions.length
    };
    onSave(finalData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Mock Test</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Test Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Test Type</label>
                <select value={formData.testType} onChange={e => setFormData({...formData, testType: e.target.value})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none">
                  <option value="daily">Daily Practice</option>
                  <option value="subject">Subject Test</option>
                  <option value="full">Full Mock Test</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {formData.testType === 'subject' && (
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Duration (mins)</label>
                <input required type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Questions count</label>
                <input required type="number" value={formData.totalQuestions} onChange={e => setFormData({...formData, totalQuestions: parseInt(e.target.value)})} onBlur={checkAvailableQuestions} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-300">Total Marks</label>
                <input required type="number" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: parseInt(e.target.value)})} className="w-full p-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" />
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-indigo-800 dark:text-indigo-400">Auto-Select Questions</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-500">Available matching bank questions: {loadingQs ? '...' : availableQsCount}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-500 font-semibold mt-1">Currently assigned: {formData.questions.length}</p>
              </div>
              <button type="button" onClick={checkAvailableQuestions} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700" title="Reshuffle">
                <Shuffle size={18} />
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all">
                <Save size={18} /> Create Test
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTestModal;
