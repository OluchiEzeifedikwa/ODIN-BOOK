const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProfile = async (req, res) => {
  try {
    const { email, password, bio, location, pronoun } = req.body;

    // Validate input
    if (!email || email.trim() === '') {
      return res.status(400).send({ error: 'Email is required' });
    }
    if (!password || password.trim() === '') {
      return res.status(400).send({ error: 'Password is required' });
    }
    if (!bio || bio.trim() === '') {
      return res.status(400).send({ error: 'Bio is required' });
    }
    if (!location || location.trim() === '') {
      return res.status(400).send({ error: 'Location is required' });
    }
    if (!pronoun || pronoun.trim() === '') {
      return res.status(400).send({ error: 'Pronoun is required' });
    }
    const image = req.file;
    if (!image) {
      return res.status(404).send('Image required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio,
            location,
            pronoun,
            image: image.filename,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }
    console.log(user);
    res.render("../odinbook/views/profile", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating profile');
  }
};

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
    res.render("../odinbook/views/profiles", { users});
  } catch (err) {
    console.error(err);
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
      return res.status(404).send({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
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

 



