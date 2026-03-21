import { findUsers } from '../repositories/userRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';

// Search users by username, excluding the current user
export const searchUsers = async (term, currentUserId) => {
  if (!term) return [];

  const users = await findUsers({
    where: {
      AND: [
        { id: { not: currentUserId } },
        { username: { contains: term, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      profile: { select: { image: true } },
    },
    take: 20,
  });

  // Find which of these users the current user already follows (accepted)
  const followedIds = new Set(
    (await findFollowRequests({
      where: {
        followerId: currentUserId,
        followingId: { in: users.map(u => u.id) },
        status: 'accepted',
      },
      select: { followingId: true },
    })).map(f => f.followingId)
  );

  return users.map(u => ({ ...u, isFollowing: followedIds.has(u.id) }));
};
