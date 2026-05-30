import React, { useEffect, useRef } from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';

const formatResponseText = (text) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Check for headers
    if (line.trim().startsWith('###')) {
      return <h4 key={idx} className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-2.5 mb-1">{line.trim().substring(3).trim()}</h4>;
    }
    if (line.trim().startsWith('##')) {
      return <h3 key={idx} className="text-sm font-extrabold text-slate-900 dark:text-white mt-3.5 mb-1.5">{line.trim().substring(2).trim()}</h3>;
    }
    if (line.trim().startsWith('#')) {
      return <h2 key={idx} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{line.trim().substring(1).trim()}</h2>;
    }
    
    // Check for bullet points
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const cleanText = line.trim().substring(2).trim();
      return (
        <ul key={idx} className="list-disc pl-5 my-1.5">
          <li className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{cleanText}</li>
        </ul>
      );
    }
    
    // Empty line fallback
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    
    // Normal paragraph
    return <p key={idx} className="text-xs text-slate-700 dark:text-slate-350 font-medium leading-relaxed my-1.5">{line}</p>;
  });
};

const ChatWindow = ({
  messages = [],
  loading,
  isTyping,
  errorMessage,
  onSelectSuggestion,
  activeSessionTitle
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, errorMessage]);

  return (
    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-950 overflow-hidden h-full">
      
      {/* Active chat header */}
      <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/15">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeSessionTitle || 'CrackIt AI Tutor'}
            </h3>
            <p className="text-[9px] text-slate-500 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Llama-3.3 Ultra-fast Active Mentoring</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-slate-50/20 dark:bg-slate-950/5">
        {messages.length === 0 && !loading && !isTyping ? (
          /* Suggestion UI when chat is empty */
          <div className="py-8">
            <div className="text-center max-w-lg mx-auto mb-8 px-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4.5 shadow-xl shadow-blue-500/20">
                <Bot size={28} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                Welcome to CrackIt AI Tutor!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                I am your dedicated TNPSC Mentor. Ask me any conceptual topic, syllabus points, or dynamic MCQs from Tamil Nadu history to polity rules.
              </p>
            </div>
            
            <SuggestedQuestions onSelectSuggestion={onSelectSuggestion} />
          </div>
        ) : (
          /* Message bubbles listing */
          <div className="max-w-4xl mx-auto space-y-5 px-1">
            {messages.map((msg, idx) => {
              const isAi = msg.role === 'assistant' || msg.role === 'ai';
              return (
                <div
                  key={msg._id || idx}
                  className={`flex gap-4 ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'} max-w-[85%]`}
                >
                  {/* Bubble Avatar */}
                  <div className={`w-8.5 h-8.5 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                    isAi
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {isAi ? <Bot size={15} /> : <User size={15} />}
                  </div>

                  {/* Bubble Content Body */}
                  <div className={`px-5 py-4 rounded-2xl shadow-xs border ${
                    isAi
                      ? 'bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-900'
                      : 'bg-blue-600 text-white border-blue-500'
                  }`}>
                    {isAi ? formatResponseText(msg.content) : <p className="text-xs font-semibold leading-relaxed">{msg.content}</p>}
                  </div>
                </div>
              );
            })}

            {/* AI Typing loading bubble */}
            {isTyping && (
              <div className="flex gap-4 mr-auto max-w-[80%]">
                <div className="w-8.5 h-8.5 rounded-2xl flex-shrink-0 flex items-center justify-center bg-blue-600 text-white shadow-sm">
                  <Bot size={15} />
                </div>
                <div className="px-5 py-4.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-900 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Error Message Bubble */}
            {errorMessage && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl max-w-2xl mx-auto text-xs font-bold leading-normal shadow-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Auto scroll pointer */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatWindow;
