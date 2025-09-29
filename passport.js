const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = parseInt(id); // Ensure id is an integer if necessary
    const user = await prisma.user.findUnique({ where: { id: userId } });
    done(null, user);
  } catch (err) {
    console.error('Deserialize user error:', err);
    done(err);
  }
});

// Local strategy
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log(`Authentication failed: user ${username} not found`);
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Authentication failed: incorrect password for user ${username}`);
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// JWT strategy
const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

passport.use(new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_KEY,
}, async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;