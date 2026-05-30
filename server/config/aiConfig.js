const aiConfig = {
  get model() {
    return process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  },
  get apiKey() {
    return process.env.GROQ_API_KEY;
  }
};

export default aiConfig;
