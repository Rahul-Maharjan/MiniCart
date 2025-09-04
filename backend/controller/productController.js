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
    const product = new Product({ name, price, category, description });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error creating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    await prod.deleteOne();
    res.json({ message: "Deleted", _id: req.params.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error deleting product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "name, price, category are required" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error updating product" });
  }
};

module.exports = { getProduct, postProduct, deleteProduct, updateProduct };
