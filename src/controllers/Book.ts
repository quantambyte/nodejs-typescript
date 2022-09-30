import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author } = req.body;

    const book = new Book({
      _id: new mongoose.Types.ObjectId(),
      title,
      author
    });

    await book.save();
    res.status(201).json({ book });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const readBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId).populate('author').select('-__v');
    book
      ? res.status(200).json({ Book })
      : res.status(404).json({ message: 'Book Not Found' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find().populate('author').select('-__v');
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    if (book) {
      book.set(req.body);

      await book.save();
      res.status(201).json({ book });
    } else {
      res.status(404).json({ message: 'Book Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findByIdAndDelete(bookId);
    if (book) {
      res.status(201).json({ message: 'Book Deleted' });
    } else {
      res.status(404).json({ message: 'Book Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  createBook,
  readAll,
  readBook,
  updateBook,
  deleteBook
};
