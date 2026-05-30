import express from 'express';
import { 
  getNotifications, 
  getUnreadCount, 
  markNotificationRead, 
  markAllRead 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markNotificationRead);
router.put('/read-all', protect, markAllRead);

export default router;
