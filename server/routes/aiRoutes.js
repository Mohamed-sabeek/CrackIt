import express from 'express';
import { sendMessage, getSessions, getSessionMessages, deleteSession } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply JWT auth protect globally to all AI endpoints
router.use(protect);

router.post('/chat', sendMessage);
router.get('/sessions', getSessions);
router.route('/sessions/:sessionId')
  .get(getSessionMessages)
  .delete(deleteSession);

export default router;
