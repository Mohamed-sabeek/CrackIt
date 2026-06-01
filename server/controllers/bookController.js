import Book from '../models/Book.js';
import Notification from '../models/Notification.js';
import { convertDriveLink, convertDriveImageLink } from '../utils/driveHelper.js';

export const createBook = async (req, res) => {
  try {
    const { title, board, className, subject, resourceUrl, thumbnail } = req.body;

    const processedThumbnail = convertDriveImageLink(thumbnail);

    const newBook = new Book({
      title,
      board,
      className,
      subject,
      resourceUrl,
      thumbnail: processedThumbnail || `https://placehold.co/400x600/2563eb/ffffff?text=${encodeURIComponent(subject || 'Book')}`,
      uploadedBy: req.user ? req.user._id : null
    });

    const savedBook = await newBook.save();

    // Automatically trigger notification
    try {
      await Notification.create({
        title: '📚 New Study Material Added',
        message: `${savedBook.title} has been added to Study Library.`,
        type: 'study_material',
        createdBy: req.user ? req.user._id : null
      });
    } catch (notifErr) {
      console.error('Failed to create notification for study material:', notifErr);
    }

    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { board, className, subject, search } = req.query;

    let query = {};

    if (board && board !== 'All') {
      query.board = board;
    }
    if (className && className !== 'All') {
      query.className = className;
    }
    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.resourceUrl) {
      // Just keep resourceUrl as is
    }
    if (updates.thumbnail) {
      updates.thumbnail = convertDriveImageLink(updates.thumbnail);
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};
