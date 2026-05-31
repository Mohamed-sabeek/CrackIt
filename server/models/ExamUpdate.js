import mongoose from 'mongoose';

const examUpdateSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
    trim: true
  },
  notificationNumber: {
    type: String,
    trim: true,
    default: ''
  },
  notificationDate: {
    type: Date,
    required: true
  },
  examDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: [
      'Upcoming',
      'Applications Open',
      'Hall Ticket Released',
      'Exam Completed',
      'Results Released',
      'Certificate Verification',
      'Recruitment Closed'
    ]
  },
  sourceName: {
    type: String,
    required: true,
    trim: true
  },
  officialUrl: {
    type: String,
    required: true,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

const ExamUpdate = mongoose.model('ExamUpdate', examUpdateSchema);
export default ExamUpdate;
