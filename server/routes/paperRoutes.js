import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper
} from '../controllers/paperController.js';

const router = express.Router();

router.route('/')
  .get(getPapers)
  .post(protect, admin, createPaper);

router.route('/:id')
  .get(getPaperById)
  .put(protect, admin, updatePaper)
  .delete(protect, admin, deletePaper);

export default router;
