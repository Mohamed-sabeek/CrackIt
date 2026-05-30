import Notification from '../models/Notification.js';
import NotificationRead from '../models/NotificationRead.js';

// GET /api/notifications - Returns latest 10 notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the latest 10 active notifications
    const notifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get read states for this user for these 10 notifications
    const notificationIds = notifications.map(n => n._id);
    const readDocs = await NotificationRead.find({
      userId,
      notificationId: { $in: notificationIds }
    }).lean();

    const readSet = new Set(readDocs.map(d => d.notificationId.toString()));

    const result = notifications.map(n => ({
      ...n,
      isRead: readSet.has(n._id.toString())
    }));

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/notifications/unread-count - Returns the count of unread notifications
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Limit calculation to the latest 50 notifications to preserve performance
    const recentNotifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('_id')
      .lean();

    const recentIds = recentNotifications.map(n => n._id);

    const readDocs = await NotificationRead.find({
      userId,
      notificationId: { $in: recentIds }
    }).select('notificationId').lean();

    const readSet = new Set(readDocs.map(d => d.notificationId.toString()));
    let unreadCount = 0;
    recentIds.forEach(id => {
      if (!readSet.has(id.toString())) {
        unreadCount++;
      }
    });

    return res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/notifications/:id/read - Marks a specific notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Use upsert to avoid duplicate key errors
    await NotificationRead.updateOne(
      { userId, notificationId },
      { $setOnInsert: { userId, notificationId, readAt: new Date() } },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/notifications/read-all - Marks all active notifications as read
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the latest 50 active notifications
    const recentNotifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('_id')
      .lean();

    const recentIds = recentNotifications.map(n => n._id);

    // Find which ones are already read
    const readDocs = await NotificationRead.find({
      userId,
      notificationId: { $in: recentIds }
    }).select('notificationId').lean();

    const readSet = new Set(readDocs.map(d => d.notificationId.toString()));

    const unreadIds = recentIds.filter(id => !readSet.has(id.toString()));

    if (unreadIds.length > 0) {
      const bulkOps = unreadIds.map(id => ({
        updateOne: {
          filter: { userId, notificationId: id },
          update: { $setOnInsert: { userId, notificationId: id, readAt: new Date() } },
          upsert: true
        }
      }));
      await NotificationRead.bulkWrite(bulkOps);
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error in markAllRead:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
