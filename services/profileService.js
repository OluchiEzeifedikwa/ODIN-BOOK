import { findProfileById, findProfileByUserId, findProfiles, updateProfile } from '../repositories/profileRepository.js';
import { findFollowRequests } from '../repositories/followRequestRepository.js';
import { httpError } from './httpError.js';

const MAX_LENGTHS = { bio: 300, location: 100, pronoun: 30 };

// Get a profile by its ID (with optional includes)
export const getProfileById = async (id, args = {}) => {
  const profile = await findProfileById(id, args);
  if (!profile) throw httpError(404, 'Profile not found');
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
  if (!profile) throw httpError(404, 'Profile not found');
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
  const profile = await getOwnProfile(id, currentUserId);

  const fields = { bio, location, pronoun };
  for (const [name, value] of Object.entries(fields)) {
    fields[name] = typeof value === 'string' ? value.trim() : '';
    if (fields[name].length > MAX_LENGTHS[name]) {
      throw httpError(400, `${name[0].toUpperCase() + name.slice(1)} can be at most ${MAX_LENGTHS[name]} characters`);
    }
  }

  return updateProfile(id, {
    ...fields,
    image: filename ?? profile.image,
  });
};

// Get a profile only if it belongs to the current user (for the edit form)
export const getOwnProfile = async (id, currentUserId, args = {}) => {
  const profile = await getProfileById(id, args);
  if (profile.userId !== currentUserId) throw httpError(403, 'Not your profile');
  return profile;
};

// Get profile by userId (used for redirect and global middleware)
export const getProfileByUserId = async (userId, args = {}) => {
  return findProfileByUserId(userId, args);
};
