const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// Validate essential env vars early
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === "") {
  console.error("FATAL: JWT_SECRET is missing in .env");
  process.exit(1);
}
// (Removed image upload static serving)
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const testRouters = require("./routes/testRoutes");


const app = express(); // Initialize Express app
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
// If future static assets needed, mount here.

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/test", testRouters);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
