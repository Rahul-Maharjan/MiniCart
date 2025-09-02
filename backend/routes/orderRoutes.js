const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  updateStatus,
  listOrders,
} = require("../controller/orderContorller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Customer routes
router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/pay", authMiddleware, payOrder);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, listOrders);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateStatus);

module.exports = router;
