import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  exam: {
    type: String,
    required: true,
    enum: [
      'TNPSC Group 1', 'TNPSC Group 2', 'TNPSC Group 2A', 'TNPSC Group 4', 
      'VAO', 'TNUSRB', 'SSC', 'Railway', 'Banking', 'UPSC'
    ]
  },
  stage: {
    type: String,
    required: true,
    enum: ['Prelims', 'Mains', 'Interview']
  },
  paperType: {
    type: String,
    required: true,
    enum: [
      'General Studies', 'GS Paper 1', 'GS Paper 2', 'GS Paper 3', 
      'GS Paper 4', 'Tamil', 'English', 'Aptitude', 'Optional'
    ]
  },
  year: {
    type: Number,
    required: true
  },
  driveLink: {
    type: String,
    required: [true, 'Please provide a Google Drive share link']
  },
  previewUrl: {
    type: String
  },
  downloadUrl: {
    type: String
  },
  thumbnail: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Paper = mongoose.model('Paper', paperSchema);
export default Paper;
