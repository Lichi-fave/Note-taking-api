import mongoose, { Document, Schema } from "mongoose";

// this is the typescript interface that defines the structure of a Note document
export interface INote extends Document {
  title: string;
  content: string;
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

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
