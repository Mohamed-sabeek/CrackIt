import axios from 'axios';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const getGroqReply = async (messages) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not configured.');
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec'; // central fallback to llama 3.3 70b stable

  try {
    const response = await axios.post(
      GROQ_API_ENDPOINT,
      {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
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
    console.error('Groq API Error details:', error.response?.data || error.message);
    throw new Error('Groq AI service integration failed.');
  }
};
