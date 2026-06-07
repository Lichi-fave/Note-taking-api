import { Request, Response, NextFunction } from "express";
import Category from "../model/categoryModel";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

// GET /api/categories - list all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categories = await Category.find({ user: req.user?.userId }); // retrieves all categories from the database
    res.status(HTTP_STATUS.OK).json(categories);
  } catch (error) {
    next(error); // pass the error to the global error handler
  }
};

// POST /api/categories - create a new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, description } = req.body; // extracts name and description from the request body

    // check for duplicate category name for the same user
    const existingCategory = await Category.findOne({
      name,
      user: req.user?.userId,
    });
    if (existingCategory) {
      throw new AppError(
        "Category name already exists",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const category = await Category.create({
      name,
      description,
      user: req.user?.userId,
    }); // creates a new category in the database
    res.status(HTTP_STATUS.CREATED).json(category); // sends the created category as a JSON response with HTTP 201 status
  } catch (error) {
    next(error); // pass the error to the global error handler
  }
};
