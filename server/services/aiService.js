import axios from 'axios';
import aiConfig from '../config/aiConfig.js';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const getGroqReply = async (messages) => {
  const apiKey = aiConfig.apiKey;
  const model = aiConfig.model;

  if (!apiKey) {
    console.error('❌ GROQ_API_KEY environment variable is missing.');
    throw new Error('AI Tutor is temporarily unavailable. Please try again later.');
  }

  try {
    const response = await axios.post(
      GROQ_API_ENDPOINT,
      {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000 // 25 seconds response timeout
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response structure received from Groq API.');
    }
  } catch (error) {
    console.error('❌ Groq API Error details:', error.response?.data || error.message);
    throw new Error('AI Tutor is temporarily unavailable. Please try again later.');
  }
};
