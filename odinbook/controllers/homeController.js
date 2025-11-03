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
  console.log('Request object:', req); 
    try {
      const user = req.user;
      console.log('req.user:', req.user); 
      const profiles = await prisma.profile.findMany({
        include: {
          user: true,
        },
      });
      if (!profiles || profiles.length === 0) {
        return res.status(404).json({ message: 'No profiles found' });
      }
  
  
      res.render("../odinbook/views/home", { 
        links: [
          { href: '/home', text: 'Home', icon: 'fa fa-home' },
          { href: '/profile', text: 'Profile', icon: 'fa fa-user' },
          { href: '/settings', text: 'Settings', icon: 'fa fa-cog' },
        ],
        profiles,
        user,
        user: req.user, // Pass req.user to the view

      });
      console.log(req.user);
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
    res.render("../odinbook/views/home", { profile });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


// To get all pictures
exports.getPictures = async (req, res) => {
  try {
    const picture = await prisma.picture.findMany();
    res.status(200).json(picture);
    //res.render("../messagingApp/views/pictures", {pictures: picture});
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve profiles' });
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


 // To delete a profile
exports.deleteProfile = async (req, res) => {
  try {
     
     const profileId = req.params.id
     await prisma.profile.delete({
       where: { 
         id : profileId },
     });
     res.status(200).json('profile deleted Successfully');
   } catch (err) {
     res.status(500).json({ message: 'Failed to delete profile' });
    }
 };

 



 