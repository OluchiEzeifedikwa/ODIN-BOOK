import { PrismaClient } from '@prisma/client';
import minutesAgo from '../helpers/minutesAgo.js';

const prisma = new PrismaClient();

// Render the home page
const getHomePage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    // Fetch profiles (with posts, comments, notifications)
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          include: {
            posts: {
              include: {
                _count: { select: { likes: true, comments: true } },
                comments: {
                  include: {
                    user: { include: { profile: true } },
                  },
                },
                likes: { where: { userId: req.user.id } },
              },
            },
            notifications: {
              include: {
                user: true,
                post: true,
                comment: true,
                like: true,
                followRequest: true,
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    // Build a set of user IDs the current user is following
    const followingRecords = await prisma.followRequest.findMany({
      where: { followerId: req.user.id, status: 'accepted' },
      select: { followingId: true },
    });
    const followingSet = new Set(followingRecords.map(f => f.followingId));

    // Add isFollowing flag + isLiked flag per post
    for (const profile of profiles) {
      profile.isFollowing = followingSet.has(profile.user.id);
      for (const post of profile.user.posts) {
        post.isLiked = post.likes.length > 0;
      }
    }

    // Current user's notifications
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: {
        user: true,
        post: true,
        comment: true,
        like: true,
        followRequest: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.render('pages/home', {
      title: "Home",
      profiles,
      notifications,
      user: req.user,
      path: req.path,
      minutesAgo,
      term: '',
    });
  } catch (err) {
    next(err);
  }
};


export default {
  getHomePage,
};
