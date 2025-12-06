const { Router } = require('express');
const profileRouter = Router();
const profileController = require('../controllers/profileController');
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


profileRouter.get('/editProfile/:id', profileController.getEditProfileForm);
profileRouter.get('/profiles', profileController.getProfiles);
profileRouter.get('/profiles/:id', profileController.getProfileById);
profileRouter.post('/profiles/:id', upload.single('profileImage'), profileController.updateProfile);


module.exports = profileRouter;


