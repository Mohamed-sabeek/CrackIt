import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import api from '../../config/api';
import ChatSidebar from '../../components/user/ai/ChatSidebar';
import ChatWindow from '../../components/user/ai/ChatWindow';
import ChatInput from '../../components/user/ai/ChatInput';

const UserAiAssistantPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionTitle, setCurrentSessionTitle] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. Fetch all chat history sessions on mount
  const fetchSessions = async () => {
    try {
      const res = await api.get('/ai/sessions');
      if (res.data && res.data.sessions) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 2. Fetch all messages in the selected session
  const selectSession = async (sessionId) => {
    setLoading(true);
    setErrorMessage('');
    setIsMobileSidebarOpen(false);
    try {
      const res = await api.get(`/ai/sessions/${sessionId}`);
      if (res.data && res.data.messages) {
        setCurrentSessionId(sessionId);
        setCurrentSessionTitle(res.data.session.title);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load session details', err);
      setErrorMessage('Failed to load this conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete a specific session
  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      await api.delete(`/ai/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (currentSessionId === sessionId) {
        resetToNewChat();
      }
    } catch (err) {
      console.error('Failed to delete session', err);
      alert('Failed to delete chat session. Please try again.');
    }
  };

  // 4. Reset state to New Chat mode
  const resetToNewChat = () => {
    setCurrentSessionId(null);
    setCurrentSessionTitle('');
    setMessages([]);
    setMessageText('');
    setErrorMessage('');
    setIsMobileSidebarOpen(false);
  };

  // 5. Send Message to AI Tutor backend API
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const trimmedText = textToSend.trim();
    
    // Add user message optimistically to bubble list
    const optimisticUserMessage = {
      role: 'user',
      content: trimmedText,
      _id: `temp-${Date.now()}`
    };
    
    setMessages(prev => [...prev, optimisticUserMessage]);
    setMessageText('');
    setIsTyping(true);
    setErrorMessage('');

    try {
      const res = await api.post('/ai/chat', {
        message: trimmedText,
        sessionId: currentSessionId // sends active session ID, or null if starting a new chat session
      });

      if (res.data && res.data.success) {
        // Update current active session context
        if (res.data.isNewSession) {
          setCurrentSessionId(res.data.sessionId);
          setCurrentSessionTitle(res.data.sessionTitle);
          // Refetch sessions sidebar listings
          fetchSessions();
        }
        
        // Append response message from Groq
        setMessages(prev => [
          ...prev.filter(m => !m._id.startsWith('temp-')), // clean up optimistic temp message
          res.data.userMessage,
          res.data.replyMessage
        ]);
      }
    } catch (err) {
      console.error('AI chat failed:', err);
      
      // Remove the optimistic user message if first call fails and show graceful user-friendly error
      setMessages(prev => prev.filter(m => !m._id.startsWith('temp-')));
      
      const errorMsgText = err.response?.data?.message || 'AI Tutor is temporarily unavailable. Please try again later.';
      setErrorMessage(errorMsgText);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex bg-white dark:bg-slate-950 shadow-sm relative">
      
      {/* Mobile Toggle Trigger Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="absolute top-4 left-4 z-40 p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl md:hidden text-slate-700 dark:text-slate-200 border-0 cursor-pointer shadow-sm"
      >
        {isMobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block h-full">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onNewChat={resetToNewChat}
        />
      </div>

      {/* Mobile drawer overlay sidebar */}
      {isMobileSidebarOpen && (
        <div className="absolute inset-0 z-30 flex md:hidden bg-slate-900/40 backdrop-blur-xs">
          <div className="w-80 h-full animate-slide-in">
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSelectSession={selectSession}
              onDeleteSession={deleteSession}
              onNewChat={resetToNewChat}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main chat window container */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0">
        
        {/* Chat conversations area */}
        <ChatWindow
          messages={messages}
          loading={loading}
          isTyping={isTyping}
          errorMessage={errorMessage}
          onSelectSuggestion={handleSendMessage}
          activeSessionTitle={currentSessionTitle}
        />

        {/* Input box bottom panel */}
        <ChatInput
          message={messageText}
          setMessage={setMessageText}
          onSendMessage={handleSendMessage}
          onClearChat={currentSessionId ? resetToNewChat : null}
          disabled={loading || isTyping}
        />

      </div>

    </div>
  );
};

export default UserAiAssistantPage;
