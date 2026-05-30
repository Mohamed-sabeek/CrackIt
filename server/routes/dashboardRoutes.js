import express from 'express';
import { getDashboardOverview, getRecentActivities } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', protect, getDashboardOverview);
router.get('/recent-activities', protect, getRecentActivities);

export default router;
