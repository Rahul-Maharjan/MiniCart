// Centralized MongoDB connection helper with caching (serverless-friendly)
const mongoose = require("mongoose");

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  if (!cached.promise) {
    console.log("[DB] Initiating MongoDB connection...");
    mongoose.set("strictQuery", false);
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000, // faster failover
        socketTimeoutMS: 45000,
      })
      .then((m) => {
        console.log("[DB] MongoDB connected:", m.connection.host);
        return m;
      })
      .catch((err) => {
        console.error("[DB] MongoDB connection error:", err.message);
        cached.promise = null; // allow retry on next call
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
