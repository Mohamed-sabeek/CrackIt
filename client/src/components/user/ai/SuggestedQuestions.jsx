import React from 'react';

const SUGGESTIONS = [
  { text: 'Explain Fundamental Rights', icon: '📜' },
  { text: 'Explain Directive Principles', icon: '🏛' },
  { text: 'What is El Niño?', icon: '🌍' },
  { text: 'TNPSC History Revision Tips', icon: '📚' },
  { text: 'Explain Indian Constitution Basics', icon: '🧠' },
  { text: 'Explain Indian Economy for TNPSC', icon: '📈' }
];

const SuggestedQuestions = ({ onSelectSuggestion }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 text-center">
        ⚡ Choose a topic below to start learning immediately
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggestion(item.text)}
            className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left rounded-2xl transition-all cursor-pointer group shadow-sm"
          >
            <span className="text-xl bg-slate-100 dark:bg-slate-850 p-2 rounded-xl group-hover:bg-blue-500/10 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
