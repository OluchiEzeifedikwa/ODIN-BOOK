import { Router } from 'express';
import profileController from '../controllers/profileController.js';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import multer from 'multer';

const profileRouter = Router();
const prisma = new PrismaClient();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
profileRouter.get('/editProfile/:id', profileController.getEditProfileForm);
profileRouter.get('/profiles', profileController.getProfilesPage);
profileRouter.get('/profiles/:id', profileController.getProfileById);
profileRouter.post('/profiles/:id', upload.single('profileImage'), profileController.updateProfile);

export default profileRouter;
