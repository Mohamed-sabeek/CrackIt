import TestAttempt from '../models/TestAttempt.js';
import Test from '../models/Test.js';
import Question from '../models/Question.js';

export const submitTest = async (req, res) => {
  try {
    const { testId, timeTaken, answers } = req.body; // answers: [{questionId, selectedAnswer}]

    const test = await Test.findById(testId).populate('questions');
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unansweredQuestions = 0;
    let score = 0;

    const processedAnswers = test.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
      
      let isCorrect = false;
      if (!userAnswer || !userAnswer.selectedAnswer) {
        unansweredQuestions++;
      } else {
        let isCorrectOpt = userAnswer.selectedAnswer === question.correctAnswer;
        
        // Fallback for legacy CSV uploads where correctAnswer is 'A', 'B', 'C', 'D'
        if (!isCorrectOpt && typeof question.correctAnswer === 'string' && question.correctAnswer.length === 1) {
          const letters = ['A', 'B', 'C', 'D', 'E'];
          const correctIdx = letters.indexOf(question.correctAnswer.toUpperCase());
          if (correctIdx !== -1 && userAnswer.selectedAnswer === question.options[correctIdx]) {
            isCorrectOpt = true;
          }
        }

        if (isCorrectOpt) {
          isCorrect = true;
          correctAnswers++;
          // Assuming each question carries equal weight
          score += (test.totalMarks / test.totalQuestions);
        } else {
          wrongAnswers++;
        }
      }

      return {
        questionId: question._id,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect
      };
    });

    const percentage = (score / test.totalMarks) * 100;

    const attempt = new TestAttempt({
      user: req.user._id,
      test: testId,
      score: Number(score.toFixed(2)),
      totalMarks: test.totalMarks,
      percentage: Number(percentage.toFixed(2)),
      timeTaken,
      correctAnswers,
      wrongAnswers,
      unansweredQuestions,
      answers: processedAnswers
    });

    await attempt.save();

    // Do NOT return full analysis here as per requirements. Just return the summary.
    res.status(201).json({
      attemptId: attempt._id,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      unansweredQuestions: attempt.unansweredQuestions
    });

  } catch (error) {
    res.status(500).json({ message: 'Error submitting test', error: error.message });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .populate('test', 'title testType category subject duration totalQuestions totalMarks passingMarks')
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
};

export const getAttemptDetails = async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({ 
      _id: req.params.id,
      user: req.user._id // Ensure user can only view their own attempt
    })
    .populate('test', 'title testType category subject duration totalQuestions totalMarks passingMarks')
    .populate('answers.questionId');

    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt details', error: error.message });
  }
};

// Admin only
export const getAllAttemptsForTest = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ test: req.params.testId })
      .populate('user', 'name email')
      .sort({ score: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
};
