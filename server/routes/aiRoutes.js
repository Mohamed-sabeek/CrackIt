import express from 'express';
import { sendMessage, getSessions, getSessionMessages, deleteSession, sendGuestMessage, importGuestChat } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/guest-chat', sendGuestMessage);

// Apply JWT auth protect globally to remaining AI endpoints
router.use(protect);

router.post('/import-guest-chat', importGuestChat);
router.post('/chat', sendMessage);
router.get('/sessions', getSessions);
router.route('/sessions/:sessionId')
  .get(getSessionMessages)
  .delete(deleteSession);

export default router;
