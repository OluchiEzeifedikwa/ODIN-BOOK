import { findPosts } from '../repositories/postRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';

export const FEED_PAGE_SIZE = 10;

// Returns one page of the feed. `cursor` is the id of the last post on the previous page.
export const getHomePageData = async (userId, cursor) => {
  const [posts, followingRecords] = await Promise.all([
    findPosts({
      take: FEED_PAGE_SIZE + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        user: { select: { id: true, username: true, profile: { select: { image: true } } } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId } },
      },
    }),
    findFollowRequests({
      where: { followerId: userId, status: 'accepted' },
      select: { followingId: true },
    }),
  ]);

  // Fetching one extra post tells us whether another page exists
  const hasMore = posts.length > FEED_PAGE_SIZE;
  if (hasMore) posts.pop();
  const followingSet = new Set(followingRecords.map(f => f.followingId));

  for (const post of posts) {
    post.isLiked = post.likes.length > 0;
    post.isFollowing = followingSet.has(post.user.id);
  }

  return { posts, nextCursor: hasMore ? posts[posts.length - 1].id : null };
};
