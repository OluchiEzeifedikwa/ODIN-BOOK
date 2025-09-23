const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


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




passport.serializeUser(( user, done ) => {
  done(null, user.id);
})


passport.deserializeUser(async(id, done ) => {
  await prisma.user.findUnique({ where: { id }})
  .then(user => done(null, user))
  .catch(err => done(err));
})


module.exports = passport;
