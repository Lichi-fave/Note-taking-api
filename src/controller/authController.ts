import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, {
  IRegisterInput,
  ILoginInput,
  IJwtPayload,
} from "../model/userModel";
import { AppError } from "../errors";
import { HTTP_STATUS } from "../constants";

// helper function to generate JWT token
const generateToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  }); // token expires in 1 hour
};

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { firstName, lastName, email, password }: IRegisterInput = req.body;

    // check if all fields are provided
    if (!firstName || !lastName || !email || !password) {
      throw new AppError(
        "First name, Last name, email and password are required",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", HTTP_STATUS.BAD_REQUEST);
    }

    // hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with hashed password
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // generate JWT token for the new user
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // send back user info and token
    res.status(HTTP_STATUS.CREATED).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
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

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password }: ILoginInput = req.body;

    // check if all fields are provided
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", HTTP_STATUS.BAD_REQUEST);
    }

    // compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", HTTP_STATUS.BAD_REQUEST);
    }

    // generate JWT token for the authenticated user
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // send back user info and token
    res.status(HTTP_STATUS.OK).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
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
