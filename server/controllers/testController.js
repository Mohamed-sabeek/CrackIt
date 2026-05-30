import Test from '../models/Test.js';
import TestAttempt from '../models/TestAttempt.js';
import Notification from '../models/Notification.js';

export const getTests = async (req, res) => {
  try {
    const { testType, category, subject, isPublished } = req.query;
    let query = {};
    if (testType && testType !== 'All') query.testType = testType;
    if (category && category !== 'All') query.category = category;
    if (subject && subject !== 'All') query.subject = subject;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    // If user is not admin, only show published tests
    if (req.user.role !== 'admin') {
      query.isPublished = true;
    }

    const tests = await Test.find(query).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    if (!test.isPublished && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This test is not published yet' });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test', error: error.message });
  }
};

export const createTest = async (req, res) => {
  try {
    const test = new Test({
      ...req.body,
      createdBy: req.user._id
    });
    await test.save();

    // Automatically trigger notification
    try {
      if (test.testType === 'daily_quiz') {
        await Notification.create({
          title: '🔥 Daily Quiz Available',
          message: `${test.title || "Today's Daily Quiz"} is ready.`,
          type: 'daily_quiz',
          createdBy: req.user ? req.user._id : null
        });
      } else {
        await Notification.create({
          title: '📝 New Mock Test Available',
          message: `${test.title} is now live.`,
          type: 'mock_test',
          createdBy: req.user ? req.user._id : null
        });
      }
    } catch (notifErr) {
      console.error('Failed to create notification for test:', notifErr);
    }

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error updating test', error: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    // Also delete associated attempts
    await TestAttempt.deleteMany({ test: req.params.id });

    res.json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test', error: error.message });
  }
};
