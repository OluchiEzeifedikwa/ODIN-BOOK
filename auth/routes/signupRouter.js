import { Router } from 'express';
import signupController from '../controllers/signupController.js';

const signupRouter = Router();

signupRouter.get('/signup', (req, res) => {
  res.render('signup', { layout: false });
});

signupRouter.post('/signup', signupController.signup);

export default signupRouter;
