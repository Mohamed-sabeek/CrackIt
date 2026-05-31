import React, { useEffect, useRef, useState } from 'react';
import { Bot, User, AlertCircle, History } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';
import aiLogo from '../../../assets/crackit-ai-logo.webp';

const AiAvatar = ({ className = "w-full h-full object-cover rounded-2xl" }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!imageError) {
    return (
      <img 
        src={aiLogo} 
        alt="CrackIt AI" 
        onError={() => setImageError(true)} 
        className={className}
      />
    );
  }
  return <Bot className="w-1/2 h-1/2 text-white" />;
};

const formatResponseText = (text) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Check for headers
    if (line.trim().startsWith('###')) {
      return <h4 key={idx} className="text-xs font-extrabold text-slate-800 dark:text-slate-50 mt-2.5 mb-1">{line.trim().substring(3).trim()}</h4>;
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
          <li className="text-xs text-slate-700 dark:text-slate-100 font-semibold leading-relaxed">{cleanText}</li>
        </ul>
      );
    }
    
    // Empty line fallback
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    
    // Normal paragraph
    return <p key={idx} className="text-xs text-slate-700 dark:text-slate-100 font-medium leading-relaxed my-1.5">{line}</p>;
  });
};

const ChatWindow = ({
  messages = [],
  loading,
  isTyping,
  errorMessage,
  onSelectSuggestion,
  activeSessionTitle,
  onToggleMobileSidebar
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
      <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle History"
          >
            <History size={20} />
          </button>
          
          <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md overflow-hidden hover:scale-105 transition-transform duration-200">
            <AiAvatar className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeSessionTitle || 'CrackIt AI Mentor'}
            </h3>
            <p className="text-[9px] text-slate-500 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Powered by Groq Llama 3.3</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-50/20 dark:bg-slate-950/5">
        {messages.length === 0 && !loading && !isTyping ? (
          /* Suggestion UI when chat is empty */
          <div className="py-8">
            <div className="text-center max-w-lg mx-auto mb-8 px-4">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-5.5 shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden">
                <AiAvatar className="w-full h-full object-cover rounded-3xl" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                Welcome to CrackIt AI Mentor!
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
                  className={`flex gap-2 md:gap-4 ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'} max-w-[95%] md:max-w-[85%]`}
                >
                  {/* Bubble Avatar */}
                  <div className={`w-7 h-7 md:w-8.5 md:h-8.5 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden mt-1 md:mt-0 ${
                    isAi
                      ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {isAi ? <AiAvatar className="w-full h-full object-cover rounded-xl md:rounded-2xl" /> : <User size={14} className="md:w-[15px]" />}
                  </div>

                  {/* Bubble Content Body */}
                  <div className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl shadow-xs border ${
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
                <div className="w-8.5 h-8.5 rounded-2xl flex-shrink-0 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <AiAvatar className="w-full h-full object-cover rounded-2xl" />
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
