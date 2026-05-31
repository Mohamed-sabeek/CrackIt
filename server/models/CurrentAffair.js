import mongoose from 'mongoose';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentAffairSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: MONTHS
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2100
  },
  sourceName: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
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

const CurrentAffair = mongoose.model('CurrentAffair', currentAffairSchema);
export default CurrentAffair;
