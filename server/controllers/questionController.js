import Question from '../models/Question.js';
import xlsx from 'xlsx';

// Get all questions
export const getQuestions = async (req, res) => {
  try {
    const { subject, category, difficulty, search } = req.query;
    let query = {};
    if (subject && subject !== 'All') query.subject = subject;
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }
    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// Create a single question
export const createQuestion = async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      createdBy: req.user._id
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// Bulk upload questions via Excel/CSV
export const bulkUploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const questions = data.map(row => {
      // Expecting columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation, Subject, Difficulty, Category
      const options = [
        row.OptionA || row.optionA || row.option1,
        row.OptionB || row.optionB || row.option2,
        row.OptionC || row.optionC || row.option3,
        row.OptionD || row.optionD || row.option4
      ].filter(Boolean);

      let correctAns = row.CorrectAnswer || row.correctAnswer;
      if (typeof correctAns === 'string' && correctAns.length === 1) {
        const idx = ['a', 'b', 'c', 'd'].indexOf(correctAns.toLowerCase());
        if (idx !== -1 && options[idx]) {
          correctAns = options[idx];
        }
      }

      return {
        question: row.Question || row.question,
        options,
        correctAnswer: correctAns,
        explanation: row.Explanation || row.explanation || '',
        subject: row.Subject || row.subject,
        difficulty: row.Difficulty || row.difficulty || 'Medium',
        category: row.Category || row.category,
        createdBy: req.user._id
      };
    });

    const validQuestions = questions.filter(q => q.question && q.options.length >= 2 && q.correctAnswer);

    await Question.insertMany(validQuestions);
    res.status(201).json({ message: `Successfully imported ${validQuestions.length} questions.` });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: 'Error importing questions', error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};
