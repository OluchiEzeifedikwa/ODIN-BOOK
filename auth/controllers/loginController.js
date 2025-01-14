// controllers/loginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function login(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  })(req, res, next);
};
module.exports = { login }




