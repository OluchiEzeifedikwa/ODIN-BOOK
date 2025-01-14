const { Router } = require('express');
const signupRouter = Router();
const signupController = require('../controllers/signupController');

signupRouter.get('/signup', (req, res) => {
    res.render('../auth/views/signup');
  })

signupRouter.post('/signup', signupController.signup)

module.exports = signupRouter;