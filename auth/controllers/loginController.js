// controllers/loginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function login(req, res, next) {
  passport.authenticate('local', (err, user, info, status)=> {
    if(err) {
      return next(err)
    }
    if(!user) {
      return res.redirect('./login')
    }
    
    
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    console.log('Generated token:', token);
    res.cookie('token', token, {
      httpOnly: true,
    })
    console.log(token);
    console.log('Cookie set:', res.getHeaders()['set-cookie']);
    return res.redirect('/home')
  })(req, res, next);
};

module.exports = { login }









