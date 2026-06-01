import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  board: {
    type: String,
    enum: ['Stateboard', 'NCERT'],
    required: [true, 'Board is required']
  },
  className: {
    type: String,
    required: [true, 'Class name is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  medium: {
    type: String,
    enum: ['Tamil', 'English'],
    default: 'English'
  },
  sourceName: {
    type: String,
    default: 'TN Textbooks'
  },
  resourceUrl: {
    type: String,
    required: [true, 'Resource URL is required']
  },
  // Legacy fields for backward compatibility
  driveLink: { type: String },
  previewUrl: { type: String },
  downloadUrl: { type: String },
  thumbnail: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

bookSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (!ret.resourceUrl) {
      ret.resourceUrl = ret.previewUrl || ret.driveLink;
    }
    return ret;
  }
});

export default mongoose.model('Book', bookSchema);
