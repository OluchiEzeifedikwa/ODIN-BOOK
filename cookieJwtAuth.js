// const passport = require('passport');
// const JWTStrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;
// const bcrypt = require('bcryptjs');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();


//     const cookieExtractor = function(req) {
//       let token = null;
//       if (req && req.cookies) {
//         token = req.cookies['token'];
//       }
//       return token;
//     };
    


//     passport.use(new JWTStrategy({
//       jwtFromRequest: cookieExtractor,
//       secretOrKey: process.env.SECRET_KEY,
//     }, async (jwtPayload, done) => {
//       try {
//         const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
//         if (!user) {
//           return done(null, false);
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }));

//     passport.use(new JWTStrategy({
//       jwtFromRequest: cookieExtractor,
//       secretOrKey: process.env.SECRET_KEY,
//     }, async (jwtPayload, done) => {
//       try {
//         const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
//         if (!user) {
//           return done(null, false);
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }));
    
//     passport.serializeUser((user, done) => {
//       done(null, user.id);
//     });
    
//     passport.deserializeUser(async (id, done) => {
//       try {
//         const user = await prisma.user.findUnique({ where: { id } });
//         done(null, user);
//       } catch (err) {
//         done(err);
//       }
//     });
    
//     module.exports = passport;
  
//    };


// // passport.js
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const JWTStrategy = require('passport-jwt').Strategy;
// const bcrypt = require('bcryptjs');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const cookieExtractor = function(req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['token'];
//   }
//   return token;
// };

// passport.use(new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
// }, async (username, password, done) => {
//   // ... existing code
// }));

// passport.use(new JWTStrategy({
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: process.env.SECRET_KEY,
// }, async (jwtPayload, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
//     if (!user) {
//       return done(null, false);
//     }
//     return done(null, user);
//   } catch (error) {
//     return done(error, false);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// module.exports = passport;