import React from 'react';
import { Send, RotateCcw } from 'lucide-react';

const ChatInput = ({
  message,
  setMessage,
  onSendMessage,
  onClearChat,
  disabled
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
    }
  };

  return (
    <div className="p-4 bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
      {/* Clear/Reset button */}
      {onClearChat && (
        <button
          onClick={onClearChat}
          title="Clear Conversation"
          disabled={disabled}
          className="p-3 border border-slate-200 dark:border-slate-800 hover:border-red-500/20 dark:hover:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/10 text-slate-500 hover:text-red-500 rounded-2xl transition-all cursor-pointer bg-transparent disabled:opacity-40 disabled:hover:bg-transparent border-0 flex-shrink-0"
        >
          <RotateCcw size={16} />
        </button>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-2 rounded-2xl">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about polity, history, geography, aptitude..."
          disabled={disabled}
          className="flex-grow bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none px-3.5 placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-40 border-0 flex-shrink-0 cursor-pointer flex items-center justify-center"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
