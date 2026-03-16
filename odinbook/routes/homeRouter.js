import { Router } from 'express';
import homeController from '../controllers/homeController.js';
import profileController from '../controllers/profileController.js';

const homeRouter = Router();

// Home page route — uses controller
homeRouter.get('/home', homeController.getHomePage);

homeRouter.get("/", (req, res) => {
  res.redirect('/home');
});

// Profiles page
homeRouter.get('/profiles', profileController.getProfilesPage);

export default homeRouter;