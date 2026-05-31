import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createCurrentAffair,
  getCurrentAffairs,
  getCurrentAffairById,
  updateCurrentAffair,
  togglePublishCurrentAffair,
  deleteCurrentAffair
} from '../controllers/currentAffairController.js';

const router = express.Router();

router.route('/')
  .get(protect, getCurrentAffairs)
  .post(protect, admin, createCurrentAffair);

router.route('/:id')
  .get(protect, getCurrentAffairById)
  .put(protect, admin, updateCurrentAffair)
  .delete(protect, admin, deleteCurrentAffair);

router.route('/:id/publish')
  .patch(protect, admin, togglePublishCurrentAffair);

export default router;
