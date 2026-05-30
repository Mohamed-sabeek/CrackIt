import React from 'react';
import { Flame, Target } from 'lucide-react';

const WelcomeBanner = ({ user, studyStreak = 0 }) => {
  const totalTargets = user?.studyTargets?.length || 0;
  const completedTargets = user?.studyTargets?.filter(t => t.completed)?.length || 0;
  const targetPercent = totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl relative overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">ACTIVE WORKSPACE</span>
            <div className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
              <Flame size={12} className="fill-amber-400" />
              <span>{studyStreak} Day Streak</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Vanakkam, {user?.name || 'Student'} 👋</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
            "Success is the sum of small efforts, repeated day in and day out." Focus on your target today. Your current mock test accuracy is up by {user?.latestMockScore || 0}% this week!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md p-4.5 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Target size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">TODAY'S TARGET GOAL</span>
            <h4 className="text-xl font-extrabold text-white mt-0.5">{targetPercent}% Completed</h4>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${targetPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
