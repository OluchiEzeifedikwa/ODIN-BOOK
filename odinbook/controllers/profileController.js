import { PrismaClient } from '@prisma/client';
import minutesAgo from '../helpers/minutesAgo.js';

const prisma = new PrismaClient();

// Render the editProfile form
const getEditProfileForm = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      return res.status(404).send('Profile not found');
    }

    res.render('editProfile', { profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching profile');
  }
};

// Render the profiles page — shows only users the current user follows
const getProfilesPage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    const followingRecords = await prisma.followRequest.findMany({
      where: { followerId: req.user.id, status: 'accepted' },
      select: { followingId: true },
    });
    const followingIds = followingRecords.map(f => f.followingId);

    const profiles = await prisma.profile.findMany({
      where: { userId: { in: followingIds } },
      include: {
        user: {
          include: {
            posts: {
              include: {
                _count: { select: { likes: true, comments: true } },
                comments: { include: { user: { include: { profile: true } } } },
                likes: { where: { userId: req.user.id } },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    for (const profile of profiles) {
      profile.isFollowing = true; // all results are followed users
      profile.user.posts.forEach(post => {
        post.isLiked = post.likes.length > 0;
      });
    }

    res.render('pages/profile', { title: 'Friends', profiles, minutesAgo });
  } catch (err) {
    next(err);
  }
};

// Get all profiles (JSON API)
const getProfiles = async (req, res) => {
  const { q } = req.query;

  try {
    const profiles = await prisma.profile.findMany({
      include: { user: true }
    });

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }

    // If query exists, filter profiles
    if (q) {
      const filteredProfiles = profiles.filter((profile) =>
        profile.user.username.toLowerCase().includes(q.toLowerCase())
      );

      return res.json(filteredProfiles);
    }

    // Otherwise return all profiles
    res.json(profiles);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve profiles" });
  }
};
// Get profile by ID
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      const error = new Error('Profile not found');
      error.statusCode = 404;
      throw error;
    }

    res.render('profile', { profile, profileId: profile.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Update the profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, location, pronoun } = req.body;

    // Fetch the existing profile first
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await prisma.profile.update({
      where: { id },
      data: {
        bio,
        location,
        pronoun,
        image: req.file ? req.file.filename : profile.image, // fallback to existing image
      },
    });

    console.log('Profile updated successfully', req.body);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Default export
export default {
  getEditProfileForm,
  getProfilesPage,
  getProfiles,
  getProfileById,
  updateProfile,
};

