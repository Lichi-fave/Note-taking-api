import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database";
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  getNotesByCategory,
} from "./controller/noteController";
import {
  getAllCategories,
  createCategory,
} from "./controller/categoryController";
import {
  validateNoteData,
  validateCategoryData,
  validateNoteDataForNote,
} from "./middleware/validate";
import { logger } from "./middleware/logger";
import { HTTP_STATUS } from "./constants";
import { AppError } from "./errors";

dotenv.config(); // reads .env file so process.env can access the variables

const app = express(); // creates an Express application which will handle incoming HTTP requests and send responses

const PORT = process.env.PORT || 3000; // tells express "expect JSON data from requests"

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
app.use(cors()); // enables CORS for all routes, allowing requests from any origin
app.use(logger); // applies the logger middleware to all incoming requests

// routes for handling categories
app.get("/api/categories", getAllCategories);
app.post(
  "/api/categories",
  validateNoteData(validateCategoryData),
  createCategory,
);

// routes for handling notes
app.get("/api/notes", getAllNotes);
app.get("/api/notes/:id", getNoteById);
app.post("/api/notes", validateNoteData(validateNoteDataForNote), createNote);
app.delete("/api/notes/:id", deleteNote);
app.get("/api/notes/category/:categoryId", getNotesByCategory); // new route to get notes by category
app.put("/api/notes/:id", validateNoteData, updateNote); // applies the validateNoteData middleware to the PUT /api/notes/:id route

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    // If the error is an instance of AppError, send the specific status code and message
    return res.status(err.statusCode).json({ message: err.message });
  }
  // For any other errors, send 500
  res
    .status(HTTP_STATUS.SERVER_ERROR)
    .json({ message: "Something went wrong" });
});

// Connect to the database and start the server

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
