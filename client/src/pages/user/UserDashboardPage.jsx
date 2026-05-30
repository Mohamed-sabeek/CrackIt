import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import WelcomeBanner from '../../components/user/dashboard/WelcomeBanner';
import ProgressCards from '../../components/user/dashboard/ProgressCards';
import SubjectProgress from '../../components/user/dashboard/SubjectProgress';
import DailyQuizWidget from '../../components/user/dashboard/DailyQuizWidget';
import ActivityTimeline from '../../components/user/dashboard/ActivityTimeline';
import QuickActions from '../../components/user/dashboard/QuickActions';
import { quizQuestions } from '../../data/mockData';

const UserDashboardPage = () => {
  const { user, updateProgress } = useAuth();
  
  // Daily Quiz state
  const [selectedQuizAns, setSelectedQuizAns] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const activeQuiz = quizQuestions[currentQuizIndex];

  const handleDailyQuizSubmit = async (selectedKey) => {
    setSelectedQuizAns(selectedKey);
    setShowExplanation(true);

    const isCorrect = selectedKey === activeQuiz.correctAnswer;
    const newActivity = {
      id: Date.now(),
      type: 'quiz',
      text: `Completed Daily Quiz (${activeQuiz.subject}) - ${isCorrect ? 'Correct' : 'Incorrect'}`,
      time: 'Just now'
    };

    // Increment streak by 1 if not updated today, and increment study hours slightly
    const updatedStreak = (user?.studyStreak || 0) + 1;
    const updatedHours = parseFloat(((user?.studyHours || 0) + 0.1).toFixed(2));
    const updatedTimeline = [newActivity, ...(user?.activityTimeline || [])].slice(0, 10);

    try {
      await updateProgress({
        studyStreak: updatedStreak,
        studyHours: updatedHours,
        activityTimeline: updatedTimeline
      });
    } catch (err) {
      console.error('Failed to log daily quiz progress:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} studyStreak={user?.studyStreak || 0} />

      {/* Progress Cards */}
      {/* Module currently hiding static progress cards until live data integrates */}

      {/* Quick Resume Actions */}
      <QuickActions user={user} />

      {/* Double Column Breakdown */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Syllabus breakdown) */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-xs text-center flex flex-col items-center justify-center min-h-[400px]">
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Syllabus Tracking Engine</h3>
             <p className="text-xs text-slate-400 dark:text-slate-500">Live analytics module is currently compiling historical data.</p>
           </div>
        </div>

        {/* Right Column (Daily Quiz & Activity logs) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-xs text-center flex flex-col items-center justify-center min-h-[200px]">
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Daily Quiz Module</h3>
             <p className="text-xs text-slate-400 dark:text-slate-500">Feature coming soon.</p>
           </div>
          <ActivityTimeline user={user} />
        </div>

      </div>
    </div>
  );
};

export default UserDashboardPage;
