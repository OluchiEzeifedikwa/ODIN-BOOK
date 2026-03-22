import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'odinbook/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'odinbook/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
