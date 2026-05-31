import mongoose, { Document, Schema } from "mongoose";

// this is the typescript interface that defines the structure of a Note document
export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// this is the category interface
export interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// this is the mongoose schema that defines how the Note document will be stored in the database
const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      // proper validator to check quality of title
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: true,
      // proper validator to check quality of content
      minlength: [5, "Content must be at least 5 characters long"],
    },
  },
  { timestamps: true }, // auto-manage createdAt and updatedAt fields
);

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

const Note = mongoose.model<INote>("Note", noteSchema);
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default { Note, Category };
