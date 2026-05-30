import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import { getGroqReply } from '../services/aiService.js';

// In-memory rate limiting map: userId -> array of timestamps
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

const checkRateLimit = (userId) => {
  const now = Date.now();
  if (!rateLimitMap.has(userId)) {
    rateLimitMap.set(userId, [now]);
    return true;
  }

  const timestamps = rateLimitMap.get(userId).filter(t => now - t < RATE_LIMIT_WINDOW);
  if (timestamps.length >= MAX_REQUESTS) {
    return false;
  }

  timestamps.push(now);
  rateLimitMap.set(userId, timestamps);
  return true;
};

// System prompt for TNPSC AI Tutor
const SYSTEM_PROMPT = `You are CrackIt AI Tutor.

You specialize in:
* TNPSC Group 1
* TNPSC Group 2
* TNPSC Group 2A
* TNPSC Group 4
* VAO Exams

Subjects:
* Indian Polity
* Indian History
* Tamil Nadu History
* Geography
* Economy
* Science
* Current Affairs
* Aptitude
* Environment

Instructions:
1. Give exam-oriented explanations.
2. Keep explanations simple.
3. Mention TNPSC relevance whenever possible.
4. Provide memory tricks and mnemonics when useful.
5. Use bullet points.
6. Explain difficult concepts in easy language.
7. If the user asks an MCQ, explain why the correct option is correct and why the others are wrong.
8. Never provide misleading or fabricated information.
9. Focus on educational guidance.
10. Format responses using headings and bullets.`;

// @desc    Send a message & get Groq response
// @route   POST /api/ai/chat
// @access  Private
export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { message, sessionId } = req.body;

  // 1. Rate limiting check
  if (!checkRateLimit(userId)) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. You can make at most 20 requests per minute.'
    });
  }

  // 2. Validate input length & empty messages
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Message content cannot be empty.'
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Message length cannot exceed 2000 characters.'
    });
  }

  // Sanitize input content
  const sanitizedMessage = message.trim();

  try {
    let session;
    let isNewSession = false;

    // 3. Resolve or Create ChatSession
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Chat session not found.' });
      }
    } else {
      isNewSession = true;
      // Generate clean session title from first 40 chars of message
      const title = sanitizedMessage.length > 40 
        ? sanitizedMessage.substring(0, 40) + '...' 
        : sanitizedMessage;
      
      session = await ChatSession.create({
        userId,
        title
      });
    }

    // 4. Save User Message
    const userChatMessage = await ChatMessage.create({
      sessionId: session._id,
      role: 'user',
      content: sanitizedMessage
    });

    // 5. Gather previous messages inside this session for context
    const previousMessages = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(10); // fetch last 10 messages for rich history

    // 6. Build final system messages list for Groq
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    previousMessages.forEach(msg => {
      groqMessages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // 7. Get response from Groq
    let reply = '';
    try {
      reply = await getGroqReply(groqMessages);
    } catch (apiError) {
      // Graceful error handling for Groq failures
      return res.status(503).json({
        success: false,
        message: 'AI Tutor is temporarily unavailable. Please try again later.'
      });
    }

    // 8. Save Assistant Reply
    const assistantChatMessage = await ChatMessage.create({
      sessionId: session._id,
      role: 'assistant',
      content: reply
    });

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      sessionTitle: session.title,
      isNewSession,
      userMessage: userChatMessage,
      replyMessage: assistantChatMessage
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
};

// @desc    Retrieve all chat sessions
// @route   GET /api/ai/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Fetch sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history sessions.'
    });
  }
};

// @desc    Retrieve all messages for a specific session
// @route   GET /api/ai/sessions/:sessionId
// @access  Private
export const getSessionMessages = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found.'
      });
    }

    const messages = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      session,
      messages
    });
  } catch (error) {
    console.error('Fetch session messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages for this session.'
    });
  }
};

// @desc    Delete a specific session & all its messages
// @route   DELETE /api/ai/sessions/:sessionId
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({ _id: req.params.sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found.'
      });
    }

    // Delete associated chat messages
    await ChatMessage.deleteMany({ sessionId: req.params.sessionId });

    return res.status(200).json({
      success: true,
      message: 'Chat session and history deleted successfully.'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete this chat session.'
    });
  }
};
