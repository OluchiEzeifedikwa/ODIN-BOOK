
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


exports.createProfile = async(req, res) => {
  try {
    const { id, bio, location, pronoun } = req.body;
    console.log(req.user)
    console.log(req.bio)
    // const files = req.files;
    const picture = req.file; // Access the uploaded file

    const profile = await prisma.profile.create({
      data: {
        bio,
        location,
        pronoun,
        user: {connect: {id}, },
      },
    });

    // await Promise.all(files.map(async (file) => {
    // await prisma.picture.create({
    //   data: {
    //     picturename: picture.originalname,
    //     profileId: profile.id,
    //   },
    // });

    
    res.render("../odinbook/views/profile", {profile});

    // res.send({ message: 'Folder created and files uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.render({ message: "Error creating profile or uploading pictures" });
  }
}

// To get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve profiles' });
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

 // To get profiles by Id
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id },
    });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
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

// To edit a profile
exports.editProfile = async (req, res) => {
  try {
     const profileId = req.params.id
     const profile = await prisma.profile.findUnique({
       where: { 
         id : profileId },
     });
     res.render('editProfile', { profile });
   } catch (err) {
     res.status(500).json({ message: 'Failed to delete profiles' });
    }
 };

 // To 
 exports.updateProfile = async (req, res) => {
  try {
     
     const profileId = req.params.id
     const { profile } = req.body;
     await prisma.profile.update({
       where: { id : profileId },
       data: { profile }
     });
     res.status(200).json('profile updated Successfully');
   } catch (err) {
     res.status(500).json({ message: 'Failed to update profiles' });
    }
 };
 



