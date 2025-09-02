const Product = require("../models/productModel");

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const postProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "name, price, category are required" });
    }
    let image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`; // served statically
    } else if (req.body.image) {
      image = req.body.image; // fallback to URL from body
    }
    const product = new Product({ name, price, category, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error creating product" });
  }
};

module.exports = { getProduct, postProduct };
