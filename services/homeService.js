import { findProfiles } from '../repositories/profileRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';
import { findNotifications } from '../repositories/notificationRepository.js';

// Aggregate all data needed to render the home feed
export const getHomePageData = async (userId) => {
  // Fetch all profiles with posts, comments, and the current user's likes
  const profiles = await findProfiles({
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
              likes: { where: { userId } },
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
  const followingRecords = await findFollowRequests({
    where: { followerId: userId, status: 'accepted' },
    select: { followingId: true },
  });
  const followingSet = new Set(followingRecords.map(f => f.followingId));

  // Attach isFollowing and isLiked derived fields
  for (const profile of profiles) {
    profile.isFollowing = followingSet.has(profile.user.id);
    for (const post of profile.user.posts) {
      post.isLiked = post.likes.length > 0;
    }
  }

  // Current user's own notifications
  const notifications = await findNotifications({
    where: { userId },
    include: {
      user: true,
      post: true,
      comment: true,
      like: true,
      followRequest: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { profiles, notifications };
};
