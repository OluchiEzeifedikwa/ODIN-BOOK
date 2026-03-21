import {
  getNotificationsForUser,
  markAllNotificationsRead,
} from '../services/notificationService.js';

// GET /notifications
const getNotifications = async (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  try {
    const notifications = await getNotificationsForUser(req.user.id);
    await markAllNotificationsRead(req.user.id);

    res.render('pages/notifications', { notifications, title: 'Notifications' });
  } catch (err) {
    next(err);
  }
};

// POST /notifications/read-all
const markAllRead = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await markAllNotificationsRead(req.user.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export default {
  getNotifications,
  markAllRead,
};
