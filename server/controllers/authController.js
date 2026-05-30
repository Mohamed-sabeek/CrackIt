import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { defaultSubjectsList, defaultActivityTimeline, defaultStudyTargets } from '../utils/defaultData.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'crackit_jwt_secret_key_1730', 
    { expiresIn: '30d' }
  );
};

// Helper to migrate/initialize missing progress fields for existing users
const ensureProgressFields = async (user) => {
  let updated = false;
  if (!user.subjectsList || user.subjectsList.length === 0) {
    user.subjectsList = defaultSubjectsList;
    updated = true;
  }
  if (!user.activityTimeline || user.activityTimeline.length === 0) {
    user.activityTimeline = defaultActivityTimeline;
    updated = true;
  }
  if (!user.studyTargets || user.studyTargets.length === 0) {
    user.studyTargets = defaultStudyTargets;
    updated = true;
  }
  // If studyStreak is undefined/null, set defaults
  if (user.studyStreak === undefined || user.studyStreak === null) {
    user.studyStreak = 0;
    updated = true;
  }
  if (user.studyHours === undefined || user.studyHours === null) {
    user.studyHours = 0;
    updated = true;
  }
  if (user.mockTestsSolved === undefined || user.mockTestsSolved === null) {
    user.mockTestsSolved = 0;
    updated = true;
  }
  if (user.latestMockScore === undefined || user.latestMockScore === null) {
    user.latestMockScore = 0;
    updated = true;
  }
  if (!user.activeCourse) {
    user.activeCourse = 'TNPSC Group 4';
    updated = true;
  }

  if (updated) {
    await user.save();
  }
  return user;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate inputs
    if (!name) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create user with real initial progress
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      studyStreak: 0,
      studyHours: 0,
      mockTestsSolved: 0,
      latestMockScore: 0,
      activeCourse: 'TNPSC Group 4',
      subjectsList: defaultSubjectsList,
      activityTimeline: defaultActivityTimeline,
      studyTargets: defaultStudyTargets
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please login.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration backend error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found. Please register first.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    // Ensure missing tracking fields are initialized
    user = await ensureProgressFields(user);

    res.json({
      success: true,
      message: 'Welcome back!',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studyStreak: user.studyStreak,
        studyHours: user.studyHours,
        mockTestsSolved: user.mockTestsSolved,
        latestMockScore: user.latestMockScore,
        activeCourse: user.activeCourse,
        subjectsList: user.subjectsList,
        activityTimeline: user.activityTimeline,
        studyTargets: user.studyTargets
      }
    });
  } catch (error) {
    console.error('Login backend error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      // Ensure missing tracking fields are initialized
      const user = await ensureProgressFields(req.user);

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studyStreak: user.studyStreak,
          studyHours: user.studyHours,
          mockTestsSolved: user.mockTestsSolved,
          latestMockScore: user.latestMockScore,
          activeCourse: user.activeCourse,
          subjectsList: user.subjectsList,
          activityTimeline: user.activityTimeline,
          studyTargets: user.studyTargets
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user progress
// @route   PUT /api/auth/progress
// @access  Private
export const updateUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.studyStreak !== undefined) user.studyStreak = req.body.studyStreak;
      if (req.body.studyHours !== undefined) user.studyHours = req.body.studyHours;
      if (req.body.mockTestsSolved !== undefined) user.mockTestsSolved = req.body.mockTestsSolved;
      if (req.body.latestMockScore !== undefined) user.latestMockScore = req.body.latestMockScore;
      if (req.body.activeCourse !== undefined) user.activeCourse = req.body.activeCourse;
      if (req.body.subjectsList !== undefined) user.subjectsList = req.body.subjectsList;
      if (req.body.activityTimeline !== undefined) user.activityTimeline = req.body.activityTimeline;
      if (req.body.studyTargets !== undefined) user.studyTargets = req.body.studyTargets;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          studyStreak: updatedUser.studyStreak,
          studyHours: updatedUser.studyHours,
          mockTestsSolved: updatedUser.mockTestsSolved,
          latestMockScore: updatedUser.latestMockScore,
          activeCourse: updatedUser.activeCourse,
          subjectsList: updatedUser.subjectsList,
          activityTimeline: updatedUser.activityTimeline,
          studyTargets: updatedUser.studyTargets
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
      }
      
      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'User removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (role)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
