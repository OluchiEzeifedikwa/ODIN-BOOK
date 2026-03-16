// controllers/loginController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const prisma = new PrismaClient();

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login');
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      req.user = user; // explicitly attach user

      // Generate JWT
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return res.redirect('/home');
    });
  })(req, res, next);
};

export default {
  login,
};
