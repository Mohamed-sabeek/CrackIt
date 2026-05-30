import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  testType: { 
    type: String, 
    required: true,
    enum: ['daily', 'subject', 'full']
  },
  category: { type: String }, // For daily it can be mixed or specific.
  subject: { type: String },
  duration: { type: Number, required: true }, // in minutes
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);
export default Test;
