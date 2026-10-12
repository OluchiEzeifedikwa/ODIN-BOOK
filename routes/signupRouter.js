import { Router } from 'express';
import signupController from '../controllers/signupController.js';

const signupRouter = Router();

signupRouter.get('/signup', signupController.getSignupForm);

signupRouter.post('/signup', signupController.signup);

export default signupRouter;
