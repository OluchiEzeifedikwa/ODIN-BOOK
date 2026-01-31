import { Router } from 'express';
import passport from 'passport';
import homeController from '../controllers/homeController.js';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import multer from 'multer';

const homeRouter = Router();
const prisma = new PrismaClient();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Passport JWT authentication middleware
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

// Routes
homeRouter.get('/home', homeController.getHomePage);
homeRouter.get('/editProfile/:id', homeController.getEditProfileForm);
homeRouter.get('/home/:id', homeController.getProfileById);
homeRouter.post('/home/:id', upload.single('profileImage'), homeController.updateProfile);

// Links middleware for templates
const links = [
  { href: '/home', text: 'Home', icon: 'fa fa-home' },
  { href: '/profiles', text: 'Friends', icon: 'fa fa-user' },
  { href: '/createPost', text: 'Posts' },
];

homeRouter.use((req, res, next) => {
  res.locals.links = links;
  next();
});

// Rendering pages
homeRouter.get('/', (req, res) => {
  res.render('index');
});

homeRouter.get('/home', (req, res) => {
  res.render('home');
});

homeRouter.get('/profiles', (req, res) => {
  res.render('profiles');
});

// Uncomment if needed
// homeRouter.get('/createPost', (req, res) => {
//   res.render('../odinbook/views/createPost.js');
// });

export default homeRouter;
