import {
  createNotificationRecord,
  findNotifications,
  countNotifications,
  updateManyNotifications,
  deleteManyNotifications,
} from '../repositories/notificationRepository.js';
import { findProfileByUserId } from '../repositories/profileRepository.js';

// Create a notification record
export const createNotification = async ({ userId, type, likeId, commentId, followRequestId }) => {
  return createNotificationRecord({
    userId,
    type,
    read: false,
    ...(likeId          && { likeId }),
    ...(commentId       && { commentId }),
    ...(followRequestId && { followRequestId }),
  });
};

// Get notifications for a user (notification page)
export const getNotificationsForUser = async (userId) => {
  return findNotifications({
    where: { userId },
    include: {
      like:          { include: { user: true } },
      comment:       { include: { user: true } },
      followRequest: { include: { follower: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
};

// Mark all notifications read for a user
export const markAllNotificationsRead = async (userId) => {
  return updateManyNotifications({
    where: { userId, read: false },
    data:  { read: true },
  });
};

// Delete notifications by postId (used when a post is deleted)
export const deleteNotificationsByPostId = async (postId) => {
  return deleteManyNotifications({ where: { postId } });
};

// Get unread notification count and current user profile (used in global middleware)
export const getGlobalUserData = async (userId) => {
  const [unreadCount, currentUserProfile] = await Promise.all([
    countNotifications({ where: { userId, read: false } }),
    findProfileByUserId(userId, { select: { image: true, id: true } }),
  ]);
  return { unreadCount, currentUserProfile };
};
