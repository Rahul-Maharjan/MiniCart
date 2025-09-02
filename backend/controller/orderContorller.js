const e = require("express");
const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, address } = req.body;

    if (!userId || !products || !totalAmount || !address) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      address,
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder };

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

express.Router().get("/:id", getOrder);