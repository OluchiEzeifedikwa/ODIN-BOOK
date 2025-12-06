const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const minutesAgo = require('../helpers/minutesAgo');


// To render the editProfile form
exports.getEditProfileForm = async (req, res, next) => {
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
    next(err);
  }
}


exports.getHomePage = async (req, res, next) => {
  try {
    // 1️⃣ Guard – redirect if not logged in
    if (!req.user) return res.redirect('/login')

    // 2️⃣ Get IDs of users you follow (accepted requests)
    const followRows = await prisma.followRequest.findMany({
      where: {
        followerId: req.user.id,
        status: 'accepted',
      },
      select: { followingId: true },
    })
    const followingIds = followRows.map(f => f.followingId)

    // 3️⃣ Fetch only those profiles
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: followingIds } },
      include: {
        user: {
          include: {
            posts: {
              include: {
                _count: { select: { likes: true, comments: true } },
                comments: { include: { user: true } },
              },
            },
          },
        },
      },
    })

    // 4️⃣ Attach a simple “isFollowing” flag (will always be true here)
    for (const profile of profiles) {
      profile.isFollowing = true
    }

    // 5️⃣ Render the home view
    res.render('../odinbook/views/home', {
      profiles,
      user: req.user,
      path: req.path,
      minutesAgo,
    })
  } catch (err) {
    next(err)
  }
}

        

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


 // To update the profile
 exports.updateProfile = async (req, res, next) => {
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
     next(err)
    }
 };

