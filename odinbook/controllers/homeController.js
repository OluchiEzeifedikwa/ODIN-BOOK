import { PrismaClient } from '@prisma/client';
import minutesAgo from '../helpers/minutesAgo.js';

const prisma = new PrismaClient();

// Render the editProfile form
const getEditProfileForm = async (req, res, next) => {
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
  } catch (err) {
    console.error(err);
    next(err);
  }
};

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
                comments: { include: { user: true } },
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

    // Add isFollowing flag
    for (const profile of profiles) {
      profile.isFollowing = true;
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

    res.render('home', {
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

// Get profile by ID
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching profile with ID: ${id}`);

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      const error = new Error('Profile not found');
      error.statusCode = 404;
      throw error;
    }

    res.render('home', { profile });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bio, location, pronoun } = req.body;

    // Fetch existing profile first
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
        image: req.file ? req.file.filename : profile.image,
      },
    });

    console.log('Profile update request received!', req.body);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getEditProfileForm,
  getHomePage,
  getProfileById,
  updateProfile,
};
