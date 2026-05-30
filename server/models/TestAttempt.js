import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  unansweredQuestions: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: String, default: null }, // Null if unanswered
    isCorrect: { type: Boolean, required: true }
  }],
}, { timestamps: true });

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
export default TestAttempt;
