// const passport = require('passport');
// const JWTStrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// passport.use(new LocalStrategy({
//   nameField: 'name',
//   passwordField: 'password',
// }, async (name, password, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { name } });
//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     return done(null, user);
//   } catch (error) {
//     return done(error, false);
//   }
// }));

// passport.use(new JWTStrategy({
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.SECRET_KEY,
// }, async (jwtPayload, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id: jwtPayload.userId } });
//     if (!user) {
//       return done(null, false);
//     }
//     return done(null, user);
//   } catch (error) {
//     return done(error, false);
//   }
// }));

// module.exports = passport;
