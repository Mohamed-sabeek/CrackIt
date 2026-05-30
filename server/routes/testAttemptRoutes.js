import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  submitTest,
  getMyAttempts,
  getAttemptDetails,
  getAllAttemptsForTest
} from '../controllers/testAttemptController.js';

const router = express.Router();

router.post('/', protect, submitTest);
router.get('/my-attempts', protect, getMyAttempts);
router.get('/:id', protect, getAttemptDetails);
router.get('/test/:testId', protect, admin, getAllAttemptsForTest);

export default router;
