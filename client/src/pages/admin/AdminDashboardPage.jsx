import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, BookOpen, BrainCircuit, GraduationCap, 
  FileText, Megaphone, Loader2, Target, Clock, AlertCircle, RefreshCw, Layers, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import adminAnalyticsService from '../../services/adminAnalyticsService';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';

const StatCard = ({ icon: Icon, label, value, colorClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
  >
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h4>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAnalyticsService.getAnalytics();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gathering platform analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
        <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-5 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const {
    overview,
    studentActivity,
    mockTestAnalytics,
    subjectAnalytics,
    aiAnalytics,
    recentActivity
  } = data;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <PageHeader 
        title="Admin Console Active" 
        description="Monitor platform vitals, user engagement, and content metrics." 
      />

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} label="Total Users" value={overview.totalUsers} 
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" delay={0.05} 
        />
        <StatCard 
          icon={Target} label="Platform Accuracy" value={`${overview.averageAccuracy}%`} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" delay={0.1} 
        />
        <StatCard 
          icon={FileText} label="Mock Test Attempts" value={overview.totalAttempts} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" delay={0.15} 
        />
        <StatCard 
          icon={BrainCircuit} label="AI Conversations" value={overview.totalAiSessions} 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" delay={0.2} 
        />
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detailed Stats Column */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* STUDENT ACTIVITY */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
              <Users className="text-indigo-500" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white">Student Activity Summary</h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Users (30d)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{studentActivity.activeUsers}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">New Users (30d)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{studentActivity.newUsersThisMonth}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Tests / User</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{studentActivity.avgTestsPerUser}</p>
              </div>
            </div>
          </div>

          {/* MOCK TEST ANALYTICS */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
              <FileText className="text-purple-500" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white">Mock Test Insights</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Most Attempted Test</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {mockTestAnalytics.mostAttemptedMockTest ? mockTestAnalytics.mostAttemptedMockTest.testName : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Completion Time</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {Math.floor(mockTestAnalytics.avgCompletionTime / 60)}m {mockTestAnalytics.avgCompletionTime % 60}s
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Highest Avg Score</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 line-clamp-1">
                  {mockTestAnalytics.highestAvgScoreTest ? `${mockTestAnalytics.highestAvgScoreTest.testName} (${Math.round(mockTestAnalytics.highestAvgScoreTest.avgScore)} pts)` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Lowest Avg Score</p>
                <p className="text-lg font-bold text-red-500 dark:text-red-400 line-clamp-1">
                  {mockTestAnalytics.lowestAvgScoreTest ? `${mockTestAnalytics.lowestAvgScoreTest.testName} (${Math.round(mockTestAnalytics.lowestAvgScoreTest.avgScore)} pts)` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* AI TUTOR ANALYTICS */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
              <BrainCircuit className="text-amber-500" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white">AI Tutor Analytics</h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sessions</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{aiAnalytics.totalAiSessions}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Messages</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{aiAnalytics.totalAiMessages}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg Msgs/Session</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{aiAnalytics.avgMessagesPerSession}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Most Active User Sessions</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{aiAnalytics.mostActiveAiUserCount}</p>
              </div>
            </div>
          </div>

          {/* CONTENT ANALYTICS */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
              <BookOpen className="text-cyan-500" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white">Content Library Stats</h3>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Study Materials</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.totalStudyMaterials}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Previous Papers</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.totalPreviousPapers}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Affairs</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.totalCurrentAffairs}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Exam Updates</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.totalExamUpdates}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Activity Column */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[800px]">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
            <Clock className="text-slate-500 dark:text-slate-400" size={18} />
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity Feed</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {recentActivity.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      {activity.type === 'test_attempt' && <FileText size={16} />}
                      {activity.type === 'user_registered' && <Users size={16} />}
                      {activity.type === 'exam_update' && <Megaphone size={16} />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{activity.title}</h4>
                        <time className="text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</time>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Activity size={32} className="mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
