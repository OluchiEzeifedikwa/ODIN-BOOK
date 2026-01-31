import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Load environment variables
dotenv.config();

/* =========================
   Local Strategy
========================= */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

/* =========================
   Session Serialization
========================= */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* =========================
   JWT Strategy
========================= */
const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.token || null;
  }
  return null;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      
      secretOrKey: process.env.JWT_SECRET, // must exist

    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
