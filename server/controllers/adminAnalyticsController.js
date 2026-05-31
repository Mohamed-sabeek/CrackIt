import User from '../models/User.js';
import Test from '../models/Test.js';
import TestAttempt from '../models/TestAttempt.js';
import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import Book from '../models/Book.js';
import Paper from '../models/Paper.js';
import CurrentAffair from '../models/CurrentAffair.js';
import ExamUpdate from '../models/ExamUpdate.js';

// @desc    Get complete admin analytics dashboard data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Fetch basic overview counts
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalMockTests = await Test.countDocuments();
    const totalAttempts = await TestAttempt.countDocuments();
    const totalAiSessions = await ChatSession.countDocuments();
    const totalStudyMaterials = await Book.countDocuments();
    const totalPreviousPapers = await Paper.countDocuments();
    const totalCurrentAffairs = await CurrentAffair.countDocuments();
    const totalExamUpdates = await ExamUpdate.countDocuments();

    // 2. Average Platform Accuracy
    const accuracyAggregation = await TestAttempt.aggregate([
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: "$percentage" }
        }
      }
    ]);
    const averageAccuracy = accuracyAggregation.length > 0 ? accuracyAggregation[0].avgAccuracy : 0;

    // 3. Student Activity Summary
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: thirtyDaysAgo } });
    const avgTestsPerUser = totalUsers > 0 ? (totalAttempts / totalUsers) : 0;

    // Active users: Users who attempted a test or chatted in last 30 days
    const activeTestUsers = await TestAttempt.distinct('user', { createdAt: { $gte: thirtyDaysAgo } });
    const activeChatUsers = await ChatSession.distinct('userId', { createdAt: { $gte: thirtyDaysAgo } });
    const activeUsers = new Set([...activeTestUsers.map(id => id.toString()), ...activeChatUsers.map(id => id.toString())]).size;

    // 4. Mock Test Analytics
    const testAnalytics = await TestAttempt.aggregate([
      {
        $group: {
          _id: "$test",
          attemptsCount: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgTimeTaken: { $avg: "$timeTaken" },
          totalQuestionsAttempted: { $sum: { $add: ["$correctAnswers", "$wrongAnswers"] } }
        }
      },
      {
        $lookup: {
          from: 'tests',
          localField: '_id',
          foreignField: '_id',
          as: 'testDetails'
        }
      },
      { $unwind: "$testDetails" },
      {
        $project: {
          testName: { $ifNull: ["$testDetails.title", "Unknown Test"] },
          attemptsCount: 1,
          avgScore: 1,
          avgTimeTaken: 1,
          totalQuestionsAttempted: 1
        }
      },
      { $sort: { attemptsCount: -1 } }
    ]);

    let mostAttemptedMockTest = null;
    let highestAvgScoreTest = null;
    let lowestAvgScoreTest = null;
    let avgCompletionTime = 0;
    let totalQuestionsAttempted = 0;

    if (testAnalytics.length > 0) {
      mostAttemptedMockTest = testAnalytics[0];
      const sortedByScore = [...testAnalytics].sort((a, b) => b.avgScore - a.avgScore);
      highestAvgScoreTest = sortedByScore[0];
      lowestAvgScoreTest = sortedByScore[sortedByScore.length - 1];
      
      const totalSeconds = testAnalytics.reduce((acc, curr) => acc + (curr.avgTimeTaken * curr.attemptsCount), 0);
      avgCompletionTime = totalAttempts > 0 ? Math.round(totalSeconds / totalAttempts) : 0;
      totalQuestionsAttempted = testAnalytics.reduce((acc, curr) => acc + curr.totalQuestionsAttempted, 0);
    }

    // 5. Subject Performance Analytics
    // Since we don't have separate Subject models, and Test models have 'category' or 'title'
    // We will aggregate by Test Category if available, or just mock fallback for now based on Test category
    const subjectAnalyticsRaw = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'tests',
          localField: 'test',
          foreignField: '_id',
          as: 'testDetails'
        }
      },
      { $unwind: "$testDetails" },
      {
        $group: {
          _id: { $ifNull: ["$testDetails.category", "General"] },
          avgAccuracy: { $avg: "$percentage" },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { avgAccuracy: -1 } }
    ]);

    const subjectAnalytics = subjectAnalyticsRaw.map(s => ({
      subject: s._id || 'General',
      avgAccuracy: Math.round(s.avgAccuracy),
      attempts: s.attempts
    }));

    // 6. AI Tutor Analytics
    const totalAiMessages = await ChatMessage.countDocuments();
    const avgMessagesPerSession = totalAiSessions > 0 ? Math.round(totalAiMessages / totalAiSessions) : 0;
    
    const activeAiUsersAggregation = await ChatSession.aggregate([
      {
        $group: {
          _id: "$userId",
          sessionsCount: { $sum: 1 }
        }
      },
      { $sort: { sessionsCount: -1 } },
      { $limit: 1 }
    ]);
    const mostActiveAiUserCount = activeAiUsersAggregation.length > 0 ? activeAiUsersAggregation[0].sessionsCount : 0;

    // 7. Recent Platform Activity Feed
    // Get latest 3 test attempts, 3 users, 3 exam updates
    const recentTests = await TestAttempt.find().sort({ createdAt: -1 }).limit(4).populate('user test');
    const recentUsers = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(3);
    const recentUpdates = await ExamUpdate.find().sort({ createdAt: -1 }).limit(3);

    let recentActivity = [];
    
    recentTests.forEach(t => {
      if (t.user && t.test) {
        recentActivity.push({
          id: `test-${t._id}`,
          type: 'test_attempt',
          title: 'Mock Test Attempted',
          description: `${t.user.name} scored ${t.score} in ${t.test.title}`,
          date: t.createdAt
        });
      }
    });

    recentUsers.forEach(u => {
      recentActivity.push({
        id: `user-${u._id}`,
        type: 'user_registered',
        title: 'New User Registration',
        description: `${u.name} joined the platform`,
        date: u.createdAt
      });
    });

    recentUpdates.forEach(u => {
      recentActivity.push({
        id: `update-${u._id}`,
        type: 'exam_update',
        title: 'Exam Update Published',
        description: `Status: ${u.status} for ${u.examName}`,
        date: u.createdAt
      });
    });

    // Sort combined feed by date descending and take top 10
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentActivity = recentActivity.slice(0, 10);

    // Formulate final response
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMockTests,
          totalAttempts,
          averageAccuracy: Math.round(averageAccuracy),
          totalAiSessions,
          totalStudyMaterials,
          totalPreviousPapers,
          totalCurrentAffairs,
          totalExamUpdates
        },
        studentActivity: {
          activeUsers,
          newUsersThisMonth,
          avgTestsPerUser: avgTestsPerUser.toFixed(1)
        },
        mockTestAnalytics: {
          mostAttemptedMockTest,
          highestAvgScoreTest,
          lowestAvgScoreTest,
          avgCompletionTime,
          totalQuestionsAttempted,
          testAttemptsChart: testAnalytics.slice(0, 5).map(t => ({
            name: t.testName,
            attempts: t.attemptsCount
          }))
        },
        subjectAnalytics,
        aiAnalytics: {
          totalAiSessions,
          totalAiMessages,
          avgMessagesPerSession,
          mostActiveAiUserCount
        },
        recentActivity
      }
    });

  } catch (error) {
    console.error('Admin Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server Error fetching analytics' });
  }
};
