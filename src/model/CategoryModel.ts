import mongoose, { Document, Schema } from "mongoose";

// this is the category interface
export interface ICategory extends Document {
  name: string;
  description: string;
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
  },
  { timestamps: true }, // auto-manage createdAt and updatedAt fields
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
