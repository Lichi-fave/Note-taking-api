import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../model/userModel";
import { AppError } from "../errors";
import { HTTP_STATUS } from "../constants";

// extend the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload; // this will hold the decoded JWT payload if the user is authenticated
    }
  }
}

// type guard to check if the payload is a valid IJwtPayload
export const isJwtPayload = (payload: any): payload is IJwtPayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as IJwtPayload).userId === "string" &&
    typeof (payload as IJwtPayload).email === "string"
  );
};

// authentication middleware to protect routes
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // check if token exists in the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "No token provided. Please login",
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // extract the token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // verify the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // use type guard to ensure decoded is of type IJwtPayload
    if (!isJwtPayload(decoded)) {
      throw new AppError("Invalid token payload", HTTP_STATUS.UNAUTHORIZED);
    }

    // attach user info to the request
    req.user = decoded;

    // call the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error); // pass the error to the global error handler
    } else {
      next(
        new AppError(
          "An unexpected error occurred during authentication",
          HTTP_STATUS.UNAUTHORIZED,
        ),
      );
    }
  }
};
