const express = require("express");
const router = express.Router();
const { getProduct, postProduct } = require("../controller/productController");

// GET all products
router.get("/", getProduct);

// POST add product (JSON only)
router.post("/", postProduct);

module.exports = router;
