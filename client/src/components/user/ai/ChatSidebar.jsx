import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Bot } from 'lucide-react';
import aiLogo from '../../../assets/crackit-ai-logo.webp';

const AiAvatar = ({ className = "w-full h-full object-cover rounded-lg" }) => {
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

const ChatSidebar = ({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat
}) => {
  return (
    <aside className="w-full h-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between flex-shrink-0">
      
      {/* Top action header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-bold hover:shadow-lg hover:shadow-blue-600/20 transition-all cursor-pointer border-0"
        >
          <Plus size={16} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-grow overflow-y-auto p-3.5 space-y-1">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 opacity-60">
            <MessageSquare size={24} className="text-slate-400 mb-2.5" />
            <p className="text-[10px] font-semibold text-slate-500">No previous sessions found.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = currentSessionId === session._id;
            return (
              <div
                key={session._id}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-xs font-semibold cursor-pointer border border-transparent ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
                onClick={() => onSelectSession(session._id)}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare size={14} className={isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="truncate pr-1 text-[11px] leading-none mt-0.5">{session.title}</span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session._id);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-transparent border-0 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-200">
            <AiAvatar className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-slate-700 dark:text-slate-200">CrackIt AI Mentor</h5>
            <p className="text-[8px] text-slate-400 font-medium">Powered by Groq Llama 3.3</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
