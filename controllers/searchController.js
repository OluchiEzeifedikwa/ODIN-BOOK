import { searchUsers as searchUsersService } from '../services/searchService.js';

const searchUsers = async (req, res, next) => {
  try {
    const term = req.query.q?.trim() || '';
    const users = await searchUsersService(term, req.user.id);
    res.render('pages/search', { users, term, searchTerm: term });
  } catch (err) {
    next(err);
  }
};

export default {
  searchUsers,
};
