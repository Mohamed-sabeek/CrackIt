import React, { useState } from 'react';
import UserAiAssistant from '../../components/user/ai/UserAiAssistant';

const UserAiAssistantPage = () => {
  const [chatMsg, setChatMsg] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Vanakkam! I am your Crackit AI study assistant. Ask me anything about the TNPSC Group 4 syllabus, study tips, or dynamic concept explanations!" }
  ]);

  const handleAiSuggestion = (text) => {
    setChatMsg(text);
    submitChat(text);
  };

  const submitChat = (msgText = chatMsg) => {
    if (!msgText.trim()) return;

    const userMessage = { role: 'user', text: msgText };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMsg('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "I can definitely help you with that! As your TNPSC AI Mentor, let me clarify: ";
      const textLower = msgText.toLowerCase();

      if (textLower.includes('directive principles') || textLower.includes('dpsp')) {
        reply = "Directive Principles of State Policy (Part IV, Articles 36-51) are non-justiciable in court but fundamental to governance. They direct the state to establish a social, economic, and political democracy. Key articles include Article 39A (Equal justice and free legal aid), Article 40 (Organization of village panchayats), and Article 44 (Uniform Civil Code).";
      } else if (textLower.includes('history') || textLower.includes('ancient')) {
        reply = "For TNPSC History, focus heavily on the Indus Valley Civilization, Guptas, Delhi Sultanate, Mughals, and the South Indian kingdoms (Cholas, Cheras, Pandyas, Vijayanagar). The Chola administrative system (Uttaramerur inscriptions detailing local self-government) is a highly repeated TNPSC question!";
      } else if (textLower.includes('geography')) {
        reply = "Important Geography themes: Rivers and drainage networks (Cauvery, Vaigai, Palar systems in Tamil Nadu), physical relief maps, southwest/northeast monsoon patterns (remember NE monsoon yields maximum rainfall to Tamil Nadu coast), and forest reservation types.";
      } else if (textLower.includes('polity tips')) {
        reply = "Polity represents roughly 15-20 questions in Group 4. Memorize Parts I to IV-A completely, schedule names (especially 7th, 8th, 11th, and 12th schedules), and key constitutional amendments like the 42nd, 44th, 73rd, and 74th!";
      } else {
        reply = `That is a vital topic for the TNPSC Group 4 syllabus. For "${msgText}", you should study the state board syllabus books (Standard 6th to 10th). Focus on key units, sub-topics, key articles, and memorize repeating mock patterns!`;
      }

      setChatHistory(prev => [...prev, { role: 'ai', text: reply }]);
      setIsAiTyping(false);
    }, 1200);
  };

  return (
    <div className="py-2">
      <UserAiAssistant 
        chatHistory={chatHistory}
        isAiTyping={isAiTyping}
        chatMsg={chatMsg}
        setChatMsg={setChatMsg}
        submitChat={submitChat}
        handleAiSuggestion={handleAiSuggestion}
      />
    </div>
  );
};

export default UserAiAssistantPage;
