import { Router } from 'express';
import homeController from '../controllers/homeController.js';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const homeRouter = Router();

homeRouter.get('/', (_req, res) => res.redirect('/home'));
homeRouter.get('/home', authMiddleware, homeController.getHomePage);
homeRouter.get('/profiles', authMiddleware, profileController.getProfilesPage);

export default homeRouter;
