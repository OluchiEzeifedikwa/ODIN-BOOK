import minutesAgo from '../services/minutesAgo.js';
import { getHomePageData } from '../services/homeService.js';

const getHomePage = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect('/login');

    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const { posts, nextCursor } = await getHomePageData(req.user.id, cursor);

    // Infinite scroll asks for just the next batch of posts as an HTML fragment
    if (req.query.partial) {
      return res.render('partials/feedPosts', { layout: false, posts, user: req.user }, (err, html) => {
        if (err) return next(err);
        res.json({ html, nextCursor });
      });
    }

    res.render('pages/home', {
      title: "Home",
      posts,
      nextCursor,
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
