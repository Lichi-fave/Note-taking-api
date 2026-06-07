import { Request, Response } from "express";
import Note from "../model/noteModel";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

// GET /api/notes - list all notes
export const getAllNotes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const notes = await Note.find({ user: req.user?.userId }).populate(
      "category",
      "name description", // only return the name and description of the category
    ); // retrieves all notes from the database that belong to the authenticated user
    res.status(HTTP_STATUS.OK).json(notes);
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
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user?.userId,
    }); // retrieves a note by its ID from the database
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
    // only find notes that belong to the authenticated user and match the category ID
    const notes = await Note.find({
      category: req.params.categoryId,
      user: req.user?.userId,
    }).populate("category", "name description");

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

// POST /api/notes - create a new note
export const createNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, category } = req.body; // extracts title, content, and category from the request body
    const note = await Note.create({
      title,
      content,
      category,
      user: req.user?.userId,
    }); // creates a new note in the database

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

// PUT /api/notes/:id - update a note
export const updateNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user, ...updateData } = req.body; // extracts title, content, and category from the request body
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      updateData,
      {
        new: true,
        runValidators: true,
      }, // returns the updated note
    );
    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Note updated successfully", data: note });
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
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.userId,
    }); // find and check if the note belongs to the authenticated user before deleting
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
