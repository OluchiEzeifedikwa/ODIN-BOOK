
const { Router } = require('express');
const searchRouter = Router();
const searchController = require('../controllers/likeController');

searchRouter.get('/search', authMiddleware, searchController.searchUsers)