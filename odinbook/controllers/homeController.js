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
      where: {
        OR: [
          { userId: { in: followingIds } },
          { userId: req.user.id }          // ← include the logged‑in user
        ]
      },
    
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

    const notifications = await prisma.notification.findMany({
      // where: { profileId: req.user.profileId },   // ← adjust if your user model holds the profile id
      where: { userId: req.user.id }, // adjust to your auth logic
      orderBy: { createdAt: 'desc' },
      take: 5,                                   // show only the newest few
      include: { user: true, post: true, comment: true, like: true, followRequest: true }
    })

    // Add a `notifications` array to every profile (you can also pick a single profile if you only need it there)
for (const profile of profiles) {
  profile.isFollowing = true
  profile.notifications = notifications   // ← add this line
}

    // 5️⃣ Render the home view
    res.render('../odinbook/views/home', {
      profiles,
      user: req.user,
      path: req.path,
      minutesAgo,
      term: '' ,         // or whatever default you want
      notifications   // ← add this
    })
  } catch (err) {
    next(err)
  }
}

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    // Send the user back to the page they came from
    res.redirect('home')
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

