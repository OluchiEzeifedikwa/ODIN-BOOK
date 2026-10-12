import { wantsHtml } from './requestType.js';

const authMiddleware = (req, res, next) => {
  if (req.user) return next();
  // A fetch() whose session expired can't follow a redirect to the login page
  if (!wantsHtml(req)) return res.status(401).json({ message: 'Please log in again' });
  res.redirect('/login');
};

export default authMiddleware;
