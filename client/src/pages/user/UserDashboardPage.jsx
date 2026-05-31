import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, HelpCircle, Bot, Award, ChevronRight, 
  Loader2, Calendar, Target, CheckCircle2, XCircle, Percent, ArrowRight, ShieldCheck, BellRing
} from 'lucide-react';
import api from '../../config/api';
import PageHeader from '../../components/common/PageHeader';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [motivationText, setMotivationText] = useState('');

  // List of motivational quotes
  const quotes = [
    "Consistency beats intensity. Continue your TNPSC preparation today.",
    "Keep learning. Every mock test takes you closer to success.",
    "Success is the sum of small efforts repeated day in and day out. Let's make today count!"
  ];

  useEffect(() => {
    // Select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationText(randomQuote);

    const fetchDashboardData = async () => {
      try {
        const [overviewRes, activitiesRes] = await Promise.all([
          api.get('/dashboard/overview'),
          api.get('/dashboard/recent-activities')
        ]);
        if (overviewRes.data.success) {
          setData(overviewRes.data);
        }
        setRecentActivities(activitiesRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to sync preparation statistics. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format ISO Dates elegantly
  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Compiling your TNPSC tracking portal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-center space-y-4">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Sync Failure</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { statistics, recentResults, topPerforming, preparationSummary, userName } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto pb-12 text-sm text-slate-700 dark:text-slate-300"
    >
      {/* SECTION 1: WELCOME HERO */}
      <PageHeader 
        title={`Welcome back, ${userName || 'Student'} 👋`}
        description={motivationText}
      />

      {/* SECTION 2: PERFORMANCE STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mock Tests Taken</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{statistics?.testsTaken || 0}</span>
            <HelpCircle size={16} className="text-slate-400 dark:text-slate-650" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Best Score</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{statistics?.bestScore || '0%'}</span>
            <Award size={16} className="text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Accuracy</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{statistics?.averageAccuracy || '0%'}</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS */}
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link 
            to="/dashboard/syllabus" 
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:border-blue-500/40 hover:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen size={18} />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-900 dark:text-white truncate">Study Library</h5>
              <span className="text-[10px] text-slate-400">View materials</span>
            </div>
          </Link>

          <Link 
            to="/dashboard/papers" 
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:border-indigo-500/40 hover:bg-indigo-500/[0.02] dark:hover:bg-indigo-500/[0.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FileText size={18} />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-900 dark:text-white truncate">Previous Papers</h5>
              <span className="text-[10px] text-slate-400">Solve archives</span>
            </div>
          </Link>

          <Link 
            to="/dashboard/mocktests" 
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:border-purple-500/40 hover:bg-purple-500/[0.02] dark:hover:bg-purple-500/[0.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle size={18} />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-900 dark:text-white truncate">Take Mock Test</h5>
              <span className="text-[10px] text-slate-400">Practice questions</span>
            </div>
          </Link>

          <Link 
            to="/dashboard/ai-assistant" 
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] dark:hover:bg-emerald-500/[0.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Bot size={18} />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-900 dark:text-white truncate">Open AI Mentor</h5>
              <span className="text-[10px] text-slate-400">Ask questions</span>
            </div>
          </Link>

          <Link 
            to="/dashboard/exam-updates" 
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:border-pink-500/40 hover:bg-pink-500/[0.02] dark:hover:bg-pink-500/[0.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <BellRing size={18} />
            </div>
            <div className="overflow-hidden">
              <h5 className="font-bold text-slate-900 dark:text-white truncate">Exam Updates</h5>
              <span className="text-[10px] text-slate-400">Track notifications</span>
            </div>
          </Link>
        </div>
      </div>

      {/* TWO COLUMN GRID DETAILS */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: RECENT RESULTS & PREPARATION SUMMARY */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION 4: RECENT RESULTS */}
          <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Mock Test Results</h3>
              <Link to="/dashboard/results" className="text-xs text-blue-500 hover:text-blue-650 flex items-center gap-0.5 font-bold">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {recentResults.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-300">No mock test history</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Solve a mock test to view detailed analytics here.</p>
              </div>
            ) : (
              <div className="">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-900 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
                        <th className="py-2.5 pr-4">Test Name</th>
                        <th className="py-2.5 px-4 text-center">Score</th>
                        <th className="py-2.5 px-4 text-center">Accuracy</th>
                        <th className="py-2.5 px-4 text-center">Date</th>
                        <th className="py-2.5 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-900 dark:text-slate-200">
                      {recentResults.map((result) => (
                        <tr key={result._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors whitespace-nowrap">
                          <td className="py-3.5 pr-4 font-bold max-w-[200px] truncate">{result.testName}</td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-blue-600 dark:text-blue-500">{result.score}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-emerald-500">{result.accuracy}</td>
                          <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{formatDate(result.date)}</td>
                          <td className="py-3.5 pl-4 text-right">
                            <Link 
                              to={`/dashboard/results/${result._id}`}
                              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold text-[10px] transition-colors"
                            >
                              View Result
                              <ArrowRight size={10} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {recentResults.map((result) => (
                    <div key={result._id} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{result.testName}</div>
                        <div className="text-[10px] font-medium text-slate-400 shrink-0 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">{formatDate(result.date)}</div>
                      </div>
                      <div className="flex gap-6 border-y border-slate-200/50 dark:border-slate-800/50 py-3">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Score</div>
                          <div className="font-black text-blue-600 dark:text-blue-500 text-base">{result.score}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Accuracy</div>
                          <div className="font-semibold text-emerald-500 text-base">{result.accuracy}</div>
                        </div>
                      </div>
                      <Link 
                        to={`/dashboard/results/${result._id}`}
                        className="w-full flex justify-center items-center gap-1 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-[12px]"
                      >
                        View Full Result
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: PREPARATION SUMMARY */}
          <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Preparation Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Mocks Solved</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{preparationSummary?.totalMockTestsTaken || 0}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-0.5">Attempted Qs</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{preparationSummary?.totalQuestionsAttempted || 0}</span>
              </div>

              <div className="p-3 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/10 rounded-xl text-center">
                <span className="text-[10px] text-emerald-500 block mb-0.5">Correct</span>
                <span className="text-2xl font-black text-emerald-500">{preparationSummary?.totalCorrectAnswers || 0}</span>
              </div>

              <div className="p-3 bg-red-500/[0.03] dark:bg-red-500/[0.01] border border-red-500/10 rounded-xl text-center">
                <span className="text-[10px] text-red-500 block mb-0.5">Wrong</span>
                <span className="text-2xl font-black text-red-500">{preparationSummary?.totalWrongAnswers || 0}</span>
              </div>

              <div className="p-3 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.01] border border-indigo-500/10 rounded-xl text-center col-span-2 md:col-span-1">
                <span className="text-[10px] text-indigo-500 block mb-0.5">Overall Acc</span>
                <span className="text-2xl font-black text-indigo-500">{preparationSummary?.overallAccuracy || '0%'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TIMELINE & TOP PERFORMING */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* OPTIONAL SECTION: TOP PERFORMING */}
          {topPerforming && topPerforming.length > 0 && (
            <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Performing Mocks</h3>
              
              <div className="space-y-1.5">
                {topPerforming.map((top, index) => (
                  <Link 
                    key={index}
                    to={`/dashboard/results/${top._id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 hover:bg-amber-500/[0.02] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-sm">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] md:text-xs truncate max-w-[180px]">{top.testName}</span>
                    </div>
                    <span className="font-black text-amber-500 text-[11px] md:text-xs">{top.score}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: RECENT ACTIVITY TIMELINE */}
          <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 rounded-3xl p-4 md:p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Activity Timeline</h3>

            {recentActivities.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-2xl">
                <Target className="w-6 h-6 text-slate-400 dark:text-slate-650 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  No recent activity yet.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {recentActivities.map((activity, idx) => {
                  const itemPath = activity.type === 'mock_test' 
                    ? `/dashboard/results/${activity.attemptId}`
                    : '/dashboard/ai-assistant';
                  return (
                    <Link 
                      key={idx} 
                      to={itemPath}
                      className="flex items-start gap-2.5 text-xs py-2 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition-all border border-transparent hover:border-slate-150 dark:hover:border-slate-900/60 cursor-pointer block group"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                        activity.type === 'mock_test' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></span>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="font-bold text-slate-850 dark:text-slate-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-[11px] md:text-xs">
                            {activity.type === 'mock_test' ? 'Completed Mock Test' : 'Consulted AI Mentor'}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 flex-shrink-0">
                            {formatDate(activity.createdAt)}
                          </span>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-slate-550 dark:text-slate-400 mt-0.5 leading-tight font-medium truncate">
                          {activity.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default UserDashboardPage;
