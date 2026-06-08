import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database";
import {
  getAllNotes,
  getNoteById,
  getNotesByCategory,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  getArchivedNotes,
} from "./controller/noteController";
import {
  getAllCategories,
  createCategory,
} from "./controller/categoryController";
import { register, login } from "./controller/authController";
import {
  validateNoteData,
  validateNoteDataForNote,
  validateCategoryData,
} from "./middleware/validate";
import { logger } from "./middleware/logger";
import { authenticate } from "./middleware/auth";
import { AppError } from "./errors";
import { HTTP_STATUS } from "./constants";

dotenv.config(); // reads .env file so process.env can access the variables

const app = express(); // creates an Express application which will handle incoming HTTP requests and send responses

const PORT = process.env.PORT || 3000; // tells express "expect JSON data from requests"

// Middleware to parse JSON bodies from incoming requests
app.use(cors()); // enables CORS for all routes, allowing requests from any origin

app.use(express.json());

app.use(logger); // applies the logger middleware to all incoming requests

// route for rendering the home page
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Note Taking API",
    status: "Running",
    documentation: "https://documenter.getpostman.com/view/39328624/2sBXwqrAY6",
  });
});

// Public routes for authentication
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// routes for handling categories- protected by authentication middleware
app.get("/api/categories", authenticate, getAllCategories);
app.post(
  "/api/categories",
  authenticate,
  validateNoteData(validateCategoryData), // middleware that runs before you create category
  createCategory,
);

// protected note routes
app.get("/api/notes/archived", authenticate, getArchivedNotes);
app.get("/api/notes/category/:categoryId", authenticate, getNotesByCategory);
app.get("/api/notes", authenticate, getAllNotes);
app.get("/api/notes/:id", authenticate, getNoteById);
app.post(
  "/api/notes",
  authenticate,
  validateNoteData(validateNoteDataForNote),
  createNote,
);
app.put(
  "/api/notes/:id",
  authenticate,
  validateNoteData(validateNoteDataForNote),
  updateNote,
);
app.put("/api/notes/:id/restore", authenticate, restoreNote);
app.delete("/api/notes/:id", authenticate, deleteNote);

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    // If the error is an instance of AppError, send the specific status code and message
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Unhandled error:", err); // Log the error for debugging purposes
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
