const { Router } = require('express');
const profileRouter = Router();
const profileController = require('../controllers/profileController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



profileRouter.get('/editProfile/:id', profileController.getEditProfileForm);
// profileRouter.post('/profiles', upload.single('image'), profileController.createProfile);
profileRouter.get('/profiles', profileController.getProfiles);
profileRouter.get('/pictures', profileController.getPictures);
profileRouter.get('/profiles/:id', profileController.getProfileById);
profileRouter.put('/profiles/:id', profileController.updateProfile);
profileRouter.delete('/profiles/:id', profileController.deleteProfile);


module.exports = profileRouter;


