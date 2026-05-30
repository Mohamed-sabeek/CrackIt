import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import * as mockTestService from '../../services/mockTestService';

const TestInterfacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit(); // Auto submit
    }
  }, [timeLeft, isSubmitting, test]);

  const fetchTest = async () => {
    try {
      const data = await mockTestService.getTestById(id, token);
      setTest(data);
      setQuestions(data.questions || []);
      setTimeLeft(data.duration * 60);
    } catch (err) {
      console.error(err);
      alert('Failed to load test');
      navigate('/dashboard/mocktests');
    }
  };

  const handleSelectAnswer = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleMarkForReview = (qId) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || null
      }));

      const timeTaken = (test.duration * 60) - timeLeft;

      const result = await mockTestService.submitTest({
        testId: id,
        timeTaken,
        answers: formattedAnswers
      }, token);

      // Navigate to results summary modal or page
      navigate(`/dashboard/results/${result.attemptId}/summary`, { state: { summary: result } });
    } catch (err) {
      console.error(err);
      alert('Failed to submit test');
      setIsSubmitting(false);
    }
  };

  if (!test) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading Test...</div>;

  const currentQ = questions[currentIndex];
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-white select-none">
      
      {/* HEADER */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-bold text-lg">{test.title}</h1>
          <p className="text-xs text-slate-500">{test.category} • {test.subject}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-xl font-mono font-bold text-lg border border-indigo-100 dark:border-slate-700">
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => { if(window.confirm('Submit test early?')) handleSubmit(); }}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            Submit Test
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* MAIN QUESTION AREA */}
        <div className="flex-grow p-6 lg:p-10 overflow-y-auto">
          {currentQ && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
                <button 
                  onClick={() => toggleMarkForReview(currentQ._id)}
                  className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border ${markedForReview[currentQ._id] ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'}`}
                >
                  <AlertCircle size={16} /> Mark for Review
                </button>
              </div>

              <h2 className="text-xl font-medium mb-8 leading-relaxed whitespace-pre-wrap">{currentQ.question}</h2>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ._id] === option;
                  const letters = ['A', 'B', 'C', 'D', 'E'];
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelectAnswer(currentQ._id, option)}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20' 
                          : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold mr-4 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {letters[idx]}
                      </div>
                      <span className="text-base font-medium">{option}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                {currentIndex === questions.length - 1 ? (
                  <button 
                    onClick={() => { if(window.confirm('Submit test?')) handleSubmit(); }}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Submit Test <CheckCircle size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    Next <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR PALETTE */}
        <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold mb-3">Question Palette</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-600"></div> Answered: {answeredCount}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></div> Unanswered: {questions.length - answeredCount}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-400"></div> Marked: {Object.values(markedForReview).filter(Boolean).length}</div>
            </div>
          </div>
          
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q._id];
                const isMarked = markedForReview[q._id];
                const isCurrent = currentIndex === idx;
                
                let bgColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                if (isAnswered) bgColor = 'bg-indigo-600 text-white';
                if (isMarked) bgColor = 'bg-amber-400 text-amber-900';
                if (isAnswered && isMarked) bgColor = 'bg-indigo-600 border-b-4 border-amber-400 text-white';

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg font-bold text-sm transition-all ${bgColor} ${isCurrent ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterfacePage;
