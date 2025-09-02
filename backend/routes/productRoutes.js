const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProduct, postProduct } = require("../controller/productController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (png, jpg, jpeg, webp) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}); // 2MB limit

// GET all products
router.get("/", getProduct);

// POST add product (multipart/form-data) field name: image
router.post("/", upload.single("image"), postProduct);

module.exports = router;
