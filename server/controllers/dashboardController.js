import TestAttempt from '../models/TestAttempt.js';
import ChatSession from '../models/ChatSession.js';
import User from '../models/User.js';

// @desc    Get comprehensive dynamic dashboard aggregation for a student
// @route   GET /api/dashboard/overview
// @access  Private
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user detail
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // 2. Fetch all test attempts for statistics and prep summary calculations
    const attempts = await TestAttempt.find({ user: userId })
      .populate('test', 'title totalQuestions')
      .sort({ createdAt: -1 });

    const testsTaken = attempts.length;

    let bestScore = 0;
    let totalPercentage = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrectAnswers = 0;
    let totalWrongAnswers = 0;

    attempts.forEach(attempt => {
      if (attempt.percentage > bestScore) {
        bestScore = attempt.percentage;
      }
      totalPercentage += attempt.percentage;
      
      const correct = attempt.correctAnswers || 0;
      const wrong = attempt.wrongAnswers || 0;
      totalCorrectAnswers += correct;
      totalWrongAnswers += wrong;
      totalQuestionsAttempted += (correct + wrong + (attempt.unansweredQuestions || 0));
    });

    const averageAccuracy = testsTaken > 0 ? Math.round(totalPercentage / testsTaken) : 0;

    // 3. Fetch AI tutor sessions
    const chatSessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    const aiChats = await ChatSession.countDocuments({ userId });

    // 4. Populate latest 5 mock test results
    const recentResults = attempts.slice(0, 5).map(attempt => ({
      _id: attempt._id,
      testName: attempt.test?.title || 'Mock Test',
      score: `${Math.round(attempt.percentage)}%`,
      accuracy: `${Math.round((attempt.correctAnswers / (attempt.correctAnswers + attempt.wrongAnswers || 1)) * 100)}%`,
      date: attempt.createdAt
    }));

    // 5. Populate top performing mock tests (best 3 attempts)
    const topPerforming = [...attempts]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3)
      .map(attempt => ({
        _id: attempt._id,
        testName: attempt.test?.title || 'Mock Test',
        score: `${Math.round(attempt.percentage)}%`
      }));

    // 6. Build real Recent Activity Timeline (Limit to 10 activities)
    // Merge attempts and chat sessions to represent real recent activity logs!
    const activities = [];

    attempts.slice(0, 10).forEach(attempt => {
      activities.push({
        type: 'test',
        title: 'Completed Mock Test',
        text: `Scored ${Math.round(attempt.percentage)}% on ${attempt.test?.title || 'Practice Paper'}`,
        time: attempt.createdAt
      });
    });

    chatSessions.slice(0, 10).forEach(chat => {
      activities.push({
        type: 'ai',
        title: 'Used AI Tutor',
        text: `Consulted on "${chat.title || 'TNPSC Subject'}"`,
        time: chat.createdAt
      });
    });

    // Sort combined activities by newest first
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    // 7. Complete Preparation Summary
    const preparationSummary = {
      totalMockTestsTaken: testsTaken,
      totalQuestionsAttempted,
      totalCorrectAnswers,
      totalWrongAnswers,
      overallAccuracy: `${testsTaken > 0 ? Math.round((totalCorrectAnswers / (totalCorrectAnswers + totalWrongAnswers || 1)) * 100) : 0}%`
    };

    res.status(200).json({
      success: true,
      userName: user.name,
      statistics: {
        testsTaken,
        bestScore: `${Math.round(bestScore)}%`,
        averageAccuracy: `${averageAccuracy}%`,
        aiChats
      },
      recentResults,
      topPerforming,
      recentActivities: sortedActivities,
      preparationSummary
    });

  } catch (error) {
    console.error('Dashboard aggregation error:', error);
    res.status(500).json({ success: false, message: 'Failed to aggregate dashboard overview data.' });
  }
};

// @desc    Get highly optimized recent activity timeline for dashboard
// @route   GET /api/dashboard/recent-activities
// @access  Private
export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch latest 5 mock test attempts with strict projection
    const testAttempts = await TestAttempt.find(
      { user: userId },
      { test: 1, percentage: 1, createdAt: 1 }
    )
      .populate('test', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // 2. Fetch latest 5 AI Tutor sessions with strict projection
    const chatSessions = await ChatSession.find(
      { userId },
      { title: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Format and merge activities
    const activities = [];

    testAttempts.forEach(attempt => {
      activities.push({
        attemptId: attempt._id,
        type: 'mock_test',
        title: 'Completed Mock Test',
        description: `Scored ${Math.round(attempt.percentage)}% on ${attempt.test?.title || 'Practice Paper'}`,
        createdAt: attempt.createdAt
      });
    });

    chatSessions.forEach(chat => {
      activities.push({
        type: 'ai_tutor',
        title: 'Used AI Tutor',
        description: `Consulted on: "${chat.title || 'TNPSC Subject'}"`,
        createdAt: chat.createdAt
      });
    });

    // 4. Sort merged list by newest first (limit to max 10)
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json(sortedActivities);

  } catch (error) {
    console.error('Failed to retrieve recent activities:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve recent activities.' });
  }
};
