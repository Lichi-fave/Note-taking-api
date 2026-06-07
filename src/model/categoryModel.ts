import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModel";

// this is the category interface
export interface ICategory extends Document {
  name: string;
  description: string;
  user: IUser["_id"]; // reference to the user document
  createdAt: Date;
  updatedAt: Date;
}

// this is the mongoose schema that defines how the Category document will be stored in the database
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: true,
      minlength: [5, "Category description must be at least 5 characters long"],
    },
    user: {
      type: Schema.Types.ObjectId, // store the user as an ObjectId reference
      ref: "User", // tells mongoose it links to the User model
      required: true,
    },
  },
  { timestamps: true }, // auto-manage createdAt and updatedAt fields
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
