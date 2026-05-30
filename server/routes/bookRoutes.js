import express from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook); // Note: using POST /api/books for creating

router.route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

export default router;
