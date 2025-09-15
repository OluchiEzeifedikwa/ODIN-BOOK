
exports.cookieJwtAuth = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
      return res.redirect('/'); 
    }
  
    const token = req.cookies.token;
  
    try {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      res.clearCookie("token");
      return res.redirect('/');
    }
  };