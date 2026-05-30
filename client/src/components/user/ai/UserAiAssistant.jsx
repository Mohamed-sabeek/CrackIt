import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';

const UserAiAssistant = ({
  chatHistory = [],
  isAiTyping,
  chatMsg,
  setChatMsg,
  submitChat,
  handleAiSuggestion
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col justify-between"
    >
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-4.5 rounded-3xl mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Crackit AI Syllabus Mentor</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Online • Explains articles, historical dates, and aptitude tricks instantly</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
          Interactive Mode
        </div>
      </div>

      {/* Chats container */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-6 rounded-3xl space-y-4 mb-4">
        {chatHistory.map((ch, idx) => {
          const isAi = ch.role === 'ai';
          return (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                isAi ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {isAi ? 'AI' : 'ME'}
              </div>
              <div className={`p-4.5 rounded-2xl text-xs leading-relaxed ${
                isAi 
                  ? 'bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-900' 
                  : 'bg-blue-600 text-white'
              }`}>
                {ch.text}
              </div>
            </div>
          );
        })}

        {/* Typing animation block */}
        {isAiTyping && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-600 text-white text-xs font-bold">
              AI
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-900 rounded-2xl text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions triggers */}
      <div className="flex gap-2 overflow-x-auto pb-3 flex-shrink-0">
        {[
          'Explain Directive Principles',
          'TNPSC History Tips',
          'Important Geography Topics',
          'Polity Tips'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleAiSuggestion(chip)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950 px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500/20 hover:text-blue-500 cursor-pointer whitespace-nowrap border-0"
          >
            "{chip}"
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900/60 p-3 rounded-2xl flex items-center gap-3 flex-shrink-0">
        <input
          type="text"
          value={chatMsg}
          onChange={(e) => setChatMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitChat()}
          placeholder="Ask AI study mentor about Tamil literature, polity rules, or aptitude volume..."
          className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none px-2"
        />
        <button
          onClick={() => submitChat()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 border-0"
        >
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default UserAiAssistant;
