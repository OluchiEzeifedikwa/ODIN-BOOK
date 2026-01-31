import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------- helper ----------
const createNotification = async (data) => {
  const { userId, profileId, type, relatedId, extraData = {} } = data;
  return prisma.notification.create({
    data: {
      userId,
      profileId,
      type,
      read: false,
      ...(type === 'like' && { likeId: relatedId }),
      ...(type === 'comment' && { commentId: relatedId }),
      ...(type === 'post' && { postId: relatedId }),
      ...(type === 'follow' && { followRequestId: relatedId }),
      extra: extraData,
    },
  });
};

// ---------- API endpoints ----------
const createNotificationAPI = async (req, res, next) => {
  try {
    const notification = await createNotification(req.body);
    res.status(201).json({ notification });
  } catch (err) {
    next(err);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const count = await prisma.notification.count({ where: { userId: req.user.id } });
    if (count === 0) {
      await createNotification({
        userId: req.user.id,
        profileId: req.user.profileId,
        type: 'post',
        relatedId: 'dummy-post-id',
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: { user: true, post: true, comment: true, like: true, followRequest: true },
      orderBy: { createdAt: 'desc' },
    });

    res.render('notifications', { notifications });
  } catch (err) {
    next(err);
  }
};

// Like & comment helpers
const likePostNotification = async (req, res, next) => {
  try {
    const like = await prisma.like.create({
      data: { userId: req.user.id, postId: req.params.postId },
    });

    await createNotification({
      userId: req.user.id,
      profileId: req.user.profileId,
      type: 'like',
      relatedId: like.id,
    });

    res.json({ message: 'Post liked' });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        userId: req.user.id,
        postId: req.params.postId,
        content: req.body.content,
      },
    });

    await createNotification({
      userId: req.user.id,
      profileId: req.user.profileId,
      type: 'comment',
      relatedId: comment.id,
    });

    res.json({ message: 'Comment added' });
  } catch (err) {
    next(err);
  }
};

// Follow request helper
export const followUser = async (req, res, next) => {
  try {
    const followRequest = await prisma.followRequest.create({
      data: {
        followerId: req.user.id,
        followingId: req.params.userId,
        status: 'pending',
      },
    });

    await createNotification({
      userId: req.params.userId,
      profileId: req.params.userId,
      type: 'follow',
      relatedId: followRequest.id,
    });

    res.json({ message: 'Follow request sent' });
  } catch (err) {
    next(err);
  }
};

export default {
    createNotificationAPI,
    getNotifications,
    likePostNotification,
    addComment,
    followUser,
  };
  
