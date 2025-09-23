// controllers/loginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
    })
    console.log(token);
    return res.redirect('/home')
  })(req, res, next);
};

module.exports = { login }









