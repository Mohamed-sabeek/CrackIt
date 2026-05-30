const aiConfig = {
  model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  apiKey: process.env.GROQ_API_KEY
};

export default aiConfig;
