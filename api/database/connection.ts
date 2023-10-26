import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

export function connectToDatabase() {
  if (!URI) {
    throw new Error("Please add your MONGODB_URI to .env");
  }
  mongoose.connect(URI).catch((err) => console.error(err));
}
