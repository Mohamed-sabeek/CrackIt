import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProgress,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/progress', protect, updateUserProgress);
router.get('/users', protect, admin, getAllUsers);

router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
