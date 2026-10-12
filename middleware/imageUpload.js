import multer from 'multer';
import { httpError } from '../services/httpError.js';

const MAX_IMAGE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Single-image upload with size/type limits; problems become 400 errors with a readable message
export const imageUpload = (storage, field) => {
  const upload = multer({
    storage,
    limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
      // Skip the file rather than erroring, so multer still parses the rest of the form
      req.rejectedFileType = true;
      cb(null, false);
    },
  }).single(field);

  return (req, res, next) => upload(req, res, (err) => {
    if (!err && req.rejectedFileType) return next(httpError(400, 'Only JPG, PNG or WebP images are allowed'));
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') return next(httpError(400, `Images must be ${MAX_IMAGE_MB}MB or smaller`));
    next(err);
  });
};
