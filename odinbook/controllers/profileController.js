const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To render the editProfile form
exports.getEditProfileForm = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!profile) {
      // Handle the case where the profile doesn't exist
      return res.status(404).send('Profile not found');
    }
    res.render('../odinbook/views/editProfile', { profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching profile');
  }
}

// To get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: true,
      },
    });
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }
    console.log(profiles);
    res.render("../odinbook/views/profiles", { profiles});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profiles' });
  }
};


 // To get profiles by Id
 exports.getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching profile with ID: ${id}`);

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { user: true },   
    });
    console.log(`Profile data:`, profile);
    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }
    res.render("../odinbook/views/profile", { profile });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


 // To update the profile
 exports.updateProfile = async (req, res) => {
  try {
     const { id } = req.params
     const { bio, location, pronoun } = req.body;

     await prisma.profile.update({
       where: { id },
       data: { 
        bio,
        location,
        pronoun,
        image: req.file ? req.file.filename : profile.image,
      }
     });
     console.log('Profile update request received!');
     console.log('Request body:', req.body);
     // Your code to update the profile goes here
     
     res.status(200).send('profile updated Successfully');
   } catch (err) {
     res.status(500).send({ message: 'Failed to update profiles' });
    }
 };



 



 