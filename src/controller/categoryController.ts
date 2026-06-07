import { Request, Response } from "express";
import Category from "../model/categoryModel";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

// GET /api/categories - list all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await Category.find({ user: req.user?.userId }); // retrieves all categories from the database
    res.status(HTTP_STATUS.OK).json(categories);
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

// POST /api/categories - create a new category
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body; // extracts name and description from the request body
    const category = await Category.create({
      name,
      description,
      user: req.user?.userId,
    }); // creates a new category in the database
    res.status(HTTP_STATUS.CREATED).json(category); // sends the created category as a JSON response with HTTP 201 status
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};
