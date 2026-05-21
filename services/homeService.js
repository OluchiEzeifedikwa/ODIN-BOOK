import { findProfiles } from '../repositories/profileRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';

export const getHomePageData = async (userId) => {
  const profiles = await findProfiles({
    include: {
      user: {
        include: {
          posts: {
            orderBy: { createdAt: 'desc' },
            include: {
              _count: { select: { likes: true, comments: true } },
              likes: { where: { userId } },
            },
          },
        },
      },
    },
  });

  const followingRecords = await findFollowRequests({
    where: { followerId: userId, status: 'accepted' },
    select: { followingId: true },
  });
  const followingSet = new Set(followingRecords.map(f => f.followingId));

  for (const profile of profiles) {
    profile.isFollowing = followingSet.has(profile.user.id);
    for (const post of profile.user.posts) {
      post.isLiked = post.likes.length > 0;
    }
  }

  return { profiles };
};
