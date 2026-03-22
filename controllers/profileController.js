import {
  getProfileById,
  getProfileWithPosts,
  getFollowedProfiles,
  getAllProfiles,
  editProfile,
} from '../services/profileService.js';
import minutesAgo from '../services/minutesAgo.js';

// Render the editProfile form
const getEditProfileForm = async (req, res) => {
  if (!req.user) return res.redirect('/login');
  try {
    const profile = await getProfileById(req.params.id, { include: { user: true } });

    res.render('pages/editProfile', { profile, query: req.query });
  } catch (error) {
    console.error(error);
    if (error.statusCode === 404) return res.status(404).send('Profile not found');
    res.status(500).send('Error fetching profile');
  }
};

// Render the profiles page — shows only users the current user follows
const getProfilesPage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    const profiles = await getFollowedProfiles(req.user.id);

    res.render('pages/friends', { title: 'Friends', profiles });
  } catch (err) {
    next(err);
  }
};

// Get all profiles (JSON API)
const getProfilesHandler = async (req, res) => {
  const { q } = req.query;

  try {
    const profiles = await getAllProfiles(q);

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }

    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve profiles" });
  }
};

// Get profile by ID
const getProfileByIdHandler = async (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  try {
    const profile = await getProfileWithPosts(req.params.id, req.user.id);

    res.render('pages/profileDetail', { profile, minutesAgo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Update the profile
const updateProfileHandler = async (req, res) => {
  if (!req.user) return res.redirect('/login');
  try {
    const { id } = req.params;
    const { bio, location, pronoun } = req.body;

    await editProfile(id, req.user.id, {
      bio,
      location,
      pronoun,
      filename: req.file ? req.file.path : undefined,
    });

    res.redirect(`/profiles/${id}`);
  } catch (err) {
    console.error('[updateProfile] error:', err.message);
    res.redirect(`/editProfile/${req.params.id}?error=${encodeURIComponent(err.message)}`);
  }
};

// Default export
export default {
  getEditProfileForm,
  getProfilesPage,
  getProfiles: getProfilesHandler,
  getProfileById: getProfileByIdHandler,
  updateProfile: updateProfileHandler,
};
