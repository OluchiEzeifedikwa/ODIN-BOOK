import passport from 'passport';

const login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/home');
    });
  })(req, res, next);
};

export default { login };
