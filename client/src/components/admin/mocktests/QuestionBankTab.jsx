import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit, Search } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import * as mockTestService from '../../../services/mockTestService';

const QuestionBankTab = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    subject: 'All'
  });

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await mockTestService.getQuestions(filters, token);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return alert('Please select a file');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await mockTestService.bulkUploadQuestions(formData, token);
      setFile(null);
      fetchQuestions();
      alert('Upload successful');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await mockTestService.deleteQuestion(id, token);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <h4 className="font-bold mb-4 dark:text-white">Bulk Upload Questions (Excel/CSV)</h4>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
          />
          <button 
            onClick={handleBulkUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Required columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation, Subject, Difficulty, Category</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 dark:text-white">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-800 text-slate-500">
                  <th className="pb-3 px-4 font-semibold">Question</th>
                  <th className="pb-3 px-4 font-semibold">Category/Subject</th>
                  <th className="pb-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-2">{q.question}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Ans: {q.correctAnswer}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500">
                      {q.category} • {q.subject}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankTab;
