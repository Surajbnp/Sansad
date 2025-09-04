import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment variables");
}

let isConnected = false;

async function database() {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "Sansadapp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export default database;
