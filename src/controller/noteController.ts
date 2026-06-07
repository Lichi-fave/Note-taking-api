import { Request, Response, NextFunction } from "express";
import Note from "../model/noteModel";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

// GET /api/notes - list notes with search, filter, sorting, and pagination
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { search, category, sort, page, limit } = req.query;

    // always filter notes by the authenticated user and exclude archived notes
    const filter: Record<string, unknown> = {
      user: req.user?.userId,
      isArchived: false,
    };

    // if a category id is passed, add it to the filter
    if (category) {
      filter.category = category;
    }

    // if a search term is passed, use mongodb full-text search on title and content fields
    if (search && typeof search === "string") {
      filter.$text = { $search: search };
    }

    // pagination: default to page 1 and limit 10 if not provided
    const pageNumber = Math.max(1, parseInt(page as string) || 1);
    const limitValue = Math.min(
      20,
      Math.max(1, parseInt(limit as string) || 10),
    );
    const skip = (pageNumber - 1) * limitValue;

    // sorting: prefix field names with '-' to indicate descending order(default: newest first)
    const sortField = (sort as string) || "-createdAt";
    const sortOptions = sortField.startsWith("-")
      ? { [sortField.slice(1)]: -1 }
      : { [sortField]: 1 };

    // run data query and count query in parallel for better performance
    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate("category", "name description") // populate category details
        .sort(sortOptions as Record<string, 1 | -1>) // apply sorting
        .skip(skip)
        .limit(limitValue),
      Note.countDocuments(filter),
    ]);

    res.status(HTTP_STATUS.OK).json({
      data: notes,
      pagination: {
        total,
        page: pageNumber,
        limit: limitValue,
        totalPages: Math.ceil(total / limitValue),
        hasNextPage: pageNumber < Math.ceil(total / limitValue),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error); // pass the error to the global error handler
  }
};

// GET /api/notes/:id - get a specific note
export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user?.userId,
      isArchived: false,
    }).populate("category", "name description");

    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json(note);
  } catch (error) {
    next(error);
  }
};

// GET /api/notes/category/:categoryId - get notes by category
export const getNotesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // only find notes that belong to the authenticated user and match the category ID
    const notes = await Note.find({
      category: req.params.categoryId,
      user: req.user?.userId,
      isArchived: false,
    }).populate("category", "name description");

    if (!notes.length) {
      throw new AppError(
        "No notes found for this category",
        HTTP_STATUS.NOT_FOUND,
      );
    }
    res.status(HTTP_STATUS.OK).json(notes);
  } catch (error) {
    next(error);
  }
};

// POST /api/notes - create a new note
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
    next(error);
  }
};

// PUT /api/notes/:id - update a note
export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // strip out user and isArchived so they can't be updated through this endpoint
    const { user, isArchived, ...updateData } = req.body; // extracts title, content, and category from the request body
    // find the note by its ID and the authenticated user's ID, then update it with the new data
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId, isArchived: false }, // only update if the note belongs to the authenticated user and is not archived
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
    next(error);
  }
};

// DELETE /api/notes/:id - soft delete a note
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?.userId,
        isArchived: false,
      },
      { isArchived: true },
      { new: true },
    ); // find and check if the note belongs to the authenticated user and is not archived before soft deleting

    if (!note) {
      throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
    }
    res.status(HTTP_STATUS.OK).json({ message: "Note archived successfully" });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notes/:id/restore - restore an archived note
export const restoreNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?.userId,
        isArchived: true,
      },
      { isArchived: false },
      { new: true },
    ); // find and check if the note belongs to the authenticated user and is archived before restoring

    if (!note) {
      throw new AppError("Archived note not found", HTTP_STATUS.NOT_FOUND);
    }
    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Note restored successfully", data: note });
  } catch (error) {
    next(error);
  }
};

// GET /api/notes/archived - get all archived notes for the authenticated user
export const getArchivedNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const notes = await Note.find({
      user: req.user?.userId,
      isArchived: true,
    }).populate("category", "name description"); // find all archived notes that belong to the authenticated user

    res.status(HTTP_STATUS.OK).json(notes);
  } catch (error) {
    next(error);
  }
};
