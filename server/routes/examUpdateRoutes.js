import express from 'express';
import {
  createExamUpdate,
  updateExamUpdate,
  togglePublishExamUpdate,
  deleteExamUpdate,
  getExamUpdateById,
  getExamUpdates
} from '../controllers/examUpdateController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getExamUpdates);
router.get('/:id', protect, getExamUpdateById);

router.post('/', protect, admin, createExamUpdate);
router.put('/:id', protect, admin, updateExamUpdate);
router.patch('/:id/publish', protect, admin, togglePublishExamUpdate);
router.delete('/:id', protect, admin, deleteExamUpdate);

export default router;
