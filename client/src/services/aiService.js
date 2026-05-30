// AI Study Assistant Service - Generates Mock Educational Explanations

export const getAiExplanation = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let reply = "I can definitely help you with that! As your TNPSC AI Mentor, let me clarify: ";
      const textLower = query.toLowerCase();

      if (textLower.includes('directive principles') || textLower.includes('dpsp')) {
        reply = "Directive Principles of State Policy (Part IV, Articles 36-51) are non-justiciable in court but fundamental to governance. They direct the state to establish a social, economic, and political democracy. Key articles include Article 39A (Equal justice and free legal aid), Article 40 (Organization of village panchayats), and Article 44 (Uniform Civil Code).";
      } else if (textLower.includes('history') || textLower.includes('ancient')) {
        reply = "For TNPSC History, focus heavily on the Indus Valley Civilization, Guptas, Delhi Sultanate, Mughals, and the South Indian kingdoms (Cholas, Cheras, Pandyas, Vijayanagar). The Chola administrative system (Uttaramerur inscriptions detailing local self-government) is a highly repeated TNPSC question!";
      } else if (textLower.includes('geography')) {
        reply = "Important Geography themes: Rivers and drainage networks (Cauvery, Vaigai, Palar systems in Tamil Nadu), physical relief maps, southwest/northeast monsoon patterns (remember NE monsoon yields maximum rainfall to Tamil Nadu coast), and forest reservation types.";
      } else if (textLower.includes('polity tips')) {
        reply = "Polity represents roughly 15-20 questions in Group 4. Memorize Parts I to IV-A completely, schedule names (especially 7th, 8th, 11th, and 12th schedules), and key constitutional amendments like the 42nd, 44th, 73rd, and 74th!";
      } else {
        reply = `That is a vital topic for the TNPSC Group 4 syllabus. For "${query}", you should study the state board syllabus books (Standard 6th to 10th). Focus on key units, sub-topics, key articles, and memorize repeating mock patterns!`;
      }
      resolve(reply);
    }, 1200);
  });
};
export default { getAiExplanation };
