import User from '../models/User.js';
import TestAttempt from '../models/TestAttempt.js';
import ChatSession from '../models/ChatSession.js';

// @desc    Get user profile with live stats
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch dynamic stats from TestAttempts
    const attempts = await TestAttempt.find({ user: user._id });
    const testsTaken = attempts.length;

    let bestScore = 0;
    let totalPercentage = 0;
    attempts.forEach(attempt => {
      if (attempt.percentage > bestScore) {
        bestScore = attempt.percentage;
      }
      totalPercentage += attempt.percentage;
    });

    const averageAccuracy = testsTaken > 0 ? Math.round(totalPercentage / testsTaken) : 0;

    // Fetch AI chat sessions count
    const aiChats = await ChatSession.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.createdAt // fallback or mock last login
      },
      stats: {
        testsTaken,
        bestScore: `${Math.round(bestScore)}%`,
        averageAccuracy: `${averageAccuracy}%`,
        aiChats
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile details.' });
  }
};

// @desc    Update user profile (Name & Phone)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name.trim();
    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile details.' });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password.' });
    }

    // Update password (pre-save hook hashes this automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
