import { findProfileById, findProfileByUserId, findProfiles, updateProfile } from '../repositories/profileRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';

// Get a profile by its ID (with optional includes)
export const getProfileById = async (id, args = {}) => {
  const profile = await findProfileById(id, args);
  if (!profile) {
    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

// Get full profile for the social profile detail page (with posts)
export const getProfileWithPosts = async (id, currentUserId) => {
  const profile = await findProfileById(id, {
    include: {
      user: {
        include: {
          posts: {
            include: {
              _count: { select: { likes: true, comments: true } },
              likes: { where: { userId: currentUserId } },
              comments: {
                include: { user: { include: { profile: { select: { image: true } } } } },
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });
  if (!profile) {
    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }
  profile.user.posts.forEach(post => {
    post.isLiked = post.likes.length > 0;
  });
  return profile;
};

// Get the profile page data for followed users — only name and avatar
export const getFollowedProfiles = async (currentUserId) => {
  const followingRecords = await findFollowRequests({
    where: { followerId: currentUserId, status: 'accepted' },
    select: { followingId: true },
  });
  const followingIds = followingRecords.map(f => f.followingId);

  return findProfiles({
    where: { userId: { in: followingIds } },
    select: {
      id: true,
      image: true,
      user: { select: { id: true, username: true } },
    },
  });
};

// Get all profiles with their user — optionally filter by search term
export const getAllProfiles = async (searchTerm) => {
  const profiles = await findProfiles({ include: { user: true } });

  if (!profiles || profiles.length === 0) return [];

  if (searchTerm) {
    return profiles.filter(profile =>
      profile.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return profiles;
};

// Update a profile — enforces ownership
export const editProfile = async (id, currentUserId, { bio, location, pronoun, filename }) => {
  const profile = await findProfileById(id);
  if (!profile) throw new Error('Profile not found');
  if (profile.userId !== currentUserId) throw new Error('Not your profile');

  return updateProfile(id, {
    bio,
    location,
    pronoun,
    image: filename ?? profile.image,
  });
};

// Get profile by userId (used for redirect and global middleware)
export const getProfileByUserId = async (userId, args = {}) => {
  return findProfileByUserId(userId, args);
};
