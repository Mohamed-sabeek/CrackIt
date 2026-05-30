import React from 'react';
import { Flame, Clock, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyQuizWidget = ({
  activeQuiz,
  selectedQuizAns,
  showExplanation,
  handleDailyQuizSubmit,
  setSelectedQuizAns,
  setShowExplanation,
  currentQuizIndex,
  setCurrentQuizIndex,
  quizQuestions = []
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl shadow-xs transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Flame size={12} className="fill-amber-500" />
          <span>Question of the Day</span>
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
          <Clock size={12} strokeWidth={2.5} />
          <span>20s timer</span>
        </span>
      </div>

      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-extrabold">{activeQuiz.subject}</span>
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 leading-relaxed">{activeQuiz.question}</h4>

      {/* Options Grid */}
      <div className="space-y-2.5 mt-5">
        {activeQuiz.options.map((opt, oIdx) => {
          const isSelected = selectedQuizAns === opt.key;
          const isCorrect = opt.key === activeQuiz.correctAnswer;
          
          let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';
          if (selectedQuizAns) {
            if (isCorrect) {
              optStyle = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400';
            } else if (isSelected) {
              optStyle = 'border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-400';
            } else {
              optStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500';
            }
          }

          return (
            <button
              key={oIdx}
              disabled={!!selectedQuizAns}
              onClick={() => handleDailyQuizSubmit(opt.key)}
              className={`w-full flex items-center gap-3.5 p-3 rounded-xl border text-xs font-semibold transition-all duration-200 text-left ${optStyle} ${!selectedQuizAns ? 'cursor-pointer' : ''}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                isSelected ? 'bg-current text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}>{opt.key}</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Quiz Explanation Reveal */}
      {showExplanation && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs"
        >
          <div className="flex items-center gap-1.5 text-blue-500 font-extrabold mb-1">
            <Brain size={14} />
            <span>EXPLANATION</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{activeQuiz.explanation}</p>
          <button 
            onClick={() => {
              setSelectedQuizAns(null);
              setShowExplanation(false);
              setCurrentQuizIndex((currentQuizIndex + 1) % quizQuestions.length);
            }}
            className="mt-3.5 w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[10px] py-2 rounded-xl transition-colors cursor-pointer text-center block border-0"
          >
            Next Challenge
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DailyQuizWidget;
