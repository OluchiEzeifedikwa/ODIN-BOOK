import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------- shared helper (used by other controllers) ----------
export const createNotification = async ({ userId, type, likeId, commentId, followRequestId }) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      read: false,
      ...(likeId          && { likeId }),
      ...(commentId       && { commentId }),
      ...(followRequestId && { followRequestId }),
    },
  });
};

// GET /notifications
const getNotifications = async (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: {
        like:          { include: { user: true } },
        comment:       { include: { user: true } },
        followRequest: { include: { follower: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    res.render('notifications', { notifications, title: 'Notifications' });
  } catch (err) {
    next(err);
  }
};

// POST /notifications/read-all
const markAllRead = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data:  { read: true },
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export default {
  getNotifications,
  markAllRead,
};
