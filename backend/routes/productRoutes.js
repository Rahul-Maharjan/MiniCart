const express = require("express");
const router = express.Router();
const {
  getProduct,
  postProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// GET all products
router.get("/", getProduct);

// POST add product (JSON only)
router.post("/", authMiddleware, adminMiddleware, postProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
