const { Router } = require('express');
const loginRouter = Router();
const loginController = require('../controllers/loginController')

loginRouter.get('/login', (req, res) => {
    res.render('../auth/views/login');
  })
  
loginRouter.post('/login',  loginController.login)
  
module.exports = loginRouter;