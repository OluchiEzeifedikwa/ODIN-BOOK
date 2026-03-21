const authMiddleware = (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  next();
};

export default authMiddleware;
