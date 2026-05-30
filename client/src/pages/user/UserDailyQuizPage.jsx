import React, { useState } from 'react';
import UserDailyQuiz from '../../components/user/dailyquiz/UserDailyQuiz';
import { quizQuestions } from '../../data/mockData';

const UserDailyQuizPage = () => {
  const [selectedQuizAns, setSelectedQuizAns] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const activeQuiz = quizQuestions[currentQuizIndex];

  const handleDailyQuizSubmit = (selectedKey) => {
    setSelectedQuizAns(selectedKey);
    setShowExplanation(true);
  };

  return (
    <div className="py-2">
      <UserDailyQuiz 
        studyStreak={12}
        currentQuizIndex={currentQuizIndex}
        quizQuestions={quizQuestions}
        activeQuiz={activeQuiz}
        selectedQuizAns={selectedQuizAns}
        showExplanation={showExplanation}
        handleDailyQuizSubmit={handleDailyQuizSubmit}
        setSelectedQuizAns={setSelectedQuizAns}
        setShowExplanation={setShowExplanation}
        setCurrentQuizIndex={setCurrentQuizIndex}
      />
    </div>
  );
};

export default UserDailyQuizPage;
