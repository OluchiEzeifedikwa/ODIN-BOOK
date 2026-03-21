import { Router } from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import path from 'path';
import multer from 'multer';

const profileRouter = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

profileRouter.get('/editProfile/:id', authMiddleware, profileController.getEditProfileForm);
profileRouter.get('/profiles', authMiddleware, profileController.getProfilesPage);
profileRouter.get('/profiles/:id', authMiddleware, profileController.getProfileById);
profileRouter.post('/profiles/:id', authMiddleware, upload.single('profileImage'), profileController.updateProfile);

export default profileRouter;
