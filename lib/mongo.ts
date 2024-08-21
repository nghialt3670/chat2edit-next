import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let cachedClient: mongoose.Mongoose | null = null;

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cachedClient) {
    return cachedClient;
  }

  const options: mongoose.ConnectOptions = {};

  cachedClient = await mongoose.connect(MONGODB_URI, options);
  return cachedClient;
}

export default connectToDatabase;
