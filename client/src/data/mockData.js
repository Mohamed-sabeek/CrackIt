// TNPSC Group 4 Active Workspace Mock Database

export const initialSubjectsList = [
  {
    id: 'polity',
    name: 'Indian Polity',
    progress: 62,
    mastery: 'Strong',
    topicsCompleted: 15,
    topicsTotal: 24,
    completedList: ['Constituent Assembly', 'Salient Features of Constitution', 'Preamble', 'Fundamental Rights'],
    pendingList: ['Directive Principles', 'Fundamental Duties', 'Union Executive', 'State Legislature']
  },
  {
    id: 'tamil',
    name: 'Tamil Language & Literature',
    progress: 88,
    mastery: 'Excellent',
    topicsCompleted: 44,
    topicsTotal: 50,
    completedList: ['Sangam Literature', 'Thirukkural study', 'Silappathikaram', 'Manimekalai', 'Bharathiyar poems'],
    pendingList: ['Modern Tamil prose', 'Grammar - Sandhi rules', 'Contemporary literature']
  },
  {
    id: 'aptitude',
    name: 'Aptitude & Mental Ability',
    progress: 75,
    mastery: 'Strong',
    topicsCompleted: 18,
    topicsTotal: 24,
    completedList: ['Simplification', 'Percentage', 'Highest Common Factor (HCF)', 'Simple Interest'],
    pendingList: ['Compound Interest', 'Area & Volume', 'Time & Work', 'Logical Reasoning']
  },
  {
    id: 'history',
    name: 'Indian History & Culture',
    progress: 45,
    mastery: 'Moderate',
    topicsCompleted: 9,
    topicsTotal: 20,
    completedList: ['Indus Valley Civilization', 'Guptas', 'Delhi Sultans'],
    pendingList: ['Mughal Empire', 'Marathas', 'Rise of Modern India', 'Indian National Movement']
  },
  {
    id: 'geography',
    name: 'Geography of India',
    progress: 30,
    mastery: 'Needs Work',
    topicsCompleted: 6,
    topicsTotal: 20,
    completedList: ['Location and Physical Features', 'Monsoon & Rainfall'],
    pendingList: ['Water Resources & Rivers', 'Soil & Minerals', 'Forest & Wildlife', 'Natural Hazards']
  },
  {
    id: 'economy',
    name: 'Indian Economy',
    progress: 25,
    mastery: 'Needs Work',
    topicsCompleted: 5,
    topicsTotal: 20,
    completedList: ['Nature of Indian Economy', 'Five Year Plans'],
    pendingList: ['Land Reforms & Agriculture', 'GST & Taxation', 'Inflation & Finance Commission', 'Poverty alleviation']
  }
];

export const quizQuestions = [
  {
    question: "Which article of the Indian Constitution empowers the Parliament to regulate the Right of Citizenship by law?",
    options: [
      { key: 'A', text: "Article 8" },
      { key: 'B', text: "Article 9" },
      { key: 'C', text: "Article 10" },
      { key: 'D', text: "Article 11" }
    ],
    correctAnswer: 'D',
    explanation: "Article 11 of the Constitution of India grants Parliament the supreme authority to regulate the right of citizenship by law. Under this power, the Parliament passed the landmark Citizenship Act, 1955.",
    difficulty: "Medium",
    subject: "Indian Polity"
  },
  {
    question: "The concept of 'Directive Principles of State Policy' (DPSP) was borrowed from which country's constitution?",
    options: [
      { key: 'A', text: "USA" },
      { key: 'B', text: "Ireland" },
      { key: 'C', text: "USSR" },
      { key: 'D', text: "Australia" }
    ],
    correctAnswer: 'B',
    explanation: "The Directive Principles of State Policy are guidelines outlined in Part IV of the Indian Constitution, borrowed from the Irish Constitution of 1937, which had copied it from the Spanish Constitution.",
    difficulty: "Easy",
    subject: "Indian Polity"
  },
  {
    question: "Who was the chairman of the Drafting Committee of the Constituent Assembly?",
    options: [
      { key: 'A', text: "Dr. B.R. Ambedkar" },
      { key: 'B', text: "Dr. Rajendra Prasad" },
      { key: 'C', text: "Jawaharlal Nehru" },
      { key: 'D', text: "Sardar Vallabhbhai Patel" }
    ],
    correctAnswer: 'A',
    explanation: "Dr. Bhimrao Ramji Ambedkar was appointed the Chairman of the Drafting Committee set up on August 29, 1947, to prepare a draft of the new Constitution.",
    difficulty: "Easy",
    subject: "Indian History / Polity"
  }
];

export const mockTestsList = [
  { id: 1, name: 'TNPSC Group 4 - Full Length Mock Test 1', questions: 200, duration: '180 mins', status: 'Available', difficulty: 'Balanced' },
  { id: 2, name: 'General Studies - Polity Unit Test', questions: 50, duration: '45 mins', status: 'Available', difficulty: 'Intermediate' },
  { id: 3, name: 'Tamil Eligibility & Literature Test', questions: 100, duration: '90 mins', status: 'Completed (Score: 88%)', difficulty: 'Standard' },
  { id: 4, name: 'Aptitude & Mental Ability Quiz', questions: 25, duration: '30 mins', status: 'Available', difficulty: 'Tough' }
];

export const initialStudyTargets = [
  { id: 1, text: "Revise Directive Principles (Polity Unit 3)", completed: false, deadline: 'Today' },
  { id: 2, text: "Solve 10 Aptitude Simplification sums", completed: true, deadline: 'Done' },
  { id: 3, text: "Memorize Thirukkural Section 1-5 with meanings", completed: false, deadline: 'Tomorrow' }
];

export const mockActivityTimeline = [
  { id: 1, type: 'quiz', text: 'Completed Daily Quiz (Polity Section)', time: '2 hours ago' },
  { id: 2, type: 'syllabus', text: 'Unlocked "Union Judiciary" syllabus unit', time: '5 hours ago' },
  { id: 3, type: 'test', text: 'Attempted Polity Mini Mock Test', time: 'Yesterday' },
  { id: 4, type: 'ai', text: 'Queried AI Guru for Sandhi grammatical rules', time: '2 days ago' }
];
