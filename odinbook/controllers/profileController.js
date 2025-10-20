const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// To get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }
    console.log(users);
    res.render("../odinbook/views/profiles", { users});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profiles' });
  }
};


 // To get profiles by Id
 exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: { 
        profile: true, 
      },
    });
    if (!user || !user.profile) {
      return res.status(404).render("../odinbook/views/error");
    }
    console.log(user);
    res.render("../odinbook/views/profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { message: 'Failed to retrieve profile' });
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

 // To 
 exports.updateProfile = async (req, res) => {
  try {
     
     const profileId = req.params.id
     const { bio, location, pronoun } = req.body;
     await prisma.profile.update({
       where: { id : profileId },
       data: { 
        bio,
        location,
        pronoun,
      }
     });
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

 



