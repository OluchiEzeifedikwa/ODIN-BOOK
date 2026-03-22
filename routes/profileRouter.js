import { Router } from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { profileStorage } from '../services/cloudinary.js';

const profileRouter = Router();

const upload = multer({ storage: profileStorage });

profileRouter.get('/editProfile/:id', authMiddleware, profileController.getEditProfileForm);
profileRouter.get('/profiles', authMiddleware, profileController.getProfilesPage);
profileRouter.get('/profiles/:id', authMiddleware, profileController.getProfileById);
profileRouter.post('/profiles/:id', authMiddleware, upload.single('profileImage'), profileController.updateProfile);

export default profileRouter;
