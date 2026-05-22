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
} from "./controller";
import { HTTP_STATUS } from "./constants";
import { AppError } from "./errors";

dotenv.config(); // reads .env file so process.env can access the variables

const app = express(); // creates an Express application which will handle incoming HTTP requests and send responses

const PORT = process.env.PORT || 3000; // tells express "expect JSON data from requests"

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
app.use(cors()); // enables CORS for all routes, allowing requests from any origin

// routes for handling notes
app.get("/api/notes", getAllNotes);
app.get("/api/notes/:id", getNoteById);
app.post("/api/notes", createNote);
app.put("/api/notes/:id", updateNote);
app.delete("/api/notes/:id", deleteNote);

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
