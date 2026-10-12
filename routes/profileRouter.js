import { Router } from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { imageUpload } from '../middleware/imageUpload.js';
import { profileStorage } from '../services/cloudinary.js';

const profileRouter = Router();

profileRouter.get('/editProfile/:id', authMiddleware, profileController.getEditProfileForm);
profileRouter.get('/profiles', authMiddleware, profileController.getProfilesPage);
profileRouter.get('/profiles/:id', authMiddleware, profileController.getProfileById);
profileRouter.post('/profiles/:id', authMiddleware, imageUpload(profileStorage, 'profileImage'), profileController.updateProfile, profileController.updateProfileError);

export default profileRouter;
