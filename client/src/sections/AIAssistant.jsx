import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Sparkles, BrainCircuit, Send, Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import aiLogoImg from '../assets/crackit-ai-logo.webp';

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am Crackit AI, your personal study mentor. Ask me any question about the TNPSC syllabus, Indian Constitution, History, Geography, or prep tips!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('guest_ai_chat');
    const savedCount = localStorage.getItem('guest_ai_questions');
    
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (err) {
        console.error('Failed to parse guest chat');
      }
    }
    
    if (savedCount) {
      setGuestMessageCount(parseInt(savedCount, 10));
    }
  }, []);

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (guestMessageCount >= 2) {
      setIsModalOpen(true);
      return;
    }

    const userMsg = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    localStorage.setItem('guest_ai_chat', JSON.stringify(newMessages));
    
    setInputText('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/guest-chat', {
        message: userMsg.content,
        chatHistory: messages.filter(m => m.role === 'user' || m.role === 'assistant')
      });

      if (response.data.success) {
        const aiMsg = response.data.message;
        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);
        localStorage.setItem('guest_ai_chat', JSON.stringify(finalMessages));
        
        const newCount = guestMessageCount + 1;
        setGuestMessageCount(newCount);
        localStorage.setItem('guest_ai_questions', newCount.toString());
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMsg = { role: 'assistant', content: 'Unable to generate response. Please try again.' };
      setMessages([...newMessages, errorMsg]);
      // Do not increment count on error
    } finally {
      setIsTyping(false);
    }
  };

  const handleAuthRedirect = (path) => {
    setIsModalOpen(false);
    navigate(path);
  };

  return (
    <section id="ai" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Soft elegant mesh gradients for premium depth */}
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-blue-300/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-300/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Details Column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-blue-700 font-medium text-xs mb-6 shadow-sm">
              <Bot size={14} />
              AI Assistant Preview
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Your Personal AI Study Mentor
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg mb-8 leading-relaxed">
              Experience personalized learning like never before. Our advanced AI mentor understands the TNPSC syllabus, answers complex polity queries, analyses histories, and outlines standard preparation maps instantly.
            </p>

            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50/70 border border-blue-100/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-base mb-1">Instant Doubt Solving</h4>
                  <p className="text-slate-500 text-sm">Ask anything about standard school textbooks and get context-aware answers.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50/70 border border-indigo-100/50 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm">
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-base mb-1">Interactive Syllabus Guidance</h4>
                  <p className="text-slate-500 text-sm">Targeted recommendations mapping to the exact unit breakdowns of standard state exams.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-50/70 border border-purple-100/50 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600 shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-base mb-1">Personalized Prep Path</h4>
                  <p className="text-slate-500 text-sm">Logs state progress, highlights conceptual gaps, and designs focused modules.</p>
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('ai')?.offsetTop, behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/10 text-sm hover:shadow-lg hover:shadow-blue-500/20"
              >
                Try AI Mentor Now
              </button>
              <span className="text-xs text-slate-400 font-medium italic ml-2">
                * Guest preview allows 2 queries.
              </span>
            </div>
          </motion.div>

          {/* Interactive Chatbot Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Chat Box Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden relative z-10 flex flex-col h-[480px] hover:border-slate-300 transition-all duration-300">
              
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden ring-1 ring-slate-200 shadow-sm">
                    <img src={aiLogoImg} alt="Crackit AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-slate-950 font-bold text-sm">Crackit AI</h5>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online Preview
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Chat Screen area with blur/lock state */}
              <div 
                ref={chatContainerRef}
                className={`p-5 flex-1 overflow-y-auto bg-slate-50/10 flex flex-col gap-4 relative transition-all duration-300 ${
                  guestMessageCount >= 2 ? 'filter blur-[1.5px] pointer-events-none select-none' : ''
                }`}
              >
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'self-end bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-medium rounded-tr-sm shadow-sm'
                        : 'self-start bg-slate-100 text-slate-800 border border-slate-200/50 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="self-start bg-slate-100 text-slate-800 border border-slate-200/50 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                  </div>
                )}
              </div>

              {/* Lock screen overlay */}
              {guestMessageCount >= 2 && (
                <div className="absolute inset-0 z-20 bg-slate-900/10 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-6 rounded-2xl shadow-xl max-w-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center mb-4">
                      <Lock size={18} />
                    </div>
                    <h5 className="font-bold text-slate-950 text-base mb-2">Continue Learning with Crackit AI</h5>
                    <p className="text-slate-500 text-xs leading-relaxed mb-5">
                      Login or create an account to continue unlimited AI-powered exam preparation.
                    </p>
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => handleAuthRedirect('/login')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => handleAuthRedirect('/register')}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50/50 relative z-30">
                <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-2.5 border border-slate-200">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      guestMessageCount >= 2 
                        ? "Chat limit reached. Please authenticate..." 
                        : "Ask about constitution, history, tips..."
                    } 
                    disabled={guestMessageCount >= 2 || isTyping}
                    className="bg-transparent border-none outline-none text-slate-800 flex-1 text-sm disabled:cursor-not-allowed" 
                  />
                  <button 
                    type="submit"
                    disabled={guestMessageCount >= 2 || !inputText.trim() || isTyping}
                    className="text-blue-500 hover:text-blue-600 disabled:text-slate-300 disabled:hover:text-slate-300 transition-colors p-1"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
            
          </motion.div>
        </div>
      </div>

      {/* Main Login Restriction Modal Prompt */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white/95 backdrop-blur-md border border-slate-200 max-w-md w-full rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center mb-5 shadow-md shadow-blue-500/10">
                <Lock size={20} />
              </div>

              <h3 className="text-xl font-bold text-slate-950 mb-3 tracking-tight">
                🔒 Continue Learning with CrackIt AI
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                You have used your 2 free AI preview questions. <br/>
                Login or create an account to continue chatting with the AI Tutor and access all Crack_It learning resources.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                <button 
                  onClick={() => handleAuthRedirect('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all text-sm shadow-md shadow-blue-500/10 hover:shadow-lg"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleAuthRedirect('/register')}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Register
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AIAssistant;
