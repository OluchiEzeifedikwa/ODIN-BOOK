import { Router } from 'express';
import searchController from '../controllers/searchController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const searchRouter = Router();

searchRouter.get(
  '/search',
  authMiddleware,
  searchController.searchUsers
);

export default searchRouter;
