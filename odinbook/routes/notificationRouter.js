const notificationRouter = require('express').Router();
const {
  getNotifications,
  markAsRead
} = require('../controllers/notificationController');

notificationRouter.get('/', getNotifications);
notificationRouter.post('/notifications/:id/read', markAsRead);

module.exports = notificationRouter;