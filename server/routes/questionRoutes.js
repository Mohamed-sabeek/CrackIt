import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/auth.js';
import {
  getQuestions,
  createQuestion,
  bulkUploadQuestions,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(protect, admin, getQuestions) // Only admin can browse the question bank
  .post(protect, admin, createQuestion);

router.post('/bulk', protect, admin, upload.single('file'), bulkUploadQuestions);

router.route('/:id')
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

export default router;
