import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, History, ChevronLeft, ChevronRight, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
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
    const importGuestChat = async () => {
      const guestChat = localStorage.getItem('guest_ai_chat');
      if (guestChat) {
        try {
          const parsedChat = JSON.parse(guestChat);
          localStorage.removeItem('guest_ai_chat');
          localStorage.removeItem('guest_ai_questions');
          
          if (parsedChat.length > 0) {
            setLoading(true);
            const res = await api.post('/ai/import-guest-chat', { chatHistory: parsedChat });
            if (res.data.success) {
              await fetchSessions();
              await selectSession(res.data.sessionId);
              return; // skip the normal fetchSessions call below
            }
          }
        } catch (err) {
          console.error('Failed to import guest chat', err);
        } finally {
          setLoading(false);
        }
      }
      fetchSessions();
    };

    importGuestChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen]);

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
    <div className="h-[calc(100dvh-88px)] -mx-6 -mt-4 -mb-6 border-t md:h-[calc(100dvh-10rem)] md:m-0 md:border border-slate-200 dark:border-slate-800 md:rounded-3xl overflow-hidden flex bg-white dark:bg-slate-950 shadow-sm relative">
      


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
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex md:hidden bg-slate-900/40 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[80%] max-w-[320px] h-full"
            >
              <ChatSidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={selectSession}
                onDeleteSession={deleteSession}
                onNewChat={resetToNewChat}
              />
            </motion.div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

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
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
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
