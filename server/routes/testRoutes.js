import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
} from '../controllers/testController.js';

const router = express.Router();

router.route('/')
  .get(protect, getTests)
  .post(protect, admin, createTest);

router.route('/:id')
  .get(protect, getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

export default router;
