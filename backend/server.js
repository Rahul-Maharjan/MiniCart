const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Validate essential env vars early
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === "") {
  console.error("FATAL: JWT_SECRET is missing in environment variables");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is missing in environment variables");
  process.exit(1);
}

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MiniCart API" });
});

// Health endpoint for deployment diagnostics
app.get("/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

(async () => {
  try {
    console.log("[Bootstrap] Starting server initialization...");
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("[Bootstrap] Failed to start server:", err.message);
    process.exit(1);
  }
})();

module.exports = app;
