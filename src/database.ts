import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
