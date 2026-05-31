import { Request, Response } from "express";
import Note from "../model/NoteModels";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

// regex patterns to validate title, content, and category

const VALID_TITLE = /^[a-zA-Z0-9\s.,!?'-]{3,100}$/; // allows letters, numbers, spaces, and common punctuation, with length between 3 and 100

const VALID_CONTENT = /^[\s\S]{5,1000}$/; // allows any characters including newlines, with length between 5 and 1000

// GET /api/notes - list all notes
export const getAllNotes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const notes = await Note.find(); // retrieves all notes from the database
    res.status(HTTP_STATUS.OK).json(notes); // sends the notes as a JSON response with HTTP 200 status
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

// GET /api/notes/:id - get a specific note
export const getNoteById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id); // retrieves a note by its ID from the database
    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(note);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
};

// POST /api/notes - create a new note
export const createNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, category } = req.body; // extracts title, content, and category from the request body
    const note = await Note.create({ title, content, category }); // creates a new note in the database
    res.status(HTTP_STATUS.CREATED).json(note); // sends the created note as a JSON response with HTTP 201 status
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
};

// DELETE /api/notes/:id - delete a note
export const deleteNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id); // deletes a note by its ID from the database
    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json({ message: "Note deleted successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
};

// PUT /api/notes/:id - update a note
export const updateNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, category } = req.body; // extracts title, content, and category from the request body
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }, // returns the updated note
    );
    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(note);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
};

// GET /api/notes/category/:categoryId - get notes by category
export const getNotesByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const notes = await Note.find({ category: req.params.categoryId }).populate(
      "category",
    ); // populate replaces the ID with the actual category data

    if (!notes.length) {
      throw new AppError(
        "No notes found for this category",
        HTTP_STATUS.NOT_FOUND,
      );
    }
    res.status(HTTP_STATUS.OK).json(notes);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
};
