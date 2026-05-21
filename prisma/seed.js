import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = Array.from({ length: 20 }, (_, i) => ({
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: 'password123',
  bio: `Hey, I'm user${i + 1}. Sharing my world one post at a time.`,
  location: ['Lagos', 'London', 'New York', 'Accra', 'Nairobi', 'Toronto', 'Paris', 'Dubai'][i % 8],
  pronoun: ['he/him', 'she/her', 'they/them'][i % 3],
  profileImage: `https://picsum.photos/seed/profile${i + 1}/200/200`,
}));

const POST_CAPTIONS = [
  'Beautiful day outside 🌤️',
  'Loving this view!',
  'Just another amazing moment.',
  'Life is good.',
  'Making memories every day.',
  'Can\'t stop, won\'t stop.',
  'Grateful for everything.',
  'Living my best life.',
  'Adventures await.',
  'This is the moment.',
  'Good vibes only.',
  'Chasing sunsets.',
  'Blessed and stressed.',
  'One day at a time.',
  'Work hard, play harder.',
  'New day, new goals.',
  'Always moving forward.',
  'Smiling through it all.',
  'The journey continues.',
  'Moments like these.',
];

async function main() {
  console.log('Seeding database...');

  for (let i = 0; i < USERS.length; i++) {
    const userData = USERS[i];
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        profile: {
          create: {
            bio: userData.bio,
            location: userData.location,
            pronoun: userData.pronoun,
            image: userData.profileImage,
          },
        },
      },
    });

    // Create 20 posts per user
    for (let j = 0; j < 20; j++) {
      const imageId = i * 20 + j + 1;
      await prisma.post.create({
        data: {
          content: POST_CAPTIONS[j % POST_CAPTIONS.length],
          image: `https://picsum.photos/seed/post${imageId}/600/400`,
          userId: user.id,
        },
      });
    }

    console.log(`Created user${i + 1} with 20 posts`);
  }

  console.log('Seeding complete! 20 users, 400 posts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
