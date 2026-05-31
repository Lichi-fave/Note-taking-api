import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import { HTTP_STATUS } from "../constants";

// this is a generic middleware function to validate incoming request data for creating or updating notes. T is the blank label
export const validateNoteData = <T>(validator: (data: T) => string | null) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // run the provided validator function on the request body
      const errorMessage = validator(req.body as T);

      if (errorMessage) {
        // if the validation fails, stop the request and send a 400 response with the error message
        throw new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST);
      }

      // if validation passes, let the request continue to the next middleware or route handler
      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HTTP_STATUS.SERVER_ERROR)
          .json({ message: "An unexpected error occurred" });
      }
    }
  };
};

// validate function for note data
export const validateNoteDataForNote = (data: {
  title: string;
  content: string;
  category: string;
}): string | null => {
  const VALID_TITLE = /^[\w\s.,!?'"-]{3,100}$/; // allows letters, numbers, spaces and basic punctuation, 3-100 chars
  const VALID_CONTENT = /^[\w\s.,!?'"-]{5,1000}$/; // allows letters, numbers, spaces and basic punctuation, 5-1000 chars

  if (!data.title || !data.content || !data.category) {
    return "Title, content, and category are required";
  }

  if (!VALID_TITLE.test(data.title)) {
    return "Title must be 3-100 characters and contain only letters, numbers and basic punctuation";
  }

  if (!VALID_CONTENT.test(data.content)) {
    return "Content must be 5-1000 characters and contain only letters, numbers and basic punctuation";
  }

  return null; // null means validation passed
};

// validator function for category data
export const validateCategoryData = (data: {
  name: string;
  description: string;
}): string | null => {
  if (!data.name || !data.description) {
    return "Name and description are required";
  }
  if (data.name.length < 2 || data.name.length > 50) {
    return "Category name must be between 2 and 50 characters long";
  }
  if (data.description.length < 5) {
    return "Category description must be at least 5 characters long";
  }

  return null; // null means validation passed
};
