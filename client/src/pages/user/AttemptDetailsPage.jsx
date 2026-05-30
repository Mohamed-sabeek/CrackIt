import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as mockTestService from '../../services/mockTestService';

const AttemptDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempt();
  }, [id]);

  const fetchAttempt = async () => {
    try {
      const data = await mockTestService.getAttemptDetails(id, token);
      setAttempt(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load attempt details');
      navigate('/dashboard/results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading Report...</div>;
  if (!attempt) return <div className="min-h-screen flex items-center justify-center dark:text-white">Report not found.</div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <button onClick={() => navigate('/dashboard/results')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft size={18} /> Back to Results
      </button>

      {/* OVERVIEW CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{attempt.test?.title || 'Unknown Test'}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Score</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{attempt.score} <span className="text-sm font-medium text-slate-400">/ {attempt.totalMarks}</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
            <p className={`text-2xl font-black ${attempt.percentage >= 80 ? 'text-green-500' : attempt.percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{attempt.percentage}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Time Taken</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2"><Clock size={20} className="text-indigo-500" /> {formatTime(attempt.timeTaken)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
            <div className="flex justify-between items-center text-sm font-bold mb-1">
              <span className="text-green-500 flex items-center gap-1"><CheckCircle size={14} /> {attempt.correctAnswers}</span>
              <span className="text-red-500 flex items-center gap-1"><XCircle size={14} /> {attempt.wrongAnswers}</span>
              <span className="text-slate-400 flex items-center gap-1"><AlertCircle size={14} /> {attempt.unansweredQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION ANALYSIS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Question Analysis</h2>
        
        {attempt.answers.map((ans, idx) => {
          const q = ans.questionId; // Populated question
          if (!q) return null;

          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-sm">{idx + 1}</span>
                {ans.isCorrect ? (
                  <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={14} /> Correct</span>
                ) : ans.selectedAnswer ? (
                  <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><XCircle size={14} /> Incorrect</span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><AlertCircle size={14} /> Unanswered</span>
                )}
              </div>

              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 whitespace-pre-wrap">{q.question}</h3>

              <div className="space-y-3 mb-6">
                {q.options.map((opt, optIdx) => {
                  const letters = ['A', 'B', 'C', 'D', 'E'];
                  
                  // Check if this option is the correct answer. 
                  // Handles both exact string match and legacy 'A', 'B', 'C' matches from old CSV uploads
                  let isCorrectOpt = opt === q.correctAnswer;
                  if (!isCorrectOpt && typeof q.correctAnswer === 'string' && q.correctAnswer.length === 1) {
                    isCorrectOpt = opt === q.options[letters.indexOf(q.correctAnswer.toUpperCase())];
                  }

                  let borderClass = 'border-slate-200 dark:border-slate-700';
                  let bgClass = '';
                  let textClass = 'text-slate-700 dark:text-slate-300';
                  let icon = null;

                  if (isCorrectOpt) {
                    borderClass = 'border-green-500';
                    bgClass = 'bg-green-50 dark:bg-green-900/10';
                    textClass = 'text-green-700 dark:text-green-400 font-bold';
                    icon = <CheckCircle size={18} className="text-green-500" />;
                  } else if (opt === ans.selectedAnswer) {
                    borderClass = 'border-red-500';
                    bgClass = 'bg-red-50 dark:bg-red-900/10';
                    textClass = 'text-red-700 dark:text-red-400 font-bold';
                    icon = <XCircle size={18} className="text-red-500" />;
                  }

                  return (
                    <div key={optIdx} className={`flex items-center justify-between p-4 rounded-xl border-2 ${borderClass} ${bgClass}`}>
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${opt === q.correctAnswer ? 'bg-green-500 text-white' : opt === ans.selectedAnswer ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {letters[optIdx]}
                        </span>
                        <span className={textClass}>{opt}</span>
                      </div>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl">
                  <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2 uppercase tracking-wider">Explanation</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttemptDetailsPage;
