import { Router } from 'express';
import loginController from '../controllers/loginController.js';

const loginRouter = Router();

loginRouter.get('/login', (req, res) => {
  res.render('auth/login', { layout: false });
});

loginRouter.post('/login', loginController.login);

export default loginRouter;
