import minutesAgo from '../services/minutesAgo.js';
import { getHomePageData } from '../services/homeService.js';

// Render the home page
const getHomePage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    const { profiles, notifications } = await getHomePageData(req.user.id);

    res.render('pages/home', {
      title: "Home",
      profiles,
      notifications,
      user: req.user,
      path: req.path,
      minutesAgo,
      term: '',
    });
  } catch (err) {
    next(err);
  }
};


export default {
  getHomePage,
};
