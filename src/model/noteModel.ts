import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./categoryModel";
import { IUser } from "./userModel";

// this is the typescript interface that defines the structure of a Note document
export interface INote extends Document {
  title: string;
  content: string;
  category: ICategory["_id"]; // reference to the category document
  user: IUser["_id"]; // reference to the user document
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
    category: {
      type: Schema.Types.ObjectId, // store the category as an ObjectId reference
      ref: "Category", // tells mongoose it links to the Category model
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId, // store the user as an ObjectId reference
      ref: "User", // tells mongoose it links to the User model
      required: true,
    },
  },
  { timestamps: true }, // auto-manage createdAt and updatedAt fields
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
