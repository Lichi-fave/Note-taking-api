import mongoose, { Document, Schema } from "mongoose";

// this is the typescript interface that defines the structure of a User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// authentiction interfaces
export interface IRegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// JWT payload interface
export interface IJwtPayload {
  userId: string;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"],
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
