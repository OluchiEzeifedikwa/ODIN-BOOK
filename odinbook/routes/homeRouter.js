const { Router } = require('express');
const homeRouter = Router();
const passport = require('passport');
const homeController = require('../controllers/homeController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    } else {
      req.user = user; 
      next(); // Call next() to proceed to the next middleware or route handler
    }
  })(req, res, next);
};


homeRouter.get('/home', homeController.getProfiles);
homeRouter.get('/editProfile/:id', homeController.getEditProfileForm);
homeRouter.post('/home', homeController.getPictures);
homeRouter.get('/home/:id', homeController.getProfileById);
homeRouter.post('/home/:id', upload.single('profileImage'), homeController.updateProfile);
homeRouter.delete('/home/:id', homeController.deleteProfile);



const links = [
    { href: "/home", text: "Home", icon: "fa fa-home" },
    { href: "/profiles", text: "Profile", icon: "fa fa-user"},
    { href: "/createPost", text: "Posts"},
    
  ];
  
  homeRouter.use((req, res, next) => {
    res.locals.links = links;
    next();
  });

  homeRouter.get("/",  (req, res) => {
    console.log("im here")
    res.render("../odinbook/views/index");
  });
  
  
  
  homeRouter.get("/home", (req, res) => {
    console.log('pls')
    res.render("../odinbook/views/home");
  });
  
   
  homeRouter.get("/profile", (req, res) => {
    console.log('hello')
    res.render("../odinbook/views/profile" );
  });
  
  
  homeRouter.get("/createPost", (req, res) => {
    console.log("passs")
    res.render("../odinbook/views/createPost");
  });


  

  
  module.exports = homeRouter;
  