import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Brain } from 'lucide-react';

const UserDailyQuiz = ({
  studyStreak = 12,
  currentQuizIndex,
  quizQuestions = [],
  activeQuiz,
  selectedQuizAns,
  showExplanation,
  handleDailyQuizSubmit,
  setSelectedQuizAns,
  setShowExplanation,
  setCurrentQuizIndex
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-24 h-24 bg-amber-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border-4 border-amber-100 dark:border-slate-800">
        <Flame size={40} className="text-amber-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Daily Quiz Module</h2>
      <p className="text-slate-500 max-w-md mx-auto">This module is currently under development. Soon you will be able to challenge yourself with timed TNPSC syllabus-aligned daily quizzes to build your study streaks!</p>
    </motion.div>
  );
};

export default UserDailyQuiz;
