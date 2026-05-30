import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, UploadCloud } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import * as mockTestService from '../../../services/mockTestService';
import CreateTestModal from './CreateTestModal';

const TestsTab = () => {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await mockTestService.getTests({}, token);
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test and all its attempts?')) return;
    try {
      await mockTestService.deleteTest(id, token);
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Mock Tests</h4>
          <p className="text-sm text-slate-500">Manage daily, subject, and full tests.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all">
          <Plus size={18} />
          Create Test
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        {loading ? (
          <p className="text-center py-10 dark:text-white">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-800 text-slate-500">
                  <th className="pb-3 px-4 font-semibold">Test Details</th>
                  <th className="pb-3 px-4 font-semibold">Type & Target</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                  <th className="pb-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tests.map((test) => (
                  <tr key={test._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{test.title}</p>
                      <p className="text-xs text-slate-500">{test.totalQuestions} Qs • {test.duration} mins • {test.totalMarks} Marks</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300 capitalize font-medium">{test.testType}</p>
                      <p className="text-xs text-slate-500">{test.category} {test.subject && `• ${test.subject}`}</p>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={async () => {
                          await mockTestService.updateTest(test._id, { isPublished: !test.isPublished }, token);
                          fetchTests();
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide cursor-pointer ${test.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                      >
                        {test.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg" title="View Attempts">
                          <Eye size={16} />
                        </button>
                        <button className="text-amber-500 hover:bg-amber-50 p-2 rounded-lg" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(test._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateTestModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        token={token}
        onSave={async (data) => {
          try {
            await mockTestService.createTest(data, token);
            setIsCreateOpen(false);
            fetchTests();
          } catch (err) {
            console.error(err);
            alert('Failed to create test');
          }
        }} 
      />
    </div>
  );
};

export default TestsTab;
