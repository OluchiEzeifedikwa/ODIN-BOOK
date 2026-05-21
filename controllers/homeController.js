import minutesAgo from '../services/minutesAgo.js';
import { getHomePageData } from '../services/homeService.js';

const getHomePage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    const { profiles } = await getHomePageData(req.user.id);

    res.render('pages/home', {
      title: "Home",
      profiles,
      user: req.user,
      path: req.path,
      minutesAgo,
      term: '',
    });
  } catch (err) {
    next(err);
  }
};

export default { getHomePage };
