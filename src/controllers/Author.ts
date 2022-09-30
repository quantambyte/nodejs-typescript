import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Author from '../models/Author';

const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const author = new Author({
      _id: new mongoose.Types.ObjectId(),
      name
    });

    await author.save();
    res.status(201).json({ author });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const readAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.params.authorId;
    const author = await Author.findById(authorId);
    author
      ? res.status(200).json({ author })
      : res.status(404).json({ message: 'Author Not Found' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authors = await Author.find();
    res.status(200).json({ authors });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId;
    const author = await Author.findById(authorId);

    if (author) {
      author.set(req.body);

      await author.save();
      res.status(201).json({ author });
    } else {
      res.status(404).json({ message: 'Author Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.authorId;
    const author = await Author.findByIdAndDelete(authorId);
    if (author) {
      res.status(201).json({ message: 'Author Deleted' });
    } else {
      res.status(404).json({ message: 'Author Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  createAuthor,
  readAll,
  readAuthor,
  updateAuthor,
  deleteAuthor
};
